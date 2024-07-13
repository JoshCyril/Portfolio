import Link from "next/link";
import { client } from "@/app/lib/sanity";
import { simpleProject } from "@/app/lib/interface";
import ProjectCard from "../components/ProjectCard";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    *[_type == "project"]|order(pDate desc){
        title,
        proImg,
        "link": links[0]{title,url},
        "slug": slug.current,
        description,
        proDate,
        "tags": tags[0...3]->{
          title,
          tagImg
        },
        "tagCount": count(tags)-3
      }
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function projects(){
    const data:simpleProject[] = await getData();

    return (
        <div className="mb-10 grid h-fit place-items-center py-6 md:mt-28">

        <div className="z-10 w-11/12 max-w-screen-2xl">

            <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="flex text-2xl font-bold md:text-3xl">Check out my Projects</span>
            </div>

            <div className="div flex flex-wrap py-3">
                {data.map((project, idx) =>(
                    <ProjectCard key={idx} {...project} />
                ))}
            </div>
        </div>
    </div>
    )
}