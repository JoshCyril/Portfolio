import { Laptop2, Box, PencilRuler } from "lucide-react";
import { Ee3 } from "@/app/lib/interface";
import { client,  urlFor } from "@/app/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";


export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    {
        "exp":*[_type == "experience"]{
            title,
            yoe,
            content,
            company{
            name,
            location,
            url,
            Img
            }
        },
        "edu":*[_type == "education"]{
        title,
        uni{
            name,
            location,
            url,
            Img
            }
        }

    }
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function E3(){
    const data:Ee3 = await getData();
    return(
        <div className="mb-5 grid h-fit place-items-center py-6">

            <div className="z-10 w-11/12 max-w-screen-2xl">


                <div className="relative col-span-2 mb-4 ml-3 flex basis-full items-center py-2">
                    <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                    <span className="flex text-2xl font-bold md:text-3xl">Experiences</span>
                </div>

                <div className="div flex flex-wrap justify-between py-3">


                    <div className="mb-2 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">
                        <div className="div flex flex-wrap">
                            {data.exp.map((eu, idx) =>(
                                <div key={idx} className="mb-5 basis-full px-3">
                                    <div className="relative h-fit rounded-lg bg-secondary p-1 shadow-sm">
                                        <div className="grid grid-cols-5">
                                            <div className="relative col-span-1 grid h-20 w-full place-items-center overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 object-cover shadow-inner">
                                                <Image src={urlFor(eu.company.Img).url()} alt={eu.company.name+" image"} width={120} height={120} className="z-20 ml-10 h-full w-full rounded-3xl bg-primary object-cover shadow-2xl transition duration-0 ease-in-out hover:mr-3 hover:duration-300" />
                                            </div>
                                            <div className="col-span-4 ml-2 p-2 pr-3">
                                                <div className="mb-2 grid grid-cols-3">
                                                    <div className="col-span-1 text-lg font-semibold">{eu.title}</div>
                                                    <div className="text-md col-span-2 mt-1 text-right font-medium">{eu.yoe}</div>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    {eu.company.name} | {eu.company.location}
                                                </div>

                                            </div>

                                        </div>

                                        <div className="prose prose-lg prose-blue ml-4 max-w-none p-3 text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                                            <PortableText value={eu.content} />
                                        </div>

                                    </div>
                                </div>
                        	))}
                        </div>
                    </div>


                    <div className="relative mb-2 mt-24 basis-full p-3 sm:mt-24 sm:basis-full md:basis-full lg:mt-0 lg:basis-1/4">

                        <div className="absolute -top-[5.5rem] -ml-0.5 flex basis-full items-center py-2">
                            <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                            <span className="flex text-2xl font-bold md:text-3xl">Education</span>
                        </div>

                        <div className="div flex flex-wrap">

                            {data.edu.map((ed, idx) =>(
                            <div key={idx} className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/2 lg:basis-full">
                                <div className="relative h-fit rounded-lg bg-secondary p-1 shadow-sm">
                                    <div className="grid grid-cols-4">
                                    <div className="relative col-span-1 grid h-20 w-full place-items-center overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 object-cover shadow-inner">
                                            <Image src={urlFor(ed.uni.Img).url()} alt={ed.uni.name+" image"} width={120} height={120} className="z-20 ml-10 h-full w-full rounded-3xl bg-primary object-cover shadow-2xl transition duration-0 ease-in-out hover:mr-3 hover:duration-300" />
                                        </div>
                                        <div className="col-span-3 ml-2 p-2">
                                            <div className="BigProjectSTitle mb-1 text-xl font-semibold">{ed.title}</div>
                                            <div className="flex-col items-center text-sm">
                                                <div>{ed.uni.name} </div>
                                                <div>{ed.uni.location} </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            ))}

                        </div>

                    </div>


                    <div className="relative mb-2 mt-24 basis-full p-3 sm:mt-24 sm:basis-full md:basis-full lg:mt-0 lg:basis-1/4">

                        <div className="absolute -top-[5.5rem] -ml-0.5 flex basis-full items-center py-2">
                            <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                            <span className="flex text-2xl font-bold md:text-3xl">Expertise</span>
                        </div>

                        <div className="div flex flex-wrap">

                            <div className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full">
                                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                                    <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                                    <Laptop2 strokeWidth={0.5} absoluteStrokeWidth />
                                    </div>
                                    <div className="ml-3 flex items-center p-2">
                                        <div className="font-regular">Web Architect
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full">
                                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                                    <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                                    <Box strokeWidth={0.5} absoluteStrokeWidth />
                                    </div>
                                    <div className="ml-3 flex items-center p-2">
                                        <div className="font-regular">Custom AI Agent
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full">
                                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                                    <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                                    <PencilRuler strokeWidth={0.5} absoluteStrokeWidth />
                                    </div>
                                    <div className="ml-3 flex items-center p-2">
                                        <div className="font-regular">Workflow Automation
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
