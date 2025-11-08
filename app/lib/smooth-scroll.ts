import { gsap } from 'gsap';
import { prefersReducedMotion } from './animations';

/**
 * Smooth scroll to a target element or position using GSAP
 */
export const smoothScrollTo = (
  target: string | HTMLElement | number,
  options: {
    offset?: number;
    duration?: number;
  } = {}
) => {
  const { offset = 80, duration = 1 } = options;
  let targetY: number;

  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    targetY = window.scrollY + rect.top - offset;
  } else if (typeof target === 'number') {
    targetY = target - offset;
  } else {
    const rect = target.getBoundingClientRect();
    targetY = window.scrollY + rect.top - offset;
  }

  if (prefersReducedMotion()) {
    // Use instant scroll for reduced motion
    window.scrollTo({ top: targetY, behavior: 'auto' });
    return;
  }

  // Use native smooth scroll with GSAP animation object for better performance
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  const animate = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = (currentTime - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out cubic)
    const easeProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const currentY = startY + distance * easeProgress;
    window.scrollTo(0, currentY);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Scroll to top smoothly
 */
export const scrollToTop = (duration = 1) => {
  smoothScrollTo(0, { duration, offset: 0 });
};

/**
 * Scroll to section by ID
 */
export const scrollToSection = (sectionId: string, offset = 80) => {
  smoothScrollTo(`#${sectionId}`, { offset });
};
