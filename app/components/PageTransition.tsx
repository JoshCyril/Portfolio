'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayChildren(children);
      return;
    }

    setIsTransitioning(true);

    // Fade out
    gsap.to('main, body', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayChildren(children);
        // Fade in
        gsap.fromTo(
          'main, body',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              setIsTransitioning(false);
            },
          }
        );
      },
    });
  }, [pathname, children]);

  return <>{displayChildren}</>;
}
