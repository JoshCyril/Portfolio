'use client';

import { useEffect, useRef } from 'react';
import { fadeIn } from '@/app/lib/animations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      fadeIn(titleRef.current, {
        duration: 0.6,
        delay: 0.5,
        y: 20,
      });
    }

    // Animate content
    if (contentRef.current) {
      fadeIn(contentRef.current, {
        duration: 0.6,
        delay: 1,
        y: 30,
      });
    }

    // Animate button
    if (buttonRef.current) {
      fadeIn(buttonRef.current, {
        duration: 0.6,
        delay: 1.2,
        y: 20,
      });
    }
  }, []);

  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-28">
      <div className="z-10 w-11/12 max-w-screen-2xl">
      <div ref={titleRef} className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="flex text-2xl font-bold md:text-3xl">404 - Page not found</span>
        </div>

        <div ref={contentRef} className="relative mb-4 ml-3 flex w-full basis-full items-center py-2">
          {/* <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div> */}
          <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div ref={buttonRef} className="mt-6 flex ml-3">
          <Button asChild size="lg" variant="secondary" enableMagnetic enableRipple magneticStrength={0.2}>
            <Link href="/" className="flex items-center gap-2">
              <Home size={18} />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
