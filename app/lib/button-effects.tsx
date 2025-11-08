'use client';

import { useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from './animations';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic button effect - subtle pull effect on hover
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    if (!buttonRef.current || prefersReducedMotion()) return;

    const button = buttonRef.current;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as unknown as MouseEvent;
      const rect = button.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <span ref={buttonRef as any} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}

/**
 * Create ripple effect on click
 */
export const createRipple = (e: MouseEvent<HTMLElement>, color = 'rgba(255, 255, 255, 0.5)') => {
  if (prefersReducedMotion()) return;

  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${color};
    border-radius: 50%;
    transform: scale(0);
    pointer-events: none;
    z-index: 1000;
  `;

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  gsap.to(ripple, {
    scale: 4,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      ripple.remove();
    },
  });
};
