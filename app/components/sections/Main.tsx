import { about } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Github, Linkedin, Bot, Mail, ArrowUpRightFromSquare, Send, MapPin } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import TimeCal from "../TimeCal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const revalidate = 30 // revalidate at most 30 sec
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

async function getData(){
    const query = `
    *[_type == "about"]{
        tagline
      }[0]
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function Main() {
    const data:about = await getData();
    return (
    <div className="grid h-[80vh] place-items-center">
        <div className="z-10 grid w-11/12 max-w-screen-2xl grid-cols-1 gap-6 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="relative col-span-4 flex w-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <div className="text-4xl font-medium md:text-5xl">
                    <div className="flex items-center">
                    <Avatar className="ml-1">
                        <AvatarImage src="https://github.com/joshcyril.png" alt="@joshcyril"/>
                        {/* <AvatarImage src={urlFor(data.profileIcon).url()} alt="@joshcyril"/> */}
                        <AvatarFallback>JC</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 md:ml-4">Hello,</span>
                    </div>
                    <div className="pt-4 sm:pt-6">I’m <span className="text-4xl font-bold text-primary md:text-5xl">Joshua Cyril</span></div>
                </div>
            </div>
            <div className="relative col-span-4 flex w-full items-center py-1">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="text-base font-medium sm:text-xl md:text-2xl">{data.tagline}</span>
            </div>
            <div className="relative col-span-4 flex w-full items-center py-1">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                {/* <span className="pr-2 text-base font-medium sm:text-xl">UTC</span>
                <span className="font-regular text-base sm:text-xl"> <TimeCal/> </span> */}
                <div className="grid grid-cols-4 gap-2">
                <TooltipProvider>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button asChild variant="ghosth" >
                                    <Link href="https://www.linkedin.com/in/joshcyril/" rel="noopener noreferrer" target="_blank"><Linkedin size={18}/></Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                            <div className="flex gap-1">LinkedIn <ArrowUpRightFromSquare size={10}/></div>
                            </TooltipContent>
                        </Tooltip>


                        <Tooltip>
                            <TooltipTrigger>
                                <Button asChild variant="ghosth" >
                                    <Link href="https://discordapp.com/users/1136917465260097576" rel="noopener noreferrer" target="_blank"><Bot size={18}/></Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                            <div className="flex gap-1">Discord <ArrowUpRightFromSquare size={10}/></div>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button asChild variant="ghosth" >
                                    <Link href="mailto:joshcyril@proton.me" rel="noopener noreferrer" target="_blank"><Mail size={18}/></Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex gap-1">Email <Send size={10}/></div>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button asChild variant="ghosth" >
                                    <Link href="https://github.com/JoshCyril" rel="noopener noreferrer" target="_blank"><Github size={18}/></Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex gap-1">Github <ArrowUpRightFromSquare size={10}/></div>
                            </TooltipContent>
                        </Tooltip>

                    </TooltipProvider>
                </div>
            </div>
            <div className="absolute top-10 col-span-4 flex items-center">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                {/* <span className="text-md pr-2 font-medium"><MapPin size={14}/></span> */}
                <span className="text-md font-regular">Bengaluru, India</span>
            </div>
        </div>
    </div>
    );
  }
