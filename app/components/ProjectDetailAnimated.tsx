'use client';

import { useEffect, useRef } from 'react';
import { FullProject } from "@/app/lib/interface";
import { urlFor } from "@/app/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/app/components/ProjectGallery";
import { fadeIn, staggerFadeUp } from '@/app/lib/animations';

interface ProjectDetailAnimatedProps {
  data: FullProject;
}

export default function ProjectDetailAnimated({ data }: ProjectDetailAnimatedProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const overviewSectionRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const caseStudyRef = useRef<HTMLDivElement>(null);
  const caseStudyContentRef = useRef<HTMLDivElement>(null);
  const screenshotsRef = useRef<HTMLDivElement>(null);
  const linksSectionRef = useRef<HTMLDivElement>(null);
  const linksTableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      fadeIn(titleRef.current, {
        duration: 0.6,
        delay: 0.5,
        y: 20,
      });
    }

    // Animate image section
    if (imageSectionRef.current) {
      fadeIn(imageSectionRef.current, {
        duration: 0.6,
        delay: 0.8,
        y: 30,
      });
    }

    // Animate overview section
    if (overviewSectionRef.current) {
      fadeIn(overviewSectionRef.current, {
        duration: 0.6,
        delay: 1,
        y: 30,
      });
    }

    // Animate tags with stagger
    if (tagsRef.current) {
      const tagElements = Array.from(tagsRef.current.querySelectorAll('div')).filter(
        (el): el is HTMLDivElement => el instanceof HTMLDivElement
      );
      if (tagElements.length > 0) {
        staggerFadeUp(tagElements, {
          delay: 0.8,
          duration: 0.5,
          stagger: 0.1,
          distance: 20,
        });
      }
    }

    // Animate case study title
    if (caseStudyRef.current) {
      fadeIn(caseStudyRef.current, {
        duration: 0.6,
        delay: 1.2,
        y: 20,
      });
    }

    // Animate case study content
    if (caseStudyContentRef.current) {
      fadeIn(caseStudyContentRef.current, {
        duration: 0.6,
        delay: 1.4,
        y: 30,
      });
    }

    // Animate screenshots title
    if (screenshotsRef.current) {
      fadeIn(screenshotsRef.current, {
        duration: 0.6,
        delay: 1.6,
        y: 20,
      });
    }

    // Animate links section title
    if (linksSectionRef.current) {
      fadeIn(linksSectionRef.current, {
        duration: 0.6,
        delay: 1.8,
        y: 20,
      });
    }

    // Animate links table rows with stagger
    if (linksTableRef.current) {
      const rows = Array.from(linksTableRef.current.querySelectorAll('tr')).filter(
        (el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement
      );
      if (rows.length > 0) {
        staggerFadeUp(rows, {
          delay: 2,
          duration: 0.5,
          stagger: 0.1,
        //   distance: 20,
        });
      }
    }
  }, []);

  return (
    <div className="mt-10 grid h-fit place-items-center md:mt-28">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div className="relative col-span-4 mb-4 ml-3 mt-0 flex w-full basis-full items-center py-2 md:mt-8">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
          <h1 ref={titleRef} className="flex text-3xl font-bold md:text-4xl">{data.title}</h1>
        </div>

        <div className="flex flex-wrap py-3">
          <div ref={imageSectionRef} className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">
            <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
              {/* image */}
              <div className="flex basis-full justify-center rounded-xl border bg-cover bg-center">
                <Image src={urlFor(data.proImg).url()} alt={(data.slug || data.title)+" image"} width={720} height={720} className="w-full rounded-xl bg-blue-400 bg-cover bg-center" loading="lazy" />
              </div>

              {/* skills */}
              <div className="mt-3 basis-full p-3">
                <div className="mt-2 flex flex-wrap">
                  <div ref={tagsRef} className="mt-2 flex flex-wrap">
                    {(data.tags ?? []).map((tag, idx) =>(
                      <div key={idx} className="m-1 flex items-center rounded-md border border-primary/20 p-1 pr-2 text-sm leading-5">
                        <Image src={urlFor(tag.tagImg).url()} alt={tag.title+" image"} width={22} height={22} className="mr-2 rounded-md" loading="lazy" /> {tag.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={overviewSectionRef} className="relative mb-2 mt-0 basis-full p-3 sm:basis-full md:basis-full lg:basis-1/2">
            <div className="relative h-full basis-full rounded-lg bg-secondary p-6 shadow-sm">
              {/* overview */}
              <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                <PortableText value={data.summary ?? []} />
              </div>
            </div>
          </div>

          <div ref={caseStudyRef} className="relative col-span-4 ml-3 mt-8 flex w-full basis-full items-center py-2">
            <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
            <h2 className="flex text-2xl font-bold md:text-3xl">Case Study</h2>
          </div>

          <div className="mt-3 flex basis-full flex-wrap p-3">
            <Card ref={caseStudyContentRef} className="h-full w-full rounded-lg bg-secondary p-1" >
              <CardContent className="max-w-5xl p-4">
                <div className="prose prose-lg prose-blue max-w-none text-base dark:prose-invert prose-a:text-primary prose-li:marker:text-primary md:text-lg">
                  <PortableText value={data.content ?? []} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div ref={screenshotsRef} className="relative col-span-4 mb-4 ml-3 mt-6 flex w-full basis-full items-center py-2">
            <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
            <h2 className="flex text-xl font-bold md:text-3xl">Screenshots</h2>
          </div>

          <div className="basis-full md:p-5 lg:p-6">
            <ProjectGallery gallery={data.gallery ?? []} />
          </div>

          <div ref={linksSectionRef} className="relative col-span-4 mb-4 ml-3 mt-6 flex w-full basis-full items-center py-2">
            <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
            <h2 className="flex text-xl font-bold md:text-3xl">Links</h2>
          </div>

          <div className="mb-8 basis-full p-3">
            <Table className="relative h-full break-words rounded-lg bg-secondary">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody ref={linksTableRef}>
                {(data.links ?? []).map((link, idx) =>(
                <TableRow key={idx}>
                  <TableCell className="font-medium" >{link.title}</TableCell>
                  <TableCell>{link.description}</TableCell>
                  <TableCell className="inline-flex break-words">
                    <Button asChild variant="link" className="break-words" enableRipple>
                      <Link href={link.url} rel="noopener noreferrer" target="_blank">
                        <span className="hidden sm:hidden lg:block">{link.url}</span>
                        <ArrowUpRightFromSquare className="ml-2" size={16}/></Link>
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
