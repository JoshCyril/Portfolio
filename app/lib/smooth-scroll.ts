import { gsap } from 'gsap';
import { prefersReducedMotion } from './animations';

// Store active scroll animation ID for cancellation
let activeScrollAnimation: number | null = null;

/**
 * Smooth scroll to a target element or position with enhanced easing
 */
export const smoothScrollTo = (
  target: string | HTMLElement | number,
  options: {
    offset?: number;
    duration?: number;
  } = {}
) => {
  const { offset = 80, duration = 1.2 } = options;
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

  // Cancel any existing scroll animation
  if (activeScrollAnimation !== null) {
    cancelAnimationFrame(activeScrollAnimation);
    activeScrollAnimation = null;
  }

  // Use requestAnimationFrame for smoother scrolling with power3 ease-in-out
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsed = (currentTime - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);

    // Power3 ease-in-out function for smooth acceleration and deceleration
    // This creates a smooth S-curve: slow start, fast middle, slow end
    const easeInOut = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const currentY = startY + distance * easeInOut;
    window.scrollTo(0, currentY);

    if (progress < 1) {
      activeScrollAnimation = requestAnimationFrame(animateScroll);
    } else {
      activeScrollAnimation = null;
    }
  };

  activeScrollAnimation = requestAnimationFrame(animateScroll);
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
