'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggleAnimated } from "./ModeToggleAnimated";
import { Button } from "@/components/ui/button"
import { Briefcase, Paperclip } from "lucide-react";

export default function Navbar(){
    const pathname = usePathname();
    const isProjectsActive = pathname === "/projects";
    const isCvActive = pathname === "/cv";

    const handleNavigationClick = () => {
        // Trigger Line animation immediately when navigation is clicked
        window.dispatchEvent(new CustomEvent('navigationStart'));
    };

    return (
        <div className="grid place-items-center">
            <div className="fixed bottom-8 top-auto z-40 h-fit w-fit rounded-lg border border-border shadow-lg md:bottom-auto md:top-8">
                <div className="flex items-center justify-around gap-3 md:gap-4 rounded-lg bg-secondary/80 p-3 md:p-2 text-xl backdrop-blur-sm">
                    <Button asChild variant="ghosth" size="icon" className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
                        <Link href={"/"} onClick={handleNavigationClick}><Image src="/logo.svg" width={20} height={40} alt="logo" className="hue-rotate-180 invert dark:filter-none" priority/></Link>
                    </Button>
                    <Button
                        asChild
                        variant={isProjectsActive ? "default" : "outline"}
                        size="icon"
                        className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0"
                    >
                        <Link href={"/projects"} onClick={handleNavigationClick}><Briefcase className="h-[1.2rem] w-[1.2rem]" /></Link>
                    </Button>
                    <Button
                        asChild
                        variant={isCvActive ? "default" : "outline"}
                        size="icon"
                        className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0"
                    >
                        <Link href={"/cv"} onClick={handleNavigationClick}><Paperclip className="h-[1.2rem] w-[1.2rem]"/></Link>
                    </Button>
                    <ModeToggleAnimated />
                </div>
            </div>
        </div>
    )
}
