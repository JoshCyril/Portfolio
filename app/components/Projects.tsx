import { client } from "../lib/sanity";
import { simpleProject } from "../lib/interface";
import ProjectsAnimated from "./ProjectsAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    *[_type == "project" && featured == true]{
        title,
        proImg,
        "link": links[0]{title,url},
        "slug": slug.current,
        description,
        proDate,
        "tags": tags[0...3]->{
          title,
          tagImg
        } | order(title asc),
        "tagCount": count(tags)-3
      }
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function projects(){
    const data:simpleProject[] = await getData();
    return <ProjectsAnimated projects={data} />;
}
