/* eslint-disable @next/next/no-async-client-component */
// "use client"

import { fullProject } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(slug:string){
    const query = `
    *[_type == "project" && slug.current == '${slug}']{
        title,
        proImg,
        summary,
        content,
        proDate,
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
    return(
        <div className="mt-10 grid h-fit place-items-center md:mt-28">
            <div className="z-10 w-11/12 max-w-screen-2xl">

                
                <div className="relative col-span-4 mb-4 ml-3 mt-0 flex w-full basis-full items-center py-2 md:mt-8">
                    <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                    <h1 className="flex text-2xl font-bold md:text-3xl">{data.title}</h1>
                </div>
                
                
                <div className="flex flex-wrap py-3">

                <div className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">                
                    <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
                        {/* image */}
                        <div className="flex basis-full justify-center rounded-xl border bg-cover bg-center">
                            <Image src={urlFor(data.proImg).url()} alt={data.slug+" image"} width={720} height={720} className="w-full rounded-xl bg-blue-400 bg-cover bg-center" priority />
                        </div>
                        
                        {/* skills */}
                        <div className="mt-3 basis-full p-3">
                            <div className="mt-2 flex flex-wrap">
                                <div className="mt-2 flex flex-wrap">
                                {data.tags.map((tag, idx) =>(
                                    <div key={idx} className="m-1 flex items-center rounded-md border border-primary/20 p-1 pr-2 text-sm leading-5 grayscale hover:grayscale-0">
                                        <Image src={urlFor(tag.tagImg).url()} alt={tag.title+" image"} width={22} height={22} className="mr-2 rounded-md"/> {tag.title}
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">                
                    <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
                        {/* overview */}
                        <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                            <PortableText value={data.summary} />
                        </div>
                    </div>
                </div>

                    <div className="relative col-span-4 ml-3 mt-8 flex w-full basis-full items-center py-2">
                        <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                        <h2 className="flex text-xl font-bold md:text-3xl">Summary</h2>
                    </div>

                    <div className="mt-3 flex basis-full flex-wrap p-3">
                        <Card className="h-full rounded-lg bg-secondary p-1" >
                            <CardContent className="p-4">
                                <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                                    <PortableText value={data.content} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative col-span-4 mb-4 ml-3 mt-6 flex w-full basis-full items-center py-2">
                        <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                        <h2 className="flex text-xl font-bold md:text-3xl">Screenshots</h2>
                    </div>
                    
                    <div className="basis-full md:p-5 lg:p-6">
                    <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                    >
                        <CarouselContent>
                            {data.gallery.map((gall, idx) => (
                                <CarouselItem key={idx} className="basis-full sm:basis-1/2 md:basis-1/3 md:p-2 lg:basis-1/4 lg:p-3">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="overflow-hidden rounded-xl p-0">
                                                <Image className="h-full w-full bg-cover bg-center" src={urlFor(gall.asset).url()} alt={idx+" image"} width={1000} height={1000}/>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center gap-5">
                            <CarouselPrevious />
                            <CarouselNext />
                        </div>
                        
                    </Carousel>
                    </div>

                    <div className="relative col-span-4 mb-4 ml-3 mt-6 flex w-full basis-full items-center py-2">
                        <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                        <h2 className="flex text-xl font-bold md:text-3xl">Links</h2>
                    </div>
                    
                    <div className="mb-8 basis-full p-3">
                        <Table className="relative h-full break-words rounded-lg bg-secondary">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.links.map((link, idx) =>(
                                <TableRow key={idx}>
                                    <TableCell className="font-medium" >{link.title}</TableCell>
                                    <TableCell>{link.description}</TableCell>
                                    <TableCell className="inline-flex break-words">
                                        <Button asChild variant="link" className="break-words">
                                            <Link href={link.url} rel="noopener noreferrer" target="_blank">
                                                
                                                <span className="hidden sm:hidden lg:block">{link.url}</span>
                                                <ArrowUpRightFromSquare className="ml-2" size={16}/></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}