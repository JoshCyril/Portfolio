'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { fadeUp } from '@/app/lib/animations';
import { Copyright } from 'lucide-react';
import { FooterData } from '@/app/lib/interface';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

interface FooterAnimatedProps {
  data: FooterData;
}

export default function FooterAnimated({ data }: FooterAnimatedProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const timeAgo = useMemo(() => new TimeAgo('en-US'), []);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeZone: 'UTC',
      }),
    []
  );
  const absoluteUpdateLabel = useMemo(() => {
    if (!data?.udDate) return 'recently';

    try {
      const date = typeof data.udDate === 'string' ? new Date(data.udDate) : data.udDate;
      if (isNaN(date.getTime())) {
        return 'recently';
      }

      return dateFormatter.format(date);
    } catch {
      return 'recently';
    }
  }, [data?.udDate, dateFormatter]);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(absoluteUpdateLabel);

  useEffect(() => {
    if (footerRef.current) {
      fadeUp(footerRef.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, []);

  useEffect(() => {
    setLastUpdatedLabel(absoluteUpdateLabel);
  }, [absoluteUpdateLabel]);

  useEffect(() => {
    if (!data?.udDate) return;

    try {
      const parsedDate = typeof data.udDate === 'string' ? new Date(data.udDate) : data.udDate;
      if (isNaN(parsedDate.getTime())) {
        return;
      }

      const updateRelativeLabel = () => {
        setLastUpdatedLabel(timeAgo.format(parsedDate));
      };

      updateRelativeLabel();
      const intervalId = window.setInterval(updateRelativeLabel, 60000);

      return () => window.clearInterval(intervalId);
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }, [data?.udDate, timeAgo]);

  return (
    <div ref={footerRef} className="relative grid h-fit place-items-center" style={{ opacity: 0 }}>
      <div className="sticky bottom-0 left-0 z-10 w-11/12 max-w-screen-2xl">
        <div className="flex h-20 w-full flex-wrap items-center justify-around gap-4 rounded-t-xl bg-background bg-gradient-to-r from-primary/10 to-primary/20 p-4 text-base md:flex-col">
          <div className="font-regular flex items-center gap-1 text-sm font-bold tracking-wide">
            <Copyright size={16} />
            {data?.copyright || '© 2024'}
          </div>

          <div className="font-regular text-sm font-semibold">
            Updated:{' '}
            <span className="font-normal" suppressHydrationWarning>
              {lastUpdatedLabel}
            </span>
          </div>
        </div>
        <div className="h-24 w-full bg-background bg-gradient-to-r from-primary/10 to-primary/20 sm:h-24 md:h-0"></div>
      </div>
    </div>
  );
}
