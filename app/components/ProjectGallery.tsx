'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ImageModal } from './ImageModal';
import { urlFor } from '@/app/lib/sanity';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';
import { ProjectGalleryImage } from '@/app/lib/interface';

interface ProjectGalleryProps {
  gallery: ProjectGalleryImage[];
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<{
    url: string;
    alt: string;
  } | null>(null);
  const imageRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  // Animate images on mount
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const images = Array.from(imageRefs.current.values());
    if (images.length === 0) return;

    gsap.fromTo(
      images,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, [gallery]);

  const handleImageClick = (asset: ProjectGalleryImage['asset'] | undefined, index: number) => {
    if (!asset) return;
    const imageUrl = urlFor(asset).url();
    setSelectedImage({
      url: imageUrl,
      alt: `Screenshot ${index + 1}`,
    });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const validGallery = Array.isArray(gallery)
    ? gallery.filter((item): item is ProjectGalleryImage => Boolean(item?.asset))
    : [];

  if (validGallery.length === 0) {
    return null;
  }

  return (
    <>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {validGallery.map((gall, idx) => (
            <CarouselItem
              key={idx}
              className="basis-full sm:basis-1/2 md:basis-1/3 md:p-2 lg:basis-1/4 lg:p-3"
            >
              <div className="p-1">
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50"
                  onClick={() => handleImageClick(gall.asset, idx)}
                  ref={(node) => {
                    if (node) {
                      imageRefs.current.set(idx, node);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick(gall.asset, idx);
                    }
                  }}
                  aria-label={`View screenshot ${idx + 1} in full size`}
                >
                  <CardContent className="overflow-hidden rounded-xl p-0 relative">
                    <Image
                      className="h-full w-full bg-cover bg-center transition-opacity duration-300 group-hover:opacity-90"
                      src={urlFor(gall.asset).url()}
                      alt={`Screenshot ${idx + 1}`}
                      width={1000}
                      height={1000}
                      loading="lazy"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-xl" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-5">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
        />
      )}
    </>
  );
}
