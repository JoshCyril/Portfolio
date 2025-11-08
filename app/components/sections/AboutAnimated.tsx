'use client';

import { useEffect, useRef } from 'react';
import { fadeUp, staggerFadeUp } from '@/app/lib/animations';
import { PortableText } from '@portabletext/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { urlFor } from '@/app/lib/sanity';
import GraphSectionAnimated from './GraphSectionAnimated';
import { aboutNTag } from '@/app/lib/interface';

interface AboutAnimatedProps {
  data: aboutNTag;
}

export default function AboutAnimated({ data }: AboutAnimatedProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate section title with scroll trigger
    if (titleRef.current) {
      fadeUp(titleRef.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate content block with scroll trigger
    if (contentRef.current) {
      fadeUp(contentRef.current, {
        duration: 0.8,
        distance: 40,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate graph section with scroll trigger
    if (graphRef.current) {
      fadeUp(graphRef.current, {
        duration: 0.8,
        distance: 40,
        scrollTrigger: {
          trigger: graphRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate skill tags with stagger
    if (skillsRef.current) {
      const tags = Array.from(skillsRef.current.querySelectorAll('[data-skill-tag]')).filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      );
      if (tags.length > 0) {
        staggerFadeUp(tags, {
          duration: 0.5,
          stagger: 0.05,
          distance: 20,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }
  }, [data]);

  return (
    <div className="mb-8 grid h-fit place-items-center py-6">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div
          ref={titleRef}
          className="relative col-span-2 mb-4 ml-3 flex basis-full items-center py-2"
          style={{ opacity: 0 }}
        >
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="flex text-2xl font-bold md:text-3xl">About me</span>
        </div>

        <div className="flex flex-wrap justify-between py-3">
          <div
            ref={contentRef}
            className="mb-2 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2"
            style={{ opacity: 0 }}
          >
            <div className="relative h-fit rounded-lg bg-secondary p-6 font-normal shadow-sm">
              <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                <PortableText value={data.about[0].content} />
              </div>
            </div>
          </div>

          {/* Links */}
          <div
            ref={graphRef}
            className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2"
            style={{ opacity: 0 }}
          >
            <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
              <GraphSectionAnimated />

              <div className="mt-4 text-lg font-medium sm:text-base">Skills</div>
              <TooltipProvider>
                <div ref={skillsRef} className="mt-2 flex flex-wrap">
                  {data.tags.map((tag, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger>
                        <div
                          data-skill-tag
                          className="m-1 flex items-center rounded-md border border-primary/40 px-2 py-0.5 text-xs leading-5 md:text-sm"
                          style={{ opacity: 0 }}
                        >
                          {tag.tag_name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="flex">
                        <Image
                          src={urlFor(tag.tag_url).url()}
                          alt={tag.tag_name + ' image'}
                          width={22}
                          height={22}
                          className="mr-2 rounded-md"
                        />
                        <span> x{tag.tag_count}</span>
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
