import Link from "next/link";
import { client } from "@/app/lib/sanity";
import { simpleProject } from "@/app/lib/interface";
import ProjectsPageClient from "../components/ProjectsPageClient";

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

    return (
        <div className="mb-10 grid h-fit place-items-center py-6 md:mt-28">

        <div className="z-10 w-11/12 max-w-screen-2xl">

            <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="flex text-2xl font-bold md:text-3xl">Check out my Projects</span>
            </div>

            <ProjectsPageClient initialProjects={initialProjects} totalCount={totalCount} tags={tags} />
        </div>
    </div>
    )
}
