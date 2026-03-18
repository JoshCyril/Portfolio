'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { fadeIn, staggerFadeUp, scaleIn, prefersReducedMotion } from '@/app/lib/animations';
import { Github, Linkedin, Bot, Mail, ArrowUpRightFromSquare, Send } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MainAnimatedProps {
  tagline: string;
}

export default function MainAnimated({ tagline }: MainAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLSpanElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const contLineRef = useRef<HTMLDivElement>(null);
  const [nameLetters, setNameLetters] = useState<Array<{ char: string; isSpace: boolean }>>([]);
  const nameAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const letterRefs = useRef<Map<number, HTMLElement>>(new Map());
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoveringRef = useRef<boolean>(false);
  const magneticAnimationsRef = useRef<Map<number, gsap.core.Tween>>(new Map());

  // Split name into letters on mount
  useEffect(() => {
    const name = 'Joshua Cyril';
    const letters = name.split('').map((char) => ({
      char,
      isSpace: char === ' ',
    }));
    setNameLetters(letters);
  }, []);

  // Setup name text animation on mount
  useEffect(() => {
    if (!nameTextRef.current || prefersReducedMotion()) return;

    // Ensure letters are rendered
    const letterSpans = nameTextRef.current.querySelectorAll('.name-letter');
    if (letterSpans.length === 0) return;

    // Set initial styles for letters and store original color
    letterSpans.forEach((letter, index) => {
      const el = letter as HTMLElement;
      gsap.set(el, {
        display: 'inline-block',
        transformOrigin: 'center center',
      });
      // Store original color from computed style
      const computedStyle = window.getComputedStyle(el);
      el.dataset.originalColor = computedStyle.color;
      // Store reference to letter
      letterRefs.current.set(index, el);
    });
  }, [nameLetters]);

  // Magnetic mouse move effect
  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion() || !isHoveringRef.current || !nameTextRef.current) return;

    const containerRect = nameTextRef.current.getBoundingClientRect();

    // Update mouse position relative to the name container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    mousePositionRef.current = { x: mouseX, y: mouseY };

    // Apply magnetic effect to each letter
    letterRefs.current.forEach((letter, index) => {
      if (!letter || !letter.classList.contains('name-letter')) return;

      // Get letter's bounding box (this accounts for any existing transforms)
      const letterRect = letter.getBoundingClientRect();
      // Calculate letter center relative to container
      const letterCenterX = (letterRect.left + letterRect.right) / 2 - containerRect.left;
      const letterCenterY = (letterRect.top + letterRect.bottom) / 2 - containerRect.top;

      // Calculate distance and direction from mouse to letter center
      const dx = mouseX - letterCenterX;
      const dy = mouseY - letterCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Magnetic strength (stronger when closer, effective within ~100px)
      const maxDistance = 100;
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const strength = 1 - normalizedDistance; // 1 when close, 0 when far
      const magneticStrength = 0.6; // Overall magnetic pull strength

      // Calculate magnetic offset - letters are attracted toward mouse
      const offsetX = dx * strength * magneticStrength;
      const offsetY = dy * strength * magneticStrength;

      // Kill existing animation for this letter to prevent conflicts
      const existingAnim = magneticAnimationsRef.current.get(index);
      if (existingAnim) {
        existingAnim.kill();
      }

      // Get current transform values to build upon
      const currentX = (gsap.getProperty(letter, 'x') as number) || 0;
      const currentY = (gsap.getProperty(letter, 'y') as number) || 0;

      // Reset to base position first, then apply magnetic offset
      // This ensures letters return to center when mouse moves away
      const targetX = offsetX;
      const targetY = offsetY;

      // Animate letter position smoothly with magnetic effect
      const anim = gsap.to(letter, {
        x: targetX,
        y: targetY,
        scale: 1 + strength * 0.3, // Scale increases as mouse gets closer
        rotation: strength * 12 * (index % 2 === 0 ? 1 : -1), // Alternating rotation based on index
        duration: 0.4,
        ease: 'power2.out',
      });

      magneticAnimationsRef.current.set(index, anim);
    });
  };

  // Create ripple effect
  const createRipple = (e: React.MouseEvent<HTMLSpanElement>, letter: HTMLElement) => {
    if (prefersReducedMotion()) return;

    const rect = letter.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 141, 249, 0.4) 0%, rgba(0, 141, 249, 0) 70%);
      pointer-events: none;
      z-index: 1;
      transform: scale(0);
      opacity: 1;
    `;

    letter.style.position = 'relative';
    letter.style.zIndex = '1';
    letter.appendChild(ripple);

    // Animate ripple
    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove();
      },
    });
  };

  // Handle letter hover for ripple
  const handleLetterMouseEnter = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    const letter = letterRefs.current.get(index);
    if (letter && !prefersReducedMotion()) {
      createRipple(e, letter);
    }
  };

  // Hover animation for name container
  const handleNameHover = () => {
    if (!nameTextRef.current || prefersReducedMotion()) return;
    isHoveringRef.current = true;

    const letterSpans = nameTextRef.current.querySelectorAll('.name-letter');
    if (letterSpans.length === 0) return;

    // Kill any existing animation
    if (nameAnimationRef.current) {
      nameAnimationRef.current.kill();
    }

    // Create initial animation timeline with subtle effects
    nameAnimationRef.current = gsap.timeline();

    // Animate each letter with subtle initial effects
    letterSpans.forEach((letter, index) => {
      const el = letter as HTMLElement;
      // Skip spaces
      if (!el.classList.contains('name-letter')) return;

      nameAnimationRef.current!.to(
        el,
        {
          color: '#008df9', // Primary color
          duration: 0.4,
          ease: 'power2.out',
        },
        index * 0.02 // Stagger - creates wave effect
      );
    });
  };

  const handleNameLeave = () => {
    if (!nameTextRef.current || prefersReducedMotion()) return;
    isHoveringRef.current = false;

    // Kill all magnetic animations
    magneticAnimationsRef.current.forEach((anim) => {
      anim.kill();
    });
    magneticAnimationsRef.current.clear();

    const letterSpans = nameTextRef.current.querySelectorAll('.name-letter');
    if (letterSpans.length === 0) return;

    // Kill any existing animation
    if (nameAnimationRef.current) {
      nameAnimationRef.current.kill();
    }

    // Reset to original state with stagger
    nameAnimationRef.current = gsap.timeline();

    letterSpans.forEach((letter, index) => {
      const el = letter as HTMLElement;
      // Skip spaces
      if (!el.classList.contains('name-letter')) return;

      // Get original color from dataset or compute it
      const originalColor = el.dataset.originalColor;

      nameAnimationRef.current!.to(
        el,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          color: originalColor || 'inherit', // Animate back to original or inherit from parent
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => {
            // Clear inline color style to restore CSS class color
            el.style.removeProperty('color');
          },
        },
        index * 0.02
      );
    });
  };

  useEffect(() => {
    // Capture ref values at the start of the effect
    const nameAnim = nameAnimationRef.current;
    const magneticAnims = magneticAnimationsRef.current;

    // Animate avatar with scale

    if (contLineRef.current) {
        fadeIn(contLineRef.current, {
          duration: 0.8,
          delay: 0.8,
          y: 20,
        });
      }

    if (avatarRef.current) {
      scaleIn(avatarRef.current, {
        duration: 0.8,
        delay: 0.5,
        scale: 1.2,
      });
    }

    // Animate "Hello,"
    if (helloRef.current) {
      fadeIn(helloRef.current, {
        duration: 0.6,
        delay: 0.8,
        y: 20,
      });
    }

    // Animate name section
    if (nameSectionRef.current) {
      fadeIn(nameSectionRef.current, {
        duration: 0.6,
        delay: 1,
        y: 20,
      });
    }

    // Animate tagline
    if (taglineRef.current) {
      fadeIn(taglineRef.current, {
        duration: 0.8,
        delay: 1.2,
        y: 20,
      });
    }


    if (socialLinksRef.current) {
        fadeIn(socialLinksRef.current, {
          duration: 0.6,
          delay: 1.4,
          y: 10,
        });
      }

    // Animate social links with stagger
    if (socialLinksRef.current) {
      const links = Array.from(socialLinksRef.current.querySelectorAll('a')).filter(
        (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement
      );
      if (links.length > 0) {
        // Use setTimeout to delay the animation instead of delay parameter
          staggerFadeUp(links, {
            delay: 1.4,
            duration: 0.5,
            stagger: 0.1,
            distance: 20,
          });
      }
    }

    // Animate location
    if (locationRef.current) {
      fadeIn(locationRef.current, {
        duration: 0.6,
        delay: 2.2,
        y: 10,
      });
    }

    // Cleanup on unmount
    return () => {
      if (nameAnim) {
        nameAnim.kill();
      }
      if (magneticAnims) {
        magneticAnims.forEach((anim) => {
          anim.kill();
        });
        magneticAnims.clear();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="grid h-[80vh] place-items-center">
      <div className="z-10 grid w-11/12 max-w-screen-2xl grid-cols-1 gap-6 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative col-span-4 flex w-full items-center py-2">
          <div ref={contLineRef} className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <div className="text-4xl font-medium md:text-5xl">
            <div className="flex items-center">
              <div ref={avatarRef} style={{ opacity: 0 }}>
                <Avatar className="ml-1">
                  <AvatarImage src="/pfp.webp" alt="@joshcyril" />
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
              </div>
              <span ref={helloRef} className="ml-2 md:ml-4" style={{ opacity: 0 }}>Hello,</span>
            </div>
            <div ref={nameSectionRef} className="pt-4 sm:pt-6" style={{ opacity: 0 }}>
              I&apos;m{' '}
              <span
                ref={nameTextRef}
                className="relative cursor-pointer select-none text-4xl font-bold text-primary md:text-5xl"
                onMouseEnter={handleNameHover}
                onMouseLeave={handleNameLeave}
                onMouseMove={handleMouseMove}
                style={{ display: 'inline-block' }}
              >
                {nameLetters.map((item, index) => (
                  <span
                    key={index}
                    className={item.isSpace ? '' : 'name-letter'}
                    style={item.isSpace ? { width: '0.25em', display: 'inline-block' } : { display: 'inline-block', position: 'relative' }}
                    onMouseEnter={(e) => handleLetterMouseEnter(e, index)}
                  >
                    {item.char}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
        <div ref={taglineRef} className="relative col-span-4 flex w-full items-center py-1" style={{ opacity: 0 }}>
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="text-base font-medium sm:text-xl md:text-2xl">{tagline}</span>
        </div>
        <div ref={socialLinksRef} className="relative col-span-4 flex w-full items-center py-1">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <div className="grid grid-cols-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth" enableMagnetic enableRipple magneticStrength={0.2} aria-label="LinkedIn">
                    <Link href="https://www.linkedin.com/in/joshcyril/" rel="noopener noreferrer" target="_blank">
                      <Linkedin size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    LinkedIn <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth" enableMagnetic enableRipple magneticStrength={0.2} aria-label="Discord">
                    <Link href="https://discordapp.com/users/1136917465260097576" rel="noopener noreferrer" target="_blank">
                      <Bot size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Discord <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth" enableMagnetic enableRipple magneticStrength={0.2} aria-label="Email">
                    <Link href="mailto:joshcyril_25@outlook.com" rel="noopener noreferrer" target="_blank">
                      <Mail size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Email <Send size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="ghosth" enableMagnetic enableRipple magneticStrength={0.2} aria-label="GitHub">
                    <Link href="https://github.com/JoshCyril" rel="noopener noreferrer" target="_blank">
                      <Github size={18} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex gap-1">
                    Github <ArrowUpRightFromSquare size={10} />
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div ref={locationRef} className="absolute top-10 col-span-4 flex items-center" style={{ opacity: 0 }}>
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="text-md font-regular">Bengaluru, India</span>
        </div>
      </div>
    </div>
  );
}
