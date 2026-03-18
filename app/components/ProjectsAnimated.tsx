'use client';

import { useEffect, useRef, useState } from 'react';
import { fadeIn, fadeUp, staggerFadeUp } from '@/app/lib/animations';
import { gsap } from 'gsap';
import Link from 'next/link';
import { SimpleProject } from '../lib/interface';
import ProjectCardAnimated from './ProjectCardAnimated';

interface ProjectsAnimatedProps {
    projects: SimpleProject[];
}

export default function ProjectsAnimated({ projects }: ProjectsAnimatedProps) {
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

    useEffect(() => {
        // Animate section title with scroll trigger
        if (titleRef.current) {
            fadeIn(titleRef.current, {
                duration: 0.6,
                delay: 1.8,
                y: 10,
            });
        }

        // if (cardsContainerRef.current) {
        //     fadeIn(cardsContainerRef.current, {
        //         duration: 0.6,
        //         delay: 2.4,
        //         y: 10,
        //     });
        // }

        // Animate project cards with stagger and scroll trigger
        if (cardsContainerRef.current) {
            // Use requestAnimationFrame to ensure DOM is ready
            const rafId = requestAnimationFrame(() => {
                const cards = Array.from(cardsContainerRef.current?.querySelectorAll('[data-project-card]') || []).filter(
                    (el): el is HTMLElement => el instanceof HTMLElement
                );
                if (cards.length > 0) {
                    // Set initial opacity to 0 for all cards to prevent flash
                    cards.forEach((card) => {
                        gsap.set(card, { opacity: 0, y: 50 });
                    });

                    staggerFadeUp(cards, {
                        duration: 0.6,
                        stagger: 0.15,
                        distance: 50,
                        scrollTrigger: {
                            trigger: cardsContainerRef.current!,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    });
                }
            });

            return () => cancelAnimationFrame(rafId);
        }
    }, [projects]);

    return (
        // <div className="mb-10 grid h-fit place-items-center py-6">
        //   <div className="z-10 w-11/12 max-w-screen-2xl">
        //     <div
        //       ref={titleRef}
        //       className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2"
        //     >
        //       <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
        //       <span className="flex text-2xl font-bold md:text-3xl">
        //         Check out my <Link href="/projects" className="ml-2 hover:underline">Projects</Link>
        //       </span>
        //     </div>

        //     <div ref={cardsContainerRef} className="flex flex-wrap py-3">
        //       {projects.map((project, idx) => (
        //         <div key={idx} data-project-card style={{ opacity: 0 }}>
        //           <ProjectCardAnimated {...project} />
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        // </div>
        <div className="mb-10 grid h-fit place-items-center py-6">

            <div className="z-10 w-11/12 max-w-screen-2xl">

                <div ref={titleRef} className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2" style={{ opacity: 0 }}>
                    <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                    <span className="flex text-2xl font-bold md:text-3xl">Check out my <Link href="/projects" className="ml-2 hover:underline">projects</Link></span>
                </div>

                <div className="flex flex-wrap py-3" ref={cardsContainerRef} >
                    {projects.map((project, idx) => (
                        <ProjectCardAnimated
                            key={project.slug ?? `project-${idx}`}
                            {...project}
                            isDimmed={hoveredCardIndex !== null && hoveredCardIndex !== idx}
                            onMouseEnter={() => setHoveredCardIndex(idx)}
                            onMouseLeave={() => setHoveredCardIndex(null)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
