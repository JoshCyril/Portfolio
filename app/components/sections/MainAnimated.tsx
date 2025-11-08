'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { fadeIn, staggerFadeUp, splitTextFadeUp, scaleIn } from '@/app/lib/animations';
import { Github, Linkedin, Bot, Mail, ArrowUpRightFromSquare, Send } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MainAnimatedProps {
  tagline: string;
}

export default function MainAnimated({ tagline }: MainAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLSpanElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate avatar with scale
    if (avatarRef.current) {
      scaleIn(avatarRef.current, {
        duration: 0.8,
        delay: 0.2,
        scale: 0.5,
      });
    }

    // Animate "Hello,"
    if (helloRef.current) {
      fadeIn(helloRef.current, {
        duration: 0.6,
        delay: 0.4,
        y: 20,
      });
    }

    // Animate name section
    if (nameSectionRef.current) {
      fadeIn(nameSectionRef.current, {
        duration: 0.6,
        delay: 0.6,
        y: 20,
      });
    }

    // Animate tagline
    if (taglineRef.current) {
      fadeIn(taglineRef.current, {
        duration: 0.8,
        delay: 0.8,
        y: 20,
      });
    }

    // Animate social links with stagger
    if (socialLinksRef.current) {
      const links = Array.from(socialLinksRef.current.querySelectorAll('a')).filter(
        (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement
      );
      if (links.length > 0) {
        // Use setTimeout to delay the animation instead of delay parameter
        setTimeout(() => {
          staggerFadeUp(links, {
            duration: 0.5,
            stagger: 0.1,
            distance: 20,
          });
        }, 1200);
      }
    }

    // Animate location
    if (locationRef.current) {
      fadeIn(locationRef.current, {
        duration: 0.6,
        delay: 1.4,
        y: 10,
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="grid h-[80vh] place-items-center">
      <div className="z-10 grid w-11/12 max-w-screen-2xl grid-cols-1 gap-6 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative col-span-4 flex w-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <div className="text-4xl font-medium md:text-5xl">
            <div className="flex items-center">
              <div ref={avatarRef} style={{ opacity: 0 }}>
                <Avatar className="ml-1">
                  <AvatarImage src="https://github.com/joshcyril.png" alt="@joshcyril" />
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
              </div>
              <span ref={helloRef} className="ml-2 md:ml-4" style={{ opacity: 0 }}>Hello,</span>
            </div>
            <div ref={nameSectionRef} className="pt-4 sm:pt-6" style={{ opacity: 0 }}>
              I'm <span className="text-4xl font-bold text-primary md:text-5xl">Joshua Cyril</span>
            </div>
          </div>
        </div>
        <div ref={taglineRef} className="relative col-span-4 flex w-full items-center py-1" style={{ opacity: 0 }}>
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="text-base font-medium sm:text-xl md:text-2xl">{tagline}</span>
        </div>
        <div ref={socialLinksRef} className="relative col-span-4 flex w-full items-center py-1">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <div className="grid grid-cols-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth">
                    <Link href="https://www.linkedin.com/in/joshcyril/" rel="noopener noreferrer" target="_blank">
                      <Linkedin size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    LinkedIn <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth">
                    <Link href="https://discordapp.com/users/1136917465260097576" rel="noopener noreferrer" target="_blank">
                      <Bot size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Discord <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth">
                    <Link href="mailto:joshcyril@proton.me" rel="noopener noreferrer" target="_blank">
                      <Mail size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Email <Send size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth">
                    <Link href="https://github.com/JoshCyril" rel="noopener noreferrer" target="_blank">
                      <Github size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Github <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div ref={locationRef} className="absolute top-10 col-span-4 flex items-center" style={{ opacity: 0 }}>
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="text-md font-regular">Bengaluru, India</span>
        </div>
      </div>
    </div>
  );
}
