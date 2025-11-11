'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { fadeUp } from '@/app/lib/animations';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
});

const data = {
  labels: ['Coding', 'Designing', 'Problem-solving', 'Communication', 'New skills'],
  datasets: [
    {
      label: 'Last Month',
      data: [80, 100, 80, 30, 70],
      fill: true,
      backgroundColor: 'rgba(152, 152, 152, 0.2)',
      borderColor: 'rgb(152, 152, 152)',
      pointBackgroundColor: 'rgb(152, 152, 152)',
      pointBorderColor: '#eaeaea',
      pointHoverBackgroundColor: '#eaeaea',
      pointHoverBorderColor: 'rgb(152, 152, 152)',
      borderWidth: 2,
    },
    {
      label: 'This Month',
      data: [90, 70, 80, 70, 100],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#eaeaea',
      pointHoverBackgroundColor: '#eaeaea',
      pointHoverBorderColor: 'rgb(54, 162, 235)',
      borderWidth: 2,
    },
  ],
};

// Get site's font family from computed styles
const getSiteFontFamily = () => {
  if (typeof window === 'undefined') return 'Inter, sans-serif';
  const body = document.body;
  const computedStyle = window.getComputedStyle(body);
  return computedStyle.fontFamily || 'Inter, sans-serif';
};

// Get theme colors from CSS variables
const getThemeColor = (varName: string) => {
  if (typeof window === 'undefined') return '';
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(varName).trim();
  return value ? `hsl(${value})` : '';
};

export default function GraphSectionAnimated() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState<string>('Inter, sans-serif');
  const [themeColors, setThemeColors] = useState({
    popover: '',
    popoverForeground: '',
    border: '',
    mutedForeground: '',
    foreground: '',
    isDark: false,
  });

  // Get site's font family and theme colors after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFontFamily(getSiteFontFamily());

      // Get theme colors from CSS variables
      const updateThemeColors = () => {
        const isDark = document.documentElement.classList.contains('dark');
        setThemeColors({
          popover: getThemeColor('--popover'),
          popoverForeground: getThemeColor('--popover-foreground'),
          border: getThemeColor('--border'),
          mutedForeground: getThemeColor('--muted-foreground'),
          foreground: getThemeColor('--foreground'),
          isDark,
        });
      };

      updateThemeColors();

      // Update colors when theme changes (listen for class changes on html element)
      const observer = new MutationObserver(updateThemeColors);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }
  }, []);

  // Create options with site's font family, theme colors, and relative font sizes
  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 15,
            color: themeColors.foreground || (themeColors.isDark ? '#ffffff' : '#000000'),
            font: {
              family: fontFamily,
              size: 12, // 0.75rem relative to base font size
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: themeColors.popover || (themeColors.isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(0, 0, 0, 0.8)'),
          titleColor: themeColors.popoverForeground || (themeColors.isDark ? '#ffffff' : '#000000'),
          bodyColor: themeColors.mutedForeground || (themeColors.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
          borderColor: themeColors.border || (themeColors.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'),
          borderWidth: 1,
          padding: 12,
          titleFont: {
            family: fontFamily,
            size: 14,
            weight: 'normal' as const,
          },
          bodyFont: {
            family: fontFamily,
            size: 13,
          },
          displayColors: true,
          boxPadding: 6,
          borderRadius: 8,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100,
          // Hide the scale numbers/ticks
          ticks: {
            display: false, // Hide tick labels (numbers)
            stepSize: 20,
          },
          // Grid lines - theme-aware
          grid: {
            color: themeColors.isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
          },
          // Point labels (category labels) - theme-aware
          pointLabels: {
            display: true, // Keep category labels (Coding, Designing, etc.)
            color: themeColors.foreground || (themeColors.isDark ? '#ffffff' : '#000000'),
            font: {
              family: fontFamily,
              size: 12, // 0.75rem relative to base font size
              weight: 'normal' as const,
            },
          },
        },
      },
    };
  }, [fontFamily, themeColors]);

  useEffect(() => {
    if (graphRef.current) {
      fadeUp(graphRef.current, {
        duration: 0.8,
        distance: 30,
        scrollTrigger: {
          trigger: graphRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, []);

  return (
    <div ref={graphRef} className="mb-2 basis-full flex-col" style={{ opacity: 0 }}>
      <Radar
        data={data}
        options={options}
        className="h-80 max-h-80 w-full max-w-full invert filter-none dark:hue-rotate-180"
      />
    </div>
  );
}
