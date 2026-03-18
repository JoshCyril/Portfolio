'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './animations';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimationContextType {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  prefersReducedMotion: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Update reduced motion preference
    const updateReducedMotion = () => {
      setReducedMotion(prefersReducedMotion());
    };

    updateReducedMotion();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updateReducedMotion);

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion);
      window.removeEventListener('resize', handleResize);
      // Cleanup ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const contextValue: AnimationContextType = {
    gsap,
    ScrollTrigger,
    prefersReducedMotion: reducedMotion,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
