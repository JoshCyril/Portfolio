'use client';

import { useEffect, useRef } from 'react';
import { fadeIn } from '@/app/lib/animations';

interface CVPageAnimatedProps {
  fileURL: string;
}

export default function CVPageAnimated({ fileURL }: CVPageAnimatedProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      fadeIn(titleRef.current, {
        duration: 0.6,
        delay: 0.1,
        y: 20,
      });
    }

    // Animate PDF embed container
    if (embedContainerRef.current) {
      fadeIn(embedContainerRef.current, {
        duration: 0.8,
        delay: 0.3,
        y: 30,
      });
    }
  }, []);

  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-24">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span ref={titleRef} className="flex text-2xl font-bold md:text-3xl">Curriculum Vitae</span>
        </div>

        <div className="relative mb-2 mt-0 basis-full rounded-lg p-3">
          <div ref={embedContainerRef} className="relative h-full basis-full rounded-lg bg-secondary shadow-sm">
            <embed src={fileURL} type="application/pdf" className="h-screen w-full rounded-lg"/>
          </div>
        </div>
      </div>
    </div>
  );
}
