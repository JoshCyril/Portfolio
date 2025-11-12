import { client } from "@/app/lib/sanity";
import { simpleProject } from "@/app/lib/interface";
import ProjectsPageAnimated from "../components/ProjectsPageAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(limit: number = 6, offset: number = 0){
    const query = `
    *[_type == "project"]|order(pDate desc)[${offset}...${offset + limit}]{
        title,
        proImg,
        "link": links[0]{title,url},
        "slug": slug.current,
        description,
        proDate,
        featured,
        "tags": tags[]->{
          title,
          tagImg
        },
        "tagCount": 0
      }
    `;

    const data = await client.fetch(query);
    return data;
}

async function getTags() {
    const query = `
    *[_type == "tag"]{
        "tag_name": title,
        "tag_url": tagImg,
        "tag_count": count(*[_type == "project" && references(^._id)])
      } | order(tag_count desc)
    `;
    const data = await client.fetch(query);
    // Filter tags where tag_count > 0 and sort by tag_count descending
    return data.filter((tag: { tag_count: number }) => tag.tag_count > 0);
}

async function getTotalCount(): Promise<number> {
    const query = `count(*[_type == "project"])`;
    const count: number = await client.fetch(query);
    return count;
}

export default async function projects(){
    const initialProjects:simpleProject[] = await getData(6, 0);
    const totalCount = await getTotalCount();
    const tags = await getTags();

    return <ProjectsPageAnimated initialProjects={initialProjects} totalCount={totalCount} tags={tags} />;
}
