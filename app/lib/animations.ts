import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Common animation configurations
 */
export const animationConfig = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
  },
  ease: {
    easeOut: 'power2.out',
    easeIn: 'power1.in',
    easeInOut: 'power2.inOut',
    bounce: 'bounce.out',
  },
  stagger: {
    small: 0.1,
    medium: 0.2,
    large: 0.3,
  },
};

/**
 * Fade in animation
 */
export const fadeIn = (
  element: string | HTMLElement | HTMLElement[],
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    y?: number;
    opacity?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  const {
    duration = animationConfig.duration.normal,
    delay = 0,
    ease = animationConfig.ease.easeOut,
    y = 0,
    opacity = 0,
    scrollTrigger,
  } = options;

  // Set will-change for performance
  const elements = Array.isArray(element)
    ? element
    : typeof element === 'string'
    ? Array.from(document.querySelectorAll(element))
    : [element];

  elements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.willChange = 'opacity, transform';
    }
  });

  const animation = gsap.fromTo(
    element,
    {
      opacity,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger,
      onComplete: () => {
        // Remove will-change after animation
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            setTimeout(() => {
              el.style.willChange = 'auto';
            }, 100);
          }
        });
      },
    }
  );

  return animation;
};

/**
 * Fade up animation (common for scroll-triggered reveals)
 */
export const fadeUp = (
  element: string | HTMLElement | HTMLElement[],
  options: {
    duration?: number;
    delay?: number;
    distance?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  const {
    duration = animationConfig.duration.normal,
    delay = 0,
    distance = 50,
    scrollTrigger,
  } = options;

  fadeIn(element, {
    duration,
    delay,
    y: distance,
    scrollTrigger: scrollTrigger || {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeUp = (
  elements: string | HTMLElement[],
  options: {
    duration?: number;
    stagger?: number;
    distance?: number;
    delay?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  const {
    duration = animationConfig.duration.normal,
    stagger = animationConfig.stagger.medium,
    distance = 50,
    delay = 0,
    scrollTrigger,
  } = options;

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: distance,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: animationConfig.ease.easeOut,
      scrollTrigger:
        scrollTrigger ||
        (typeof elements === 'string'
          ? {
              trigger: elements,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          : {
              trigger: elements[0]?.parentElement || elements[0],
              start: 'top 80%',
              toggleActions: 'play none none none',
            }),
    }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (
  element: string | HTMLElement | HTMLElement[],
  options: {
    duration?: number;
    delay?: number;
    scale?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, scale: 1 });
    return;
  }

  const {
    duration = animationConfig.duration.normal,
    delay = 0,
    scale = 0.8,
    scrollTrigger,
  } = options;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale,
    },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: animationConfig.ease.easeOut,
      scrollTrigger,
    }
  );
};

/**
 * Split text animation (for headings)
 */
export const splitTextFadeUp = (
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
  } = {}
) => {
  if (prefersReducedMotion() || !element) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const {
    duration = animationConfig.duration.normal,
    stagger = 0.05,
    delay = 0,
  } = options;

  const text = element.textContent || '';
  const words = text.split(' ');
  element.innerHTML = words
    .map((word) => `<span style="display: inline-block;">${word}</span>`)
    .join(' ');

  const wordSpans = element.querySelectorAll('span');

  gsap.fromTo(
    wordSpans,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: animationConfig.ease.easeOut,
    }
  );
};

/**
 * Slide in animation
 */
export const slideIn = (
  element: string | HTMLElement | HTMLElement[],
  options: {
    direction?: 'left' | 'right' | 'top' | 'bottom';
    duration?: number;
    delay?: number;
    distance?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, x: 0, y: 0 });
    return;
  }

  const {
    direction = 'left',
    duration = animationConfig.duration.normal,
    delay = 0,
    distance = 100,
    scrollTrigger,
  } = options;

  const fromProps: gsap.TweenVars = { opacity: 0 };
  const toProps: gsap.TweenVars = {
    opacity: 1,
    duration,
    delay,
    ease: animationConfig.ease.easeOut,
    scrollTrigger,
  };

  switch (direction) {
    case 'left':
      fromProps.x = -distance;
      toProps.x = 0;
      break;
    case 'right':
      fromProps.x = distance;
      toProps.x = 0;
      break;
    case 'top':
      fromProps.y = -distance;
      toProps.y = 0;
      break;
    case 'bottom':
      fromProps.y = distance;
      toProps.y = 0;
      break;
  }

  gsap.fromTo(element, fromProps, toProps);
};

/**
 * Cleanup function for ScrollTrigger
 */
export const cleanupScrollTrigger = (trigger?: ScrollTrigger) => {
  if (trigger) {
    trigger.kill();
  }
};

/**
 * Cleanup all ScrollTriggers (useful for cleanup on unmount)
 */
export const cleanupAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
