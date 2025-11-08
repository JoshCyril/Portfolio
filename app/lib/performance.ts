/**
 * Performance optimization utilities for animations
 */

/**
 * Check if element is in viewport (for lazy loading animations)
 */
export const isInViewport = (element: HTMLElement, threshold = 0.1): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -rect.height * threshold &&
    rect.left >= -rect.width * threshold &&
    rect.bottom <= windowHeight + rect.height * threshold &&
    rect.right <= windowWidth + rect.width * threshold
  );
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (
  image: HTMLImageElement,
  src: string,
  callback?: () => void
): void => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            image.src = src;
            if (callback) callback();
            observer.unobserve(image);
          }
        });
      },
      { rootMargin: '50px' }
    );
    observer.observe(image);
  } else {
    // Fallback for older browsers
    image.src = src;
    if (callback) callback();
  }
};

/**
 * Will-change optimization helper
 */
export const setWillChange = (element: HTMLElement, properties: string[]): void => {
  if ('willChange' in document.documentElement.style) {
    element.style.willChange = properties.join(', ');
  }
};

/**
 * Remove will-change after animation
 */
export const removeWillChange = (element: HTMLElement, delay = 100): void => {
  setTimeout(() => {
    if ('willChange' in document.documentElement.style) {
      element.style.willChange = 'auto';
    }
  }, delay);
};
