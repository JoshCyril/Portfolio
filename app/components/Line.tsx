'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

export default function Line() {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    // Old divs (with custom-border)
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    // New divs (without custom-border, on top)
    const newDiv1Ref = useRef<HTMLDivElement>(null);
    const newDiv2Ref = useRef<HTMLDivElement>(null);
    const newDiv3Ref = useRef<HTMLDivElement>(null);
    const newDiv4Ref = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);
    const animationRefs = useRef<(gsap.core.Tween | gsap.core.Timeline)[]>([]);
    const prevPathnameRef = useRef<string>(pathname);
    const isInitialMountRef = useRef(true);

    const animateLines = () => {
        if (prefersReducedMotion()) {
            // For reduced motion, just set to final state
            const oldDivs = [
                div1Ref.current,
                div2Ref.current,
                div3Ref.current,
                div4Ref.current,
            ].filter((div): div is HTMLDivElement => div !== null);
            const newDivs = [
                newDiv1Ref.current,
                newDiv2Ref.current,
                newDiv3Ref.current,
                newDiv4Ref.current,
            ].filter((div): div is HTMLDivElement => div !== null);

            // oldDivs.forEach((div) => {
            //     gsap.set(div, { y: 0, opacity: 1 });
            // });
            newDivs.forEach((div) => {
                gsap.set(div, { opacity: 0, visibility: 'hidden' });
            });
            return;
        }

        const oldDivs = [
            div1Ref.current,
            div2Ref.current,
            div3Ref.current,
            div4Ref.current,
        ].filter((div): div is HTMLDivElement => div !== null);

        const newDivs = [
            newDiv1Ref.current,
            newDiv2Ref.current,
            newDiv3Ref.current,
            newDiv4Ref.current,
        ].filter((div): div is HTMLDivElement => div !== null);

        if (oldDivs.length === 0 || newDivs.length === 0) return;

        const slideDistance = typeof window !== 'undefined' ? window.innerHeight : 1000;

        // Kill any existing animations first
        animationRefs.current.forEach(anim => anim.kill());
        animationRefs.current = [];

        // Keep old divs visible - don't hide them

        // Create timeline for each new div
        // Odd index (1, 3): top to bottom (slide in from top, exit to bottom)
        // Even index (0, 2): bottom to top (slide in from bottom, exit to top)
        newDivs.forEach((newDiv, index) => {
            const isOdd = index % 2 === 1; // Odd: top to bottom
            const isEven = index % 2 === 0; // Even: bottom to top

            // Set initial state based on index
            // if (isOdd) {
                // Odd: start from top
                gsap.set(newDiv, {
                    y: slideDistance,
                    opacity: 1,
                    visibility: 'visible',
                });
            // } else {
            //     // Even: start from bottom
            //     gsap.set(newDiv, {
            //         y: slideDistance,
            //         opacity: 1,
            //         visibility: 'visible',
            //     });
            // }

            const timeline = gsap.timeline({
                delay: index * 0.05, // Reduced stagger: 0.05s between each div
            });

            // Slide in to center - reduced duration
            timeline.to(newDiv, {
                y: 0,
                duration: 0.25, // Reduced from 0.4s
                ease: 'power2.out',
            });

            // Stay for a bit - reduced duration
            timeline.to({}, {
                duration: 0.25, // Reduced from 0.2s
            });

            // Exit based on index - reduced duration
            // if (isOdd) {
                // Odd: exit to bottom
                timeline.to(newDiv, {
                    y: -slideDistance,
                    duration: 0.4, // Reduced from 0.4s 0.25
                    ease: 'power2.in',
                    onComplete: () => {
                        gsap.set(newDiv, { visibility: 'hidden' });
                    },
                });
            // } else {
            //     // Even: exit to top
            //     timeline.to(newDiv, {
            //         y: -slideDistance,
            //         duration: 0.4, // Reduced from 0.4s 0.25
            //         ease: 'power2.in',
            //         onComplete: () => {
            //             gsap.set(newDiv, { visibility: 'hidden' });
            //         },
            //     });
            // }

            animationRefs.current.push(timeline);
        });
    };

    // Trigger animation on route change
    useEffect(() => {
        // Skip on initial mount
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            prevPathnameRef.current = pathname;
            return;
        }

        // Check if pathname changed
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            // Reset animation state for new route
            hasAnimatedRef.current = false;
            // Animate immediately - no delay
            animateLines();
            hasAnimatedRef.current = true;
        }
    }, [pathname]);

    useEffect(() => {
        // Handle navigation start (triggered immediately when nav button is clicked)
        const handleNavigationStart = () => {
            // Reset animation state for new navigation
            hasAnimatedRef.current = false;
            // Animate immediately - no delay
            animateLines();
            hasAnimatedRef.current = true;
        };

        // Fallback: Listen for page transition completion event (for cases where navigation doesn't trigger)
        const handlePageTransition = () => {
            // Only animate if we haven't already animated from navigation click or route change
            if (!hasAnimatedRef.current) {
                hasAnimatedRef.current = false;
                animateLines();
                hasAnimatedRef.current = true;
            }
        };

        // Listen for navigation start event (from Navbar clicks)
        window.addEventListener('navigationStart', handleNavigationStart);
        // Listen for page transition completion event (fallback)
        window.addEventListener('pageTransitionComplete', handlePageTransition);

        // Also animate on initial mount (for first page load)
        const timeoutId = setTimeout(() => {
            if (!hasAnimatedRef.current) {
                animateLines();
                hasAnimatedRef.current = true;
            }
        }, 100);

        return () => {
            window.removeEventListener('navigationStart', handleNavigationStart);
            window.removeEventListener('pageTransitionComplete', handlePageTransition);
            clearTimeout(timeoutId);
            // Cleanup animations on unmount
            animationRefs.current.forEach(anim => anim.kill());
            animationRefs.current = [];
        };
    }, []);

    return (
        <div className="grid place-items-center">
            <div ref={containerRef} className="fixed top-0 z-0 grid h-screen w-11/12 max-w-screen-2xl grid-cols-1 place-items-center border-x-2 border-solid border-sky-500 border-opacity-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* Column 1 - div1 (always visible) */}
                <div className="relative h-full w-full">
                    <div ref={div1Ref} className="custom-border h-full w-full"></div>
                    <div ref={newDiv1Ref} className="bg-primary/5 absolute inset-0 z-50 h-full w-full" style={{ visibility: 'hidden' }}></div>
                </div>

                {/* Column 2 - div2 (hidden sm:hidden md:hidden lg:block) */}
                <div className="relative hidden h-full w-full sm:hidden md:hidden lg:block">
                    <div ref={div2Ref} className="custom-border h-full w-full"></div>
                    <div ref={newDiv2Ref} className="bg-primary/5 absolute inset-0 z-50 hidden h-full w-full sm:hidden md:hidden lg:block" style={{ visibility: 'hidden' }}></div>
                </div>

                {/* Column 3 - div3 (hidden sm:hidden md:block lg:block) */}
                <div className="relative hidden h-full w-full sm:hidden md:block lg:block">
                    <div ref={div3Ref} className="custom-border h-full w-full"></div>
                    <div ref={newDiv3Ref} className="bg-primary/5 absolute inset-0 z-50 hidden h-full w-full sm:hidden md:block lg:block" style={{ visibility: 'hidden' }}></div>
                </div>

                {/* Column 4 - div4 (hidden sm:block md:block lg:block) */}
                 <div className="relative hidden h-full w-full sm:block md:block lg:block">
                    <div ref={div4Ref} className="h-full w-full"></div>
                    <div ref={newDiv4Ref} className="bg-primary/5 absolute inset-0 z-50 hidden h-full w-full sm:block md:block lg:block" style={{ visibility: 'hidden' }}></div>
                </div>

            </div>
        </div>
    );
}
