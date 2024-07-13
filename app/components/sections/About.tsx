import { aboutNTag } from "@/app/lib/interface";
import { client,  urlFor } from "@/app/lib/sanity";
import { PortableText } from "@portabletext/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import GraphSection from "./GraphSection";

export const revalidate = 30 // revalidate at most 30 sec
async function getData(){
    const query = `
    {
    "about": *[_type == "about"]{ content },
    "tags": *[_type == "tag"]{
        "tag_name": title,
        "tag_url": tagImg,	
        "tag_count": count(*[_type == "project" && references(^._id)])
        }[tag_count > 0] | order(tag_name asc) | order(tag_count desc)
    }
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function About(){
    const data:aboutNTag = await getData();
    return(
    <div className="mb-8 grid h-fit place-items-center py-6">

        <div className="z-10 w-11/12 max-w-screen-2xl">

            <div className="relative col-span-2 mb-4 ml-3 flex basis-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="flex text-2xl font-bold md:text-3xl">About me</span>
            </div>

            <div className="flex flex-wrap justify-between py-3">
                <div className="mb-2 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">
                    <div className="relative h-fit rounded-lg bg-secondary p-6 font-normal shadow-sm">

                        <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                            <PortableText value={data.about[0].content} />
                        </div>
                    </div>
                </div>
            

            {/* Links */}
            <div className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">                
                <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
                    <GraphSection/>

                    <div className="mt-4 text-lg font-medium sm:text-base">Skills</div>
                    <TooltipProvider>
                    <div className="mt-2 flex flex-wrap">
                        {data.tags.map((tag, idx) =>(
                        <Tooltip key={idx}>
                            <TooltipTrigger>
                                <div  className="m-1 flex items-center rounded-md border border-primary/40 px-2 py-0.5 text-xs leading-5 md:text-sm">
                                    {tag.tag_name}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="flex">
                                <Image src={urlFor(tag.tag_url).url()} alt={tag.tag_name+" image"} width={22} height={22} className="mr-2 rounded-md"/><span> x{tag.tag_count}</span>
                            </TooltipContent>
                        </Tooltip>    
                        ))}
                    </div>
                    </TooltipProvider>
                </div>
            </div>
            </div>
        </div>
    </div>
    );
}