'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { fadeIn, prefersReducedMotion } from '@/app/lib/animations';

interface PageContentFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function PageContentFadeIn({
  children,
  className = '',
  delay = 0.1,
  duration = 0.6,
}: PageContentFadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Comprehensive function to enable pointer events on container, parents, and all children
  const enablePointerEvents = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Force enable on container with important flag
    container.style.pointerEvents = 'auto';
    container.style.setProperty('pointer-events', 'auto', 'important');
    container.style.visibility = 'visible';

    // Check and fix all parent containers (including PageTransition)
    let parent: HTMLElement | null = container.parentElement;
    let depth = 0;
    while (parent && depth < 10) { // Limit depth to prevent infinite loops
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.pointerEvents === 'none') {
        parent.style.pointerEvents = 'auto';
        parent.style.setProperty('pointer-events', 'auto', 'important');
      }
      if (parentStyle.visibility === 'hidden') {
        parent.style.visibility = 'visible';
      }
      parent = parent.parentElement;
      depth++;
    }

    // Enable all interactive children recursively
    const interactiveSelectors = [
      'a', 'button', '[role="button"]', '[tabindex]',
      'input', 'select', 'textarea',
      '[data-project-card]', '[data-project-card] *',
      '[onclick]', '[onMouseEnter]', '[onMouseLeave]'
    ];

    interactiveSelectors.forEach(selector => {
      try {
        const elements = container.querySelectorAll(selector);
        elements.forEach((elem) => {
          const htmlElem = elem as HTMLElement;
          htmlElem.style.pointerEvents = 'auto';
          htmlElem.style.setProperty('pointer-events', 'auto', 'important');
          htmlElem.style.visibility = 'visible';
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });
  };

  // Continuous safety check - runs on every render
  useEffect(() => {
    const checkAndEnable = () => {
      enablePointerEvents();
    };

    // Immediate check
    checkAndEnable();

    // Periodic check every 50ms to catch any disabling
    const interval = setInterval(checkAndEnable, 50);

    return () => clearInterval(interval);
  });

  // Animation effect
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let completionTimeoutId: NodeJS.Timeout | null = null;
    let checkInterval: NodeJS.Timeout | null = null;

    // Always ensure pointer events are enabled immediately
    enablePointerEvents();

    if (!prefersReducedMotion()) {
      // Set initial state with visibility visible for pointer events
      gsap.set(container, {
        opacity: 0,
        y: 20,
        visibility: 'visible',
        pointerEvents: 'auto',
      });

      // Ensure pointer events before starting animation
      enablePointerEvents();

      // Small delay to ensure page transition has completed
      const timeoutId = setTimeout(() => {
        if (!containerRef.current || containerRef.current !== container) return;

        // Kill any existing animation
        if (animationRef.current) {
          animationRef.current.kill();
        }

        // Ensure pointer events before animation
        enablePointerEvents();

        // Start fade in animation
        const animation = fadeIn(container, {
          duration,
          delay,
          y: 20,
          opacity: 0,
        });
        animationRef.current = animation || null;

        // Ensure pointer events immediately after animation starts
        requestAnimationFrame(() => {
          enablePointerEvents();
        });

        // Continuous check during animation
        checkInterval = setInterval(() => {
          enablePointerEvents();
        }, 100);

        // Clear interval and final check after animation completes
        completionTimeoutId = setTimeout(() => {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
          enablePointerEvents();

          // Additional checks after completion
          setTimeout(() => enablePointerEvents(), 50);
          setTimeout(() => enablePointerEvents(), 150);
        }, (delay + duration) * 1000 + 100);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (completionTimeoutId) {
          clearTimeout(completionTimeoutId);
        }
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        if (animationRef.current) {
          animationRef.current.kill();
        }
        // Final enable on cleanup
        enablePointerEvents();
      };
    } else {
      // For reduced motion, ensure everything is visible and interactive
      enablePointerEvents();
      gsap.set(container, {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        pointerEvents: 'auto',
      });
      enablePointerEvents();
    }
  }, [delay, duration]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        pointerEvents: 'auto',
        visibility: 'visible',
      }}
    >
      {children}
    </div>
  );
}
