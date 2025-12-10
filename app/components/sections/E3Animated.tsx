'use client';

import { useEffect, useRef } from 'react';
import { fadeUp, staggerFadeUp } from '@/app/lib/animations';
import { Laptop2, Box, PencilRuler } from 'lucide-react';
import { Ee3 } from '@/app/lib/interface';
import { urlFor } from '@/app/lib/sanity';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

interface E3AnimatedProps {
  data: Ee3;
}

export default function E3Animated({ data }: E3AnimatedProps) {
  const expTitleRef = useRef<HTMLDivElement>(null);
  const eduTitleRef = useRef<HTMLDivElement>(null);
  const expTitleRef2 = useRef<HTMLDivElement>(null);
  const expCardsRef = useRef<HTMLDivElement>(null);
  const eduCardsRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate section titles with scroll triggers
    if (expTitleRef.current) {
      fadeUp(expTitleRef.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: expTitleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (eduTitleRef.current) {
      fadeUp(eduTitleRef.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: eduTitleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (expTitleRef2.current) {
      fadeUp(expTitleRef2.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: expTitleRef2.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate experience cards
    if (expCardsRef.current) {
      const cards = Array.from(expCardsRef.current.querySelectorAll('[data-exp-card]')).filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      );
      if (cards.length > 0) {
        staggerFadeUp(cards, {
          duration: 0.6,
          stagger: 0.15,
          distance: 40,
          scrollTrigger: {
            trigger: expCardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

    // Animate education cards
    if (eduCardsRef.current) {
      const cards = Array.from(eduCardsRef.current.querySelectorAll('[data-edu-card]')).filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      );
      if (cards.length > 0) {
        staggerFadeUp(cards, {
          duration: 0.5,
          stagger: 0.1,
          distance: 30,
          scrollTrigger: {
            trigger: eduCardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

    // Animate expertise items
    if (expertiseRef.current) {
      const items = Array.from(expertiseRef.current.querySelectorAll('[data-expertise-item]')).filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      );
      if (items.length > 0) {
        staggerFadeUp(items, {
          duration: 0.5,
          stagger: 0.1,
          distance: 20,
          scrollTrigger: {
            trigger: expertiseRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }
  }, [data]);

  return (
    <div className="mb-5 grid h-fit place-items-center py-6">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div
          ref={expTitleRef}
          className="relative col-span-2 mb-4 ml-3 flex basis-full items-center py-2"
          style={{ opacity: 0 }}
        >
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <span className="flex text-2xl font-bold md:text-3xl">Experiences</span>
        </div>

        <div className="div flex flex-wrap justify-between py-3">
          <div className="mb-2 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">
            <div ref={expCardsRef} className="div flex flex-wrap">
              {data.exp.map((eu, idx) => (
                <div
                  key={idx}
                  data-exp-card
                  className="mb-5 basis-full px-3"
                  style={{ opacity: 0 }}
                >
                  <div className="group relative h-fit rounded-lg bg-secondary p-1 shadow-sm">
                    <div className="grid grid-cols-5">
                      <div className="relative col-span-1 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 shadow-inner">
                        <Image
                          src={urlFor(eu.company.Img).url()}
                          alt={eu.company.name + ' image'}
                          width={120}
                          height={120}
                          className="z-20 h-full w-full bg-primary object-cover object-center shadow-2xl grayscale transition-all duration-300 ease-in-out group-hover:grayscale-0"
                          loading="lazy"
                        />
                      </div>
                      <div className="col-span-4 ml-2 p-2 pr-3">
                        <div className="mb-2 grid grid-cols-3">
                          <div className="col-span-1 text-lg font-semibold">{eu.title}</div>
                          <div className="text-md col-span-2 mt-1 text-right font-medium">
                            {eu.yoe}
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          {eu.company.name} | {eu.company.location}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-lg prose-blue ml-4 max-w-none p-3 text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                      <PortableText value={eu.content} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mb-2 mt-24 basis-full p-3 sm:mt-24 sm:basis-full md:basis-full lg:mt-0 lg:basis-1/4">
            <div
              ref={eduTitleRef}
              className="absolute -top-[5.5rem] -ml-0.5 flex basis-full items-center py-2"
              style={{ opacity: 0 }}
            >
              <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
              <span className="flex text-2xl font-bold md:text-3xl">Education</span>
            </div>

            <div ref={eduCardsRef} className="div flex flex-wrap">
              {data.edu.map((ed, idx) => (
                <div
                  key={idx}
                  data-edu-card
                  className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/2 lg:basis-full"
                  style={{ opacity: 0 }}
                >
                  <div className="group relative h-fit rounded-lg bg-secondary p-1 shadow-sm">
                    <div className="grid grid-cols-4">
                      <div className="relative col-span-1 flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 shadow-inner">
                        <Image
                          src={urlFor(ed.uni.Img).url()}
                          alt={ed.uni.name + ' image'}
                          width={120}
                          height={120}
                          className="z-20 h-full w-full bg-primary object-cover object-center shadow-2xl grayscale transition-all duration-300 ease-in-out group-hover:grayscale-0"
                          loading="lazy"
                        />
                      </div>
                      <div className="col-span-3 ml-2 p-2">
                        <div className="BigProjectSTitle mb-1 text-xl font-semibold">
                          {ed.title}
                        </div>
                        <div className="flex-col items-center text-sm">
                          <div>{ed.uni.name} </div>
                          <div>{ed.uni.location} </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mb-2 mt-24 basis-full p-3 sm:mt-24 sm:basis-full md:basis-full lg:mt-0 lg:basis-1/4">
            <div
              ref={expTitleRef2}
              className="absolute -top-[5.5rem] -ml-0.5 flex basis-full items-center py-2"
              style={{ opacity: 0 }}
            >
              <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
              <span className="flex text-2xl font-bold md:text-3xl">Expertise</span>
            </div>

            <div ref={expertiseRef} className="div flex flex-wrap">
              <div
                data-expertise-item
                className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full"
                style={{ opacity: 0 }}
              >
                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                  <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                    <Laptop2 strokeWidth={0.5} absoluteStrokeWidth />
                  </div>
                  <div className="ml-3 flex items-center p-2">
                    <div className="font-regular">Web Architect</div>
                  </div>
                </div>
              </div>

              <div
                data-expertise-item
                className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full"
                style={{ opacity: 0 }}
              >
                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                  <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                    <Box strokeWidth={0.5} absoluteStrokeWidth />
                  </div>
                  <div className="ml-3 flex items-center p-2">
                    <div className="font-regular">Custom AI Agent</div>
                  </div>
                </div>
              </div>

              <div
                data-expertise-item
                className="mb-5 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-full"
                style={{ opacity: 0 }}
              >
                <div className="relative flex h-fit rounded-lg bg-secondary p-1 shadow-sm">
                  <div className="relative grid h-12 w-12 place-items-center rounded-lg">
                    <PencilRuler strokeWidth={0.5} absoluteStrokeWidth />
                  </div>
                  <div className="ml-3 flex items-center p-2">
                    <div className="font-regular">Workflow Automation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
