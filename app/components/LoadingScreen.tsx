'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsLoading(false);
      return;
    }

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Animate loading screen
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        document.body.style.overflow = '';
      },
    });

    tl.to('.loading-progress', {
      width: '100%',
      duration: 1.5,
      ease: 'power2.out',
    })
      .to('.loading-content', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
      })
      .to('.loading-screen', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          document.querySelector('.loading-screen')?.remove();
        },
      });

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(progressInterval);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="loading-content flex flex-col items-center gap-4">
        <div className="text-2xl font-bold text-primary">Loading...</div>
        <div className="h-1 w-64 overflow-hidden rounded-full bg-secondary">
          <div
            className="loading-progress h-full bg-primary"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
