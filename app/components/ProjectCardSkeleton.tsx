'use client';

import { cn } from '@/lib/utils';

interface ProjectCardSkeletonProps {
  className?: string;
}

export function ProjectCardSkeleton({ className }: ProjectCardSkeletonProps) {
  return (
    <div className={cn('basis-full p-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4', className)}>
      <div className="rounded-lg border border-border/40 bg-background/80 p-4 shadow-sm">
        <div className="h-40 w-full rounded-lg bg-muted/40 animate-pulse" />

        <div className="mt-6 space-y-3">
          <div className="h-5 w-3/4 rounded-full bg-muted/50 animate-pulse" />
          <div className="h-4 w-full rounded-full bg-muted/40 animate-pulse" />
          <div className="h-4 w-5/6 rounded-full bg-muted/30 animate-pulse" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-10 rounded-md bg-muted/40 animate-pulse" />
          <div className="h-10 rounded-md bg-muted/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
