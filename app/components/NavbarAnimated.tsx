'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { slideIn, prefersReducedMotion } from '@/app/lib/animations';
import { scrollToTop } from '@/app/lib/smooth-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggleAnimated } from './ModeToggleAnimated';
import { Button } from '@/components/ui/button';
import { Briefcase, Paperclip } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NavbarAnimated() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    if (!navRef.current || prefersReducedMotion()) return;

    // Slide in animation on page load
    slideIn(navRef.current, {
      direction: 'top',
      duration: 0.6,
      delay: 0.2,
      distance: -50,
    });

    // Hide/show navbar on scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animate visibility
  useEffect(() => {
    if (!navRef.current || prefersReducedMotion()) return;

    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isVisible]);

  return (
    <div className="grid place-items-center">
      <div
        ref={navRef}
        className="fixed bottom-8 top-auto z-40 h-fit w-fit rounded-lg border border-border shadow-lg md:bottom-auto md:top-8"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center justify-around gap-3 md:gap-4 rounded-lg bg-secondary/80 p-3 md:p-2 text-xl backdrop-blur-sm">
          <Button
            variant="ghosth"
            size="icon"
            className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                scrollToTop();
              }
            }}
          >
            <Link href={'/'} className="flex items-center justify-center">
              <Image
                src="/logo.svg"
                width={20}
                height={40}
                alt="logo"
                className="hue-rotate-180 invert dark:filter-none"
                priority
              />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
            <Link href={'/projects'}>
              <Briefcase className="h-[1.2rem] w-[1.2rem] text-accent-foreground" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
            <Link href={'/cv'}>
              <Paperclip className="h-[1.2rem] w-[1.2rem] text-accent-foreground" />
            </Link>
          </Button>
          <ModeToggleAnimated />
        </div>
      </div>
    </div>
  );
}
