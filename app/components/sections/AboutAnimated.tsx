'use client';

import { useEffect, useRef } from 'react';
import { fadeUp } from '@/app/lib/animations';
import { PortableText } from '@portabletext/react';
import GraphSectionAnimated from './GraphSectionAnimated';
import SkillsNodeGraph from './SkillsNodeGraph';
import { AboutWithTags } from '@/app/lib/interface';

interface AboutAnimatedProps {
  data: AboutWithTags;
}

export default function AboutAnimated({ data }: AboutAnimatedProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

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


    // Match heights of About and Graph sections
    const matchHeights = () => {
      if (contentContainerRef.current && graphContainerRef.current) {
        // Use requestAnimationFrame to ensure layout is complete
        requestAnimationFrame(() => {
          if (contentContainerRef.current && graphContainerRef.current) {
            const graphHeight = graphContainerRef.current.offsetHeight;
            const contentHeight = contentContainerRef.current.offsetHeight;
            const maxHeight = Math.max(graphHeight, contentHeight);

            // Set both to the maximum height only if there's a meaningful difference
            if (maxHeight > 0) {
              contentContainerRef.current.style.minHeight = `${maxHeight}px`;
              graphContainerRef.current.style.minHeight = `${maxHeight}px`;
            }
          }
        });
      }
    };

    // Match heights after animations complete and on window resize
    const timeoutIds: NodeJS.Timeout[] = [];
    timeoutIds.push(setTimeout(matchHeights, 100));
    timeoutIds.push(setTimeout(matchHeights, 500));
    timeoutIds.push(setTimeout(matchHeights, 1000));

    // Use ResizeObserver to keep heights matched dynamically
    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        matchHeights();
      });

      if (contentContainerRef.current) {
        resizeObserver.observe(contentContainerRef.current);
      }
      if (graphContainerRef.current) {
        resizeObserver.observe(graphContainerRef.current);
      }
    }

    // Also match on window resize
    const handleResize = () => matchHeights();
    window.addEventListener('resize', handleResize);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
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
            <div
              ref={contentContainerRef}
              className="relative rounded-lg bg-secondary p-6 font-normal shadow-sm"
            >
              <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg mb-6">
                <PortableText value={data.about?.[0]?.content ?? []} />
              </div>
              <GraphSectionAnimated />
            </div>
          </div>

          {/* Skills Node Graph */}
          <div
            ref={graphRef}
            className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2"
            style={{ opacity: 0 }}
          >
            <div
              ref={graphContainerRef}
              className="relative basis-full rounded-lg bg-secondary p-6 shadow-sm flex flex-col"
              style={{ height: '100%', minHeight: '600px', overflow: 'visible' }}
            >
              {/* <div className="mb-4 text-lg font-medium sm:text-base flex-shrink-0">Skills</div> */}
              <div className="flex-1 w-full" style={{ height: '100%', minHeight: '550px', overflow: 'visible' }}>
                <SkillsNodeGraph data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
