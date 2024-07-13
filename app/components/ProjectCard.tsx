import { simpleProject } from "../lib/interface";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRightFromSquare, File } from "lucide-react";
import { urlFor } from "../lib/sanity";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ProjectCard(project:simpleProject) {
    return(
        <TooltipProvider>
            <div  className="basis-full p-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4" >
                <Card className="rounded-lg p-1 shadow hover:shadow-md" >
                    {/* image */}
                    <div className="relative grid h-40 place-items-center overflow-hidden rounded-lg bg-background bg-gradient-to-r from-primary/10 to-primary/20 object-cover shadow-inner">
                        <Image src={urlFor(project.proImg).url()} alt={project.slug+" image"} width={720} height={720} className="z-20 mt-12 w-11/12 rounded-3xl bg-primary object-cover shadow-2xl transition duration-0 ease-in-out hover:mt-5 hover:duration-300" />
                    </div>

                    {/* Stacks */}
                    <div className="relative z-30 h-fit">
                        <div className="align-center absolute -top-5 flex h-fit w-fit items-center justify-center gap-2 rounded-lg bg-secondary p-2 text-3xl shadow">
                            {project.tags.map((tag, idx) =>(
                            <Tooltip key={idx}>
                                <TooltipTrigger>
                                    <Image src={urlFor(tag.tagImg).url()} alt={tag.title+" image"} width={24} height={24} className="rounded-md grayscale hover:grayscale-0"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tag.title}</p>
                                </TooltipContent>
                            </Tooltip>
                            ))}
                            <div className="grid h-[24px] w-[24px] rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                                <p className="place-self-center text-xs">+{project.tagCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="mt-8 min-h-full px-4 py-2 sm:min-h-52">
                        <div className="flex content-center justify-between">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <h4 className="text-right font-medium text-muted-foreground">{project.proDate}</h4>
                        </div>
                        <p className="mt-2 line-clamp-5 text-base font-normal leading-loose">{project.description}</p>
                    </CardContent>
                    <CardFooter className="bottom-2 mt-2 grid grid-cols-2 gap-2 text-base">
                        <Button asChild variant="cardb">
                            <Link href={`/projects/${project.slug}`}><File size={16} className="mr-2"/> View</Link>
                        </Button>
                        <Button asChild variant="cardb" >
                            <Link href={project.link.url} rel="noopener noreferrer" target="_blank"><ArrowUpRightFromSquare className="mr-2" size={16}/> {project.link.title}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
    </TooltipProvider>
    );
}