'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { prefersReducedMotion } from '@/app/lib/animations';

export function ModeToggleAnimated() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const rippleContainerRef = React.useRef<HTMLDivElement | null>(null);
  const previousThemeRef = React.useRef<string | undefined>(theme);
  const previousResolvedThemeRef = React.useRef<string | undefined>(resolvedTheme);
  const [open, setOpen] = React.useState(false);

  // Create full-page ripple effect on theme change
  const createThemeRipple = React.useCallback((buttonElement: HTMLElement, newTheme: string) => {
    if (prefersReducedMotion()) return;

    // Get button position
    const rect = buttonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate maximum distance to cover entire viewport (diagonal)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(centerX, viewportWidth - centerX), 2) +
      Math.pow(Math.max(centerY, viewportHeight - centerY), 2)
    );

    // Create ripple container if it doesn't exist
    if (!rippleContainerRef.current) {
      const container = document.createElement('div');
      container.id = 'theme-ripple-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(container);
      rippleContainerRef.current = container;
    }

    // Determine if the new theme is dark based on resolved theme
    // Use resolvedTheme if available, otherwise check DOM
    const determineIsDark = () => {
      // Check DOM for dark class (most reliable)
      if (typeof document !== 'undefined') {
        return document.documentElement.classList.contains('dark');
      }
      // Fallback to theme string
      return newTheme === 'dark';
    };

    // Create ripple immediately - the theme change happens synchronously
    const isDark = determineIsDark();

    // Create ripple element with theme-appropriate colors
    const ripple = document.createElement('div');
    const size = maxDistance * 2.2; // Slightly larger to ensure full coverage

    // Use theme-appropriate colors - lighter for dark theme, darker for light theme
    const rippleColor = isDark
      ? 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 60%, transparent 80%)'
      : 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.05) 60%, transparent 80%)';

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${centerX - size / 2}px;
      top: ${centerY - size / 2}px;
      border-radius: 50%;
      background: ${rippleColor};
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      will-change: transform, opacity;
    `;

    if (rippleContainerRef.current) {
      rippleContainerRef.current.appendChild(ripple);

      // Animate ripple expansion with smooth easing
      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove();
          // Remove container if empty
          if (rippleContainerRef.current && rippleContainerRef.current.children.length === 0) {
            rippleContainerRef.current.remove();
            rippleContainerRef.current = null;
          }
        },
      });
    }
  }, []);

  // Handle theme change with ripple effect
  React.useEffect(() => {
    // Skip on initial mount
    if (previousThemeRef.current === undefined) {
      previousThemeRef.current = theme;
      previousResolvedThemeRef.current = resolvedTheme;
      return;
    }

    // Trigger if theme preference changed OR resolved theme changed (for system theme)
    const themeChanged = previousThemeRef.current !== theme;
    const resolvedThemeChanged = previousResolvedThemeRef.current !== resolvedTheme;

    if ((themeChanged || resolvedThemeChanged) && buttonRef.current) {
      // Use resolvedTheme for more accurate theme detection - ensure we have a valid string
      const newTheme = resolvedTheme || theme || 'system';

      // Rotate icon animation
      if (buttonRef.current && !prefersReducedMotion()) {
        gsap.to(buttonRef.current, {
          rotation: '+=360',
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      // Small delay to ensure DOM has updated with new theme class
      requestAnimationFrame(() => {
        if (buttonRef.current) {
          // Create ripple effect with new theme - ensure we always have a valid string
          const themeToUse = newTheme || theme || 'system';
          createThemeRipple(buttonRef.current, themeToUse);
        }
      });

      previousThemeRef.current = theme;
      previousResolvedThemeRef.current = resolvedTheme;
    }
  }, [theme, resolvedTheme, createThemeRipple]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (rippleContainerRef.current) {
        rippleContainerRef.current.remove();
        rippleContainerRef.current = null;
      }
    };
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          ref={buttonRef}
          className="h-11 w-11 md:h-10 md:w-10 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] md:min-w-[8rem]">
        <DropdownMenuItem onClick={() => {
          handleThemeChange('light');
          setOpen(false);
        }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          handleThemeChange('dark');
          setOpen(false);
        }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          handleThemeChange('system');
          setOpen(false);
        }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
