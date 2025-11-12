'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/app/lib/animations';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const imageRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Animate modal content on open/close
  React.useEffect(() => {
    if (!contentRef.current || prefersReducedMotion()) return;

    if (isOpen) {
      // Animate in
      gsap.fromTo(
        contentRef.current,
        {
          scale: 0.9,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }
      );

      // Animate image container
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 0.95,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: 0.1,
            ease: 'power2.out',
          }
        );
      }
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 sm:p-2 border-0 bg-transparent shadow-none focus:outline-none [&>button]:hidden"
        // Hide default close button and use custom one
        // Radix Dialog automatically handles ESC and click outside via onOpenChange
      >
        <div ref={contentRef} className="relative w-full h-full flex items-center justify-center min-h-[200px]">
          {/* Custom Close button - positioned absolutely */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -top-2 -right-2 z-50 bg-background/95 backdrop-blur-sm hover:bg-background border-2 shadow-xl rounded-full h-9 w-9 sm:h-10 sm:w-10"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
            enableRipple
            enableMagnetic
            magneticStrength={0.15}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Image container */}
          <div
            ref={imageRef}
            className="relative max-w-full max-h-[90vh] w-auto h-auto flex items-center justify-center"
          >
            <div className="relative max-w-full max-h-[90vh] w-auto h-auto rounded-lg overflow-hidden bg-background/30 p-1 sm:p-2">
              <Image
                src={imageUrl}
                alt={alt}
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                priority
                quality={95}
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
