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
  const startTimeRef = useRef<number>(Date.now());
  const minDurationRef = useRef<number>(200); // Minimum 0.2 seconds
  const loadingCompleteRef = useRef<boolean>(false);

  // Track actual page loading progress
  const trackLoadingProgress = () => {
    let loadedResources = 0;
    let totalResources = 0;
    let calculatedProgress = 0;

    // Track document ready state (30% weight)
    const getDocumentProgress = () => {
      if (document.readyState === 'complete') return 100;
      if (document.readyState === 'interactive') return 50;
      return 0;
    };

    // Track images loading (40% weight)
    const getImagesProgress = () => {
      const images = Array.from(document.querySelectorAll('img'));
      if (images.length === 0) return 100;

      let loaded = 0;
      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          loaded++;
        }
      });
      return (loaded / images.length) * 100;
    };

    // Track fonts loading (20% weight) - non-blocking
    const getFontsProgress = async () => {
      try {
        if ('fonts' in document) {
          // Check if fonts are ready without blocking
          const fontsReady = (document as any).fonts.status === 'loaded';
          if (fontsReady) return 100;
          // Use Promise.race with short timeout to avoid blocking
          await Promise.race([
            (document as any).fonts.ready,
            new Promise(resolve => setTimeout(resolve, 50)) // Very short timeout
          ]);
          return 100;
        }
      } catch (e) {
        // Font loading API not available
      }
      return 100; // Assume fonts are loaded if API unavailable
    };

    // Track window load event (10% weight)
    const getWindowLoadProgress = () => {
      try {
        if (window.performance && window.performance.timing) {
          return window.performance.timing.loadEventEnd > 0 ? 100 : 0;
        }
        // Fallback: check if document is complete
        return document.readyState === 'complete' ? 100 : 0;
      } catch (e) {
        return document.readyState === 'complete' ? 100 : 0;
      }
    };

    // Calculate combined progress
    const updateProgress = async () => {
      const docProgress = getDocumentProgress();
      const imgProgress = getImagesProgress();
      const windowProgress = getWindowLoadProgress();

      // Wait for fonts
      const fontProgress = await getFontsProgress();

      // Weighted average
      calculatedProgress =
        docProgress * 0.3 +
        imgProgress * 0.4 +
        fontProgress * 0.2 +
        windowProgress * 0.1;

      // Ensure progress doesn't go backwards
      setProgress((prev) => Math.max(prev, Math.min(calculatedProgress, 100)));
    };

    return updateProgress;
  };

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

    // Record start time
    startTimeRef.current = Date.now();

    // Initial setup - hide elements with smooth entrance
    gsap.set([logoElement, glowElement], { opacity: 0 });
    gsap.set(progressBarElement, { opacity: 0, y: 20 });
    gsap.set(progressFillElement, { width: '0%' });
    gsap.set(logoElement, { scale: 0, filter: 'blur(20px)' });
    gsap.set(glowElement, { scale: 0.5 });

    // Track actual loading progress
    const updateProgress = trackLoadingProgress();

    // Update progress more frequently for smoother updates
    const progressInterval = setInterval(async () => {
      await updateProgress();
    }, 50);

    // Declare variables that will be used in completeLoading
    let completeCheckInterval: NodeJS.Timeout;
    let maxTimeout: NodeJS.Timeout;
    let imageObserver: MutationObserver;

    // Function to complete loading and trigger exit animation
    const completeLoading = () => {
      if (loadingCompleteRef.current) return;
      loadingCompleteRef.current = true;

      // Stop all intervals and observers
      clearInterval(progressInterval);
      if (completeCheckInterval) clearInterval(completeCheckInterval);
      if (maxTimeout) clearTimeout(maxTimeout);
      if (imageObserver) imageObserver.disconnect();

      // Stop pulsing animations
      gsap.killTweensOf([logoElement, glowElement]);

      // Reset logo and glow
      gsap.set(logoElement, { scale: 1 });
      gsap.set(glowElement, { scale: 1.3, opacity: 0.7 });

      // Ensure progress is at 100%
      setProgress(100);
      gsap.set(progressFillElement, { width: '100%' });

      // Create exit timeline
      const exitTl = gsap.timeline({
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
        }
      });

      // Logo exit - scale up and fade
      exitTl.to(
        logoElement,
        {
          scale: 2,
          opacity: 0,
          filter: 'blur(15px)',
          duration: 0.7,
          ease: 'power3.in',
        }
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
        },
        '-=0.3'
      );

      timelineRef.current = exitTl;
    };

    // Check if loading is complete - optimized for faster loading
    const checkLoadingComplete = async () => {
      if (loadingCompleteRef.current) return;

      await updateProgress();

      const elapsed = Date.now() - startTimeRef.current;
      const minDurationElapsed = elapsed >= minDurationRef.current;

      // Wait for window to be fully loaded
      const windowLoaded = document.readyState === 'complete';

      // Check images - but don't wait forever (2 second timeout)
      const images = Array.from(document.querySelectorAll('img'));
      const allImagesLoaded = images.length === 0 ||
                            images.every(img => img.complete) ||
                            elapsed > 2000; // 2 second timeout for images

      // Check fonts - don't block on fonts
      let fontsReady = true;
      try {
        if ('fonts' in document) {
          fontsReady = true; // Don't wait for fonts
        }
      } catch (e) {
        fontsReady = true;
      }

      // Complete when: minimum duration passed AND (window loaded OR 1.5 seconds elapsed)
      // Don't wait forever for images if they're taking too long
      if (minDurationElapsed && (windowLoaded || elapsed > 1500) && (allImagesLoaded || elapsed > 1500) && fontsReady) {
        // Complete immediately, no delay
        completeLoading();
      }
    };

    // Monitor all images and add listeners
    const addImageListeners = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', checkLoadingComplete, { once: true });
          img.addEventListener('error', checkLoadingComplete, { once: true }); // Count errors as "loaded"
        }
      });
    };

    // Initial image listener setup
    addImageListeners();

    // Monitor for dynamically added images using MutationObserver
    imageObserver = new MutationObserver(() => {
      addImageListeners();
      checkLoadingComplete();
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for window load event
    const handleLoad = () => {
      checkLoadingComplete();
    };

    // Check if window already loaded (in case component mounted after load event)
    if (document.readyState === 'complete') {
      // Window already loaded, check immediately
      checkLoadingComplete();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Check more frequently for faster response
    completeCheckInterval = setInterval(checkLoadingComplete, 100);

    // Maximum timeout fallback - force completion after 3 seconds to prevent long waits
    maxTimeout = setTimeout(() => {
      if (!loadingCompleteRef.current) {
        console.warn('Loading screen timeout - forcing completion after 3 seconds');
        completeLoading();
      }
    }, 3000);

    // Create entrance timeline
    const entranceTl = gsap.timeline();

    // Phase 1: Logo entrance with smooth fade and blur effect
    entranceTl.to(logoElement, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power2.out',
    })
      // Add glow effect
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
      );

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(progressInterval);
      if (completeCheckInterval) {
        clearInterval(completeCheckInterval);
      }
      if (maxTimeout) {
        clearTimeout(maxTimeout);
      }
      if (imageObserver) {
        imageObserver.disconnect();
      }
      window.removeEventListener('load', handleLoad);
      document.body.style.overflow = '';
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      gsap.killTweensOf([logoElement, glowElement, progressBarElement, progressFillElement, screenElement]);
    };
  }, []);

  // Separate effect to update progress bar fill based on progress state
  useEffect(() => {
    if (!progressFillRef.current || !isLoading) return;

    gsap.to(progressFillRef.current, {
      width: `${progress}%`,
      duration: 0.3,
      ease: 'power1.out',
    });
  }, [progress, isLoading]);

  // Simple page reveal function - no animations, just ensure elements are visible
  const revealPageContent = () => {
    // Wait for DOM to be ready and elements to be rendered
    const attemptReveal = (attempts = 0) => {
      const maxAttempts = 10;

      // Get page elements
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

      // Simply ensure all elements are visible and interactive - no animations
      elements.forEach((el) => {
        if (el) {
          // Ensure element is visible
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.pointerEvents = 'auto';

          // Ensure all interactive children are clickable
          const interactiveElements = el.querySelectorAll('a, button, [role="button"], [tabindex]');
          interactiveElements.forEach((elem) => {
            (elem as HTMLElement).style.pointerEvents = 'auto';
            (elem as HTMLElement).style.cursor = 'pointer';
          });
        }
      });
    };

    // Start reveal attempt immediately after loading screen completes
    requestAnimationFrame(() => {
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
