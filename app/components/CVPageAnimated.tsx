'use client';

import { useEffect, useRef, useState } from 'react';
import { fadeIn } from '@/app/lib/animations';

interface CVPageAnimatedProps {
  fileURL: string;
}

export default function CVPageAnimated({ fileURL }: CVPageAnimatedProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      fadeIn(titleRef.current, {
        duration: 0.6,
        delay: 0.5,
        y: 20,
      });
    }

    // Animate PDF embed container
    if (embedContainerRef.current) {
      fadeIn(embedContainerRef.current, {
        duration: 0.8,
        delay: 1,
        y: 30,
      });
    }
  }, []);

  // Fallback so the skeleton never gets stuck if the browser blocks the PDF load event
  useEffect(() => {
    if (!fileURL) return;
    if (isPdfLoaded) return;

    const timeoutId = window.setTimeout(() => {
      setIsPdfLoaded(true);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [fileURL, isPdfLoaded]);

  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-24">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div ref={titleRef} className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="flex text-2xl font-bold md:text-3xl">Curriculum Vitae</span>
        </div>

        <div className="relative mb-2 mt-0 basis-full rounded-lg p-3">
          <div ref={embedContainerRef} className="relative h-full basis-full rounded-lg bg-secondary shadow-sm">
            {!isPdfLoaded && !hasError && (
              <div className="absolute inset-0 flex flex-col gap-4 rounded-lg bg-secondary p-6">
                <div className="h-6 w-1/3 rounded-md bg-muted/30 animate-pulse" />
                <div className="flex-1 rounded-xl bg-muted/40 animate-pulse" />
                <div className="h-10 rounded-md bg-muted/30 animate-pulse" />
              </div>
            )}
            {hasError ? (
              <div className="flex h-screen w-full flex-col items-center justify-center gap-4 rounded-lg bg-secondary text-center">
                <p className="text-lg font-semibold">Couldn&apos;t load the PDF preview.</p>
                <p className="text-sm text-muted-foreground">Please download the CV directly instead.</p>
              </div>
            ) : (
              <embed
                src={fileURL}
                type="application/pdf"
                className="h-screen w-full rounded-lg"
                onLoad={() => setIsPdfLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsPdfLoaded(true);
                }}
                aria-busy={!isPdfLoaded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
