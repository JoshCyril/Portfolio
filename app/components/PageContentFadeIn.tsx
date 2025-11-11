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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Set initial state immediately to prevent flash
    if (!prefersReducedMotion()) {
      gsap.set(container, {
        opacity: 0,
        y: 20,
      });

      // Small delay to ensure page transition has completed and DOM is ready
      const timeoutId = setTimeout(() => {
        if (container && containerRef.current === container) {
          // Kill any existing animation
          if (animationRef.current) {
            animationRef.current.kill();
          }

          // Animate fade in
          animationRef.current = fadeIn(container, {
            duration,
            delay,
            y: 20,
            opacity: 0,
          });
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    } else {
      // For reduced motion, just ensure content is visible
      gsap.set(container, {
        opacity: 1,
        y: 0,
      });
    }
  }, [delay, duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
