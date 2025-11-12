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
  const transitioningToPathnameRef = useRef<string | null>(null);

  // Always keep children ref up to date
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  // Safety effect: ensure pointer events are always enabled when not transitioning
  useEffect(() => {
    const checkAndFixPointerEvents = () => {
      const container = containerRef.current;
      if (!container) return;

      // If not transitioning, ensure pointer events are enabled
      if (!isTransitioningRef.current) {
        container.style.pointerEvents = 'auto';
        // Enable all interactive elements
        const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
        interactiveElements.forEach((elem) => {
          (elem as HTMLElement).style.pointerEvents = 'auto';
        });
      }
    };

    // Check immediately
    checkAndFixPointerEvents();

    // Also check periodically to catch any cases where pointer events get stuck
    const interval = setInterval(checkAndFixPointerEvents, 100);

    return () => clearInterval(interval);
  });

  // Update displayed children when pathname changes
  useEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname;

    // Skip transition on initial mount - let LoadingScreen handle initial reveal
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      transitioningToPathnameRef.current = null;
      isTransitioningRef.current = false;
      setDisplayChildren(childrenRef.current);
      // Ensure container is immediately interactive
      const container = containerRef.current;
      if (container) {
        container.style.pointerEvents = 'auto';
        gsap.set(container, {
          opacity: 1,
          pointerEvents: 'auto'
        });
        // Enable all interactive elements
        const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
        interactiveElements.forEach((elem) => {
          (elem as HTMLElement).style.pointerEvents = 'auto';
        });
      }
      // Trigger Line animation on initial mount - no delay
      window.dispatchEvent(new CustomEvent('pageTransitionComplete'));
      return;
    }

    // If pathname hasn't changed, just sync children (but don't update if transitioning)
    if (!pathnameChanged) {
      if (!isTransitioningRef.current) {
        setDisplayChildren(childrenRef.current);
      }
      return;
    }

    // If we're already transitioning to this pathname, don't start another transition
    if (isTransitioningRef.current && transitioningToPathnameRef.current === pathname) {
      return;
    }

    // Pathname changed - perform transition
    if (prefersReducedMotion()) {
      setDisplayChildren(childrenRef.current);
      prevPathnameRef.current = pathname;
      transitioningToPathnameRef.current = null;
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setDisplayChildren(childrenRef.current);
      prevPathnameRef.current = pathname;
      transitioningToPathnameRef.current = null;
      return;
    }

    // Prevent multiple simultaneous transitions
    if (isTransitioningRef.current) {
      // If we're transitioning but to a different pathname, kill the current transition
      // and start a new one for the latest pathname
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      // Reset transitioning state and restore pointer events
      isTransitioningRef.current = false;
      // Reset container state if we killed a transition
      gsap.set(container, {
        opacity: 1,
        y: 0,
        clearProps: 'all',
        pointerEvents: 'auto'
      });
      container.style.pointerEvents = 'auto';
      container.style.opacity = '1';
      // Enable all interactive elements
      const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
      interactiveElements.forEach((elem) => {
        (elem as HTMLElement).style.pointerEvents = 'auto';
      });
      // Fall through to start new transition
    }

    // Mark that we're transitioning to this pathname
    transitioningToPathnameRef.current = pathname;
    isTransitioningRef.current = true;

    // Reset container to default state before starting new transition
    gsap.set(container, {
      opacity: 1,
      y: 0,
      clearProps: 'transform',
      pointerEvents: 'auto'
    });

    // Store the target pathname for the onComplete callback
    const targetPathname = pathname;

    // Create a timeline for smooth transition
    const tl = gsap.timeline({
      onComplete: () => {
        // Only complete if we're still transitioning to this pathname
        // (prevents race conditions if pathname changed again during transition)
        if (transitioningToPathnameRef.current === targetPathname) {
          setDisplayChildren(childrenRef.current);
          isTransitioningRef.current = false;
          prevPathnameRef.current = targetPathname;
          transitioningToPathnameRef.current = null;

          // Ensure container is fully reset and interactive
          gsap.set(container, {
            clearProps: 'all',
            pointerEvents: 'auto'
          });
          container.style.pointerEvents = 'auto';
          container.style.opacity = '1';
        }
      },
    });

    // Fade out current content - keep interactions enabled until very last moment
    tl.to(container, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        // Only update if we're still transitioning to the same pathname
        if (transitioningToPathnameRef.current === targetPathname) {
          // Keep pointer events enabled - opacity handles the visual transition
          // Update children while invisible - use the latest children from ref
          setDisplayChildren(childrenRef.current);
          // Ensure pointer events stay enabled
          container.style.pointerEvents = 'auto';
        } else {
          // Pathname changed - restore pointer events immediately
          container.style.pointerEvents = 'auto';
        }
      },
    })
      // Minimal delay to ensure React has rendered new children
      .to({}, { duration: 0.02 })
      // Set initial state for fade in
      .call(() => {
        // Only continue if we're still transitioning to the same pathname
        if (transitioningToPathnameRef.current === targetPathname) {
          gsap.set(container, { y: 10, opacity: 0, visibility: 'visible' });
          // Re-enable pointer events immediately for new content
          container.style.pointerEvents = 'auto';
          container.style.visibility = 'visible';
          // Also ensure all interactive children are enabled
          const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
          interactiveElements.forEach((elem) => {
            (elem as HTMLElement).style.pointerEvents = 'auto';
          });
        } else {
          // Pathname changed - restore pointer events
          container.style.pointerEvents = 'auto';
          container.style.visibility = 'visible';
        }
      })
      // Fade in new content - interactions already enabled
      .to(container, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          // Double-check pointer events are enabled
          if (transitioningToPathnameRef.current === targetPathname) {
            container.style.pointerEvents = 'auto';
          }
        },
        onComplete: () => {
          // Final check - ensure everything is interactive
          if (transitioningToPathnameRef.current === targetPathname) {
            container.style.pointerEvents = 'auto';
            const interactiveElements = container.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
            interactiveElements.forEach((elem) => {
              (elem as HTMLElement).style.pointerEvents = 'auto';
            });
            // Trigger Line animation
            window.dispatchEvent(new CustomEvent('pageTransitionComplete'));
          } else {
            // Pathname changed - restore pointer events
            container.style.pointerEvents = 'auto';
          }
        },
      });

    timelineRef.current = tl;

    // Capture container for cleanup
    const cleanupContainer = container;

    return () => {
      // Cleanup: kill timeline if effect is cleaning up
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      // CRITICAL: Always restore pointer events when cleaning up
      // This ensures interactions work even if transition is interrupted
      if (cleanupContainer) {
        isTransitioningRef.current = false;
        cleanupContainer.style.pointerEvents = 'auto';
        gsap.set(cleanupContainer, { pointerEvents: 'auto', clearProps: 'pointerEvents' });
        // Enable all interactive elements
        const interactiveElements = cleanupContainer.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
        interactiveElements.forEach((elem) => {
          (elem as HTMLElement).style.pointerEvents = 'auto';
        });
      }
    };
  }, [pathname]); // Only depend on pathname, not children

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{
        pointerEvents: 'auto',
        visibility: 'visible'
      }}
    >
      {displayChildren}
    </div>
  );
}
