'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { fadeUp } from '@/app/lib/animations';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  distance = 50,
  duration,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      fadeUp(ref.current, {
        delay,
        distance,
        duration,
      });
    }
  }, [delay, distance, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
