'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef<string>(pathname);
  const isInitialMount = useRef(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const childrenRef = useRef(children);
  const isTransitioningRef = useRef(false);

  // Always keep children ref up to date
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  // Update displayed children when pathname changes
  useEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname;

    // Skip transition on initial mount - let LoadingScreen handle initial reveal
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      setDisplayChildren(childrenRef.current);
      // Ensure container is immediately interactive
      const container = containerRef.current;
      if (container) {
        container.style.pointerEvents = 'auto';
        gsap.set(container, {
          opacity: 1,
          pointerEvents: 'auto'
        });
      }
      return;
    }

    // If pathname hasn't changed, just sync children
    if (!pathnameChanged) {
      setDisplayChildren(childrenRef.current);
      return;
    }

    // Pathname changed - perform transition
    if (prefersReducedMotion()) {
      setDisplayChildren(childrenRef.current);
      prevPathnameRef.current = pathname;
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setDisplayChildren(childrenRef.current);
      prevPathnameRef.current = pathname;
      return;
    }

    // Prevent multiple simultaneous transitions
    if (isTransitioningRef.current) {
      return;
    }

    // Kill any existing timeline and ensure clean state
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Reset container to default state before starting new transition
    gsap.set(container, {
      opacity: 1,
      y: 0,
      clearProps: 'transform',
      pointerEvents: 'auto'
    });

    isTransitioningRef.current = true;

    // Create a timeline for smooth transition
    const tl = gsap.timeline({
      onComplete: () => {
        prevPathnameRef.current = pathname;
        isTransitioningRef.current = false;
        // Ensure container is fully reset and interactive
        gsap.set(container, {
          clearProps: 'all',
          pointerEvents: 'auto'
        });
        container.style.pointerEvents = 'auto';
        container.style.opacity = '1';
      },
    });

    // Fade out current content - keep interactions enabled until very last moment
    tl.to(container, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        // Only disable pointer events briefly when content is being swapped
        container.style.pointerEvents = 'none';
        // Update children while invisible
        setDisplayChildren(childrenRef.current);
      },
    })
      // Minimal delay to ensure React has rendered new children
      .to({}, { duration: 0.02 })
      // Set initial state for fade in
      .call(() => {
        gsap.set(container, { y: 10, opacity: 0 });
        // Re-enable pointer events immediately for new content
        container.style.pointerEvents = 'auto';
        // Also ensure all interactive children are enabled
        const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex]');
        interactiveElements.forEach((elem) => {
          (elem as HTMLElement).style.pointerEvents = 'auto';
        });
      })
      // Fade in new content - interactions already enabled
      .to(container, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          // Double-check pointer events are enabled
          container.style.pointerEvents = 'auto';
        },
        onComplete: () => {
          // Final check - ensure everything is interactive
          container.style.pointerEvents = 'auto';
          const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex]');
          interactiveElements.forEach((elem) => {
            (elem as HTMLElement).style.pointerEvents = 'auto';
          });
        },
      });

    timelineRef.current = tl;

    return () => {
      isTransitioningRef.current = false;
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      // Always reset container state on cleanup
      if (container) {
        gsap.set(container, {
          clearProps: 'all',
          pointerEvents: 'auto'
        });
        container.style.pointerEvents = 'auto';
        container.style.opacity = '1';
      }
    };
  }, [pathname]); // Only depend on pathname, not children

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ pointerEvents: 'auto' }}
    >
      {displayChildren}
    </div>
  );
}
