'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsLoading(false);
      document.body.style.overflow = '';
      return;
    }

    const screenElement = loadingScreenRef.current;
    const logoElement = logoRef.current;
    const progressBarElement = progressBarRef.current;
    const progressFillElement = progressFillRef.current;
    const glowElement = glowRef.current;

    if (!screenElement || !logoElement || !progressBarElement || !progressFillElement) {
      return;
    }

    // Initial setup - hide elements with dramatic entrance
    gsap.set([logoElement, glowElement], { opacity: 0 });
    gsap.set(progressBarElement, { opacity: 0, y: 20 });
    gsap.set(progressFillElement, { width: '0%' });
    gsap.set(logoElement, { rotation: -360, scale: 0, filter: 'blur(20px)' });
    gsap.set(glowElement, { scale: 0.5 });

    // Simulate loading progress with smooth acceleration
    let currentProgress = 0;
    const targetProgress = 100;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2; // Slower, more controlled progress
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 50);

    // Create main timeline
    const tl = gsap.timeline();

    // Phase 1: Logo entrance with dramatic spin and blur effect
    tl.to(logoElement, {
      rotation: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'back.out(2)',
    })
      // Add glow effect that pulses
      .to(
        glowElement,
        {
          opacity: 0.7,
          scale: 1.3,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.8'
      )
      // Show progress bar with fade and slide
      .to(
        progressBarElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      // Animate progress bar fill with smooth acceleration
      .to(
        progressFillElement,
        {
          width: '100%',
          duration: 2.2,
          ease: 'power1.out',
        },
        '-=0.3'
      )
      // Subtle pulsing/breathing effect on logo while loading
      .to(
        logoElement,
        {
          scale: 1.08,
          duration: 1.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
        '-=1.8'
      )
      // Glow pulsing in sync
      .to(
        glowElement,
        {
          scale: 1.4,
          opacity: 0.5,
          duration: 1.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
        '-=1.8'
      )
      // Phase 2: Loading complete - prepare for exit
      .call(() => {
        // Stop all pulsing animations
        gsap.killTweensOf([logoElement, glowElement]);
        // Reset logo scale
        gsap.set(logoElement, { scale: 1 });
        gsap.set(glowElement, { scale: 1.3, opacity: 0.7 });
      })
      // Logo dramatic exit - scale up with rotation and fade
      .to(
        logoElement,
        {
          scale: 2,
          rotation: 180,
          opacity: 0,
          filter: 'blur(15px)',
          duration: 0.7,
          ease: 'power3.in',
        },
        '+=0.1'
      )
      // Glow expands and fades
      .to(
        glowElement,
        {
          scale: 3,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.in',
        },
        '-=0.7'
      )
      // Progress bar fade out with slide
      .to(
        progressBarElement,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.in',
        },
        '-=0.5'
      )
      // Screen fade out with subtle scale and blur
      .to(
        screenElement,
        {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(10px)',
          duration: 0.6,
          ease: 'power2.in',
          onStart: () => {
            // Disable pointer events on loading screen as it fades out
            screenElement.style.pointerEvents = 'none';
          },
          onComplete: () => {
            setIsLoading(false);
            document.body.style.overflow = '';
            // Clean up blur and ensure screen doesn't block
            gsap.set(screenElement, {
              filter: 'blur(0px)',
              pointerEvents: 'none',
              display: 'none'
            });
            screenElement.style.pointerEvents = 'none';
            // Trigger staggered page reveal
            revealPageContent();
          },
        },
        '-=0.3'
      );

    timelineRef.current = tl;

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(progressInterval);
      document.body.style.overflow = '';
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      gsap.killTweensOf([logoElement, glowElement, progressBarElement, progressFillElement, screenElement]);
    };
  }, []);

  // Staggered page reveal function
  const revealPageContent = () => {
    if (prefersReducedMotion()) return;

    // Wait for DOM to be ready and elements to be rendered
    const attemptReveal = (attempts = 0) => {
      const maxAttempts = 10;

      // Get page elements for staggered reveal
      const navbar = document.querySelector('[data-navbar]') as HTMLElement;
      const main = document.querySelector('[data-main]') as HTMLElement;
      const projects = document.querySelector('[data-projects]') as HTMLElement;
      const about = document.querySelector('[data-about]') as HTMLElement;
      const e3 = document.querySelector('[data-e3]') as HTMLElement;
      const footer = document.querySelector('[data-footer]') as HTMLElement;
      const scrollProgress = document.querySelector('[data-scroll-progress]') as HTMLElement;

      const elements = [navbar, scrollProgress, main, projects, about, e3, footer].filter(Boolean);

      if (elements.length === 0 && attempts < maxAttempts) {
        // Retry after a short delay if elements aren't ready
        setTimeout(() => attemptReveal(attempts + 1), 50);
        return;
      }

      if (elements.length === 0) return;

      // Set initial state - ensure pointer events are always enabled
      elements.forEach((el) => {
        if (el) {
          // Force pointer events on element and all children (links, buttons)
          el.style.pointerEvents = 'auto';
          const interactiveElements = el.querySelectorAll('a, button, [role="button"], [tabindex]');
          interactiveElements.forEach((elem) => {
            (elem as HTMLElement).style.pointerEvents = 'auto';
          });

          gsap.set(el, {
            opacity: 0,
            y: 40,
            scale: 0.95,
            pointerEvents: 'auto',
          });
        }
      });

      // Staggered reveal animation with smooth easing
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: {
          amount: 0.8,
          from: 'start',
          ease: 'power2.out',
        },
        ease: 'power3.out',
        delay: 0.05,
        onStart: () => {
          // Ensure pointer events are enabled during animation for all elements and children
          elements.forEach((el) => {
            if (el) {
              el.style.pointerEvents = 'auto';
              const interactiveElements = el.querySelectorAll('a, button, [role="button"], [tabindex]');
              interactiveElements.forEach((elem) => {
                (elem as HTMLElement).style.pointerEvents = 'auto';
              });
            }
          });
        },
        onComplete: () => {
          // Final cleanup - ensure all elements and children are interactive
          elements.forEach((el) => {
            if (el) {
              el.style.pointerEvents = 'auto';
              // Ensure all interactive children are clickable
              const interactiveElements = el.querySelectorAll('a, button, [role="button"], [tabindex]');
              interactiveElements.forEach((elem) => {
                (elem as HTMLElement).style.pointerEvents = 'auto';
                (elem as HTMLElement).style.cursor = 'pointer';
              });
              // Clear transforms but keep layout
              gsap.set(el, { clearProps: 'transform' });
            }
          });
        },
      });
    };

    // Start reveal attempt immediately after loading screen completes
    requestAnimationFrame(() => {
      // Small delay to ensure DOM is ready but keep it minimal
      setTimeout(attemptReveal, 50);
    });
  };

  // Don't render at all when not loading to prevent any blocking
  if (!isLoading) return null;

  return (
    <div
      ref={loadingScreenRef}
      className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      style={{
        pointerEvents: 'auto',
        // Ensure it's above everything while loading
        isolation: 'isolate'
      }}
    >
      {/* Animated glow effect behind logo */}
      <div
        ref={glowRef}
        className="absolute h-40 w-40 rounded-full bg-primary/30 blur-3xl"
        style={{ opacity: 0 }}
      />

      {/* Logo container */}
      <div
        ref={logoRef}
        className="relative z-10 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <Image
          src="/logo.svg"
          width={80}
          height={120}
          alt="Logo"
          className="hue-rotate-180 invert dark:filter-none"
          priority
        />
      </div>

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="absolute bottom-20 z-10 w-72"
        style={{ opacity: 0 }}
      >
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary/20 backdrop-blur-sm">
          <div
            ref={progressFillRef}
            className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-300"
            style={{
              width: '0%',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
