'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectCardAnimated from './ProjectCardAnimated';
import { simpleProject } from '@/app/lib/interface';
import { staggerFadeUp } from '@/app/lib/animations';
import { gsap } from 'gsap';

interface ProjectsPageClientProps {
  projects: simpleProject[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate project cards with stagger and scroll trigger
    if (cardsContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      const rafId = requestAnimationFrame(() => {
        const cards = Array.from(cardsContainerRef.current?.querySelectorAll('[data-project-card]') || []).filter(
          (el): el is HTMLElement => el instanceof HTMLElement
        );
        if (cards.length > 0) {
          // Set initial opacity to 0 for all cards to prevent flash
          cards.forEach((card) => {
            gsap.set(card, { opacity: 0, y: 50 });
          });

          staggerFadeUp(cards, {
            duration: 0.6,
            stagger: 0.15,
            distance: 50,
            delay: 0.2, // 200ms delay
            scrollTrigger: {
              trigger: cardsContainerRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [projects]);

  return (
    <div ref={cardsContainerRef} className="div flex flex-wrap py-3">
      {projects.map((project, idx) => (
        <ProjectCardAnimated
          key={idx}
          {...project}
          isDimmed={hoveredCardIndex !== null && hoveredCardIndex !== idx}
          onMouseEnter={() => setHoveredCardIndex(idx)}
          onMouseLeave={() => setHoveredCardIndex(null)}
        />
      ))}
    </div>
  );
}
