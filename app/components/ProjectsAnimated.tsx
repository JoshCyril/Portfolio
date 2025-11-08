'use client';

import { useEffect, useRef } from 'react';
import { fadeUp, staggerFadeUp } from '@/app/lib/animations';
import Link from 'next/link';
import { simpleProject } from '../lib/interface';
import ProjectCardAnimated from './ProjectCardAnimated';

interface ProjectsAnimatedProps {
  projects: simpleProject[];
}

export default function ProjectsAnimated({ projects }: ProjectsAnimatedProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate section title with scroll trigger
    if (titleRef.current) {
      const titleText = titleRef.current.querySelector('span');
      if (titleText) {
        fadeUp(titleText, {
          duration: 0.8,
          distance: 30,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

    // Animate project cards with stagger and scroll trigger
    if (cardsContainerRef.current) {
      const cards = Array.from(cardsContainerRef.current.querySelectorAll('[data-project-card]')).filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      );
      if (cards.length > 0) {
        staggerFadeUp(cards, {
          duration: 0.6,
          stagger: 0.15,
          distance: 50,
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
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

            <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="flex text-2xl font-bold md:text-3xl">Check out my <Link href="/projects" className="ml-2 hover:underline">Projects</Link></span>
            </div>

            <div className="flex flex-wrap py-3">
                {projects.map((project, idx) =>(
                    <ProjectCardAnimated key={idx} {...project} />
                ))}
            </div>
        </div>
    </div>
  );
}
