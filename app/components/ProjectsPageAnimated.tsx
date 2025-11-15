'use client';

import { useEffect, useRef } from 'react';
import { fadeIn } from '@/app/lib/animations';
import ProjectsPageClient from "./ProjectsPageClient";
import { SimpleProject, SkillTag } from "@/app/lib/interface";

interface ProjectsPageAnimatedProps {
  initialProjects: SimpleProject[];
  totalCount: number;
  tags: SkillTag[];
}

export default function ProjectsPageAnimated({ initialProjects, totalCount, tags }: ProjectsPageAnimatedProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      fadeIn(titleRef.current, {
        duration: 0.6,
        delay: 0.5,
        y: 20,
      });
    }

    // Animate content container
    if (contentRef.current) {
      fadeIn(contentRef.current, {
        duration: 0.6,
        delay: 1,
        y: 30,
      });
    }
  }, []);

  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-28">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div ref={titleRef} className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="flex text-2xl font-bold md:text-3xl">Project vault</span>
        </div>

        <div ref={contentRef}>
          <ProjectsPageClient initialProjects={initialProjects} totalCount={totalCount} tags={tags} />
        </div>
      </div>
    </div>
  );
}
