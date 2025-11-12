import { fullProject } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import ProjectDetailAnimated from "@/app/components/ProjectDetailAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(slug:string){
    const query = `
    *[_type == "project" && slug.current == '${slug}']{
        title,
        proImg,
        summary,
        content,
        proDate,
        "slug": slug.current,
        "links":links[]{
            title,
            description,
            url
          },
        gallery[]{asset},
        "tags": tags[]->{
          title,
          tagImg
        } | order(title asc),
      }[0]
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function ProjectRoute({params}:{params:{slug:string}}){
    const data:fullProject = await getData(params.slug);
    return <ProjectDetailAnimated data={data} />
}
