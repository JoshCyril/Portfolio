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
  return value;
};

// Convert HSL string to RGB for Chart.js (which needs rgba)
const hslToRgba = (hsl: string, alpha: number = 1): string => {
  if (!hsl) return `rgba(128, 128, 128, ${alpha})`;

  // Parse HSL string like "206 100% 49%" or "217.2 32.6% 17.5%"
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return `rgba(128, 128, 128, ${alpha})`;

  // Parse values, removing % signs if present
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1].replace('%', '')) / 100;
  const l = parseFloat(parts[2].replace('%', '')) / 100;

  // Validate parsed values
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return `rgba(128, 128, 128, ${alpha})`;
  }

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    primary: '',
    muted: '',
    secondary: '',
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
          primary: getThemeColor('--primary'),
          muted: getThemeColor('--muted'),
          secondary: getThemeColor('--secondary'),
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

  // Create chart data with theme-aware colors
  const chartData = useMemo(() => {
    // Get colors for the datasets
    const primaryColor = themeColors.primary || '206 100% 49%';
    // For "Last Month", use a more visible but subdued color
    // In dark mode, use a lighter gray; in light mode, use muted-foreground
    const lastMonthColor = themeColors.isDark
      ? (themeColors.mutedForeground || '215 20.2% 65.1%') // Light gray for dark mode
      : (themeColors.mutedForeground || '215.4 16.3% 46.9%'); // Muted-foreground for light mode
    const foregroundColor = themeColors.foreground || (themeColors.isDark ? '210 40% 98%' : '222.2 84% 4.9%');
    const borderColor = themeColors.border || (themeColors.isDark ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');

    // Convert to rgba for Chart.js
    const primaryRgba = hslToRgba(primaryColor, 1);
    const primaryRgbaAlpha = hslToRgba(primaryColor, themeColors.isDark ? 0.3 : 0.2);
    const lastMonthRgba = hslToRgba(lastMonthColor, 1);
    const lastMonthRgbaAlpha = hslToRgba(lastMonthColor, themeColors.isDark ? 0.25 : 0.3);
    const foregroundRgba = hslToRgba(foregroundColor, 1);
    const borderRgba = hslToRgba(borderColor, 1);

    return {
      labels: ['Coding', 'Designing', 'Problem-solving', 'Communication', 'New skills'],
      datasets: [
        {
          label: 'Last Month',
          data: [80, 100, 80, 30, 70],
          fill: true,
          backgroundColor: lastMonthRgbaAlpha,
          borderColor: lastMonthRgba,
          pointBackgroundColor: lastMonthRgba,
          pointBorderColor: borderRgba,
          pointHoverBackgroundColor: foregroundRgba,
          pointHoverBorderColor: lastMonthRgba,
          borderWidth: 2,
        },
        {
          label: 'This Month',
          data: [90, 70, 80, 70, 100],
          fill: true,
          backgroundColor: primaryRgbaAlpha,
          borderColor: primaryRgba,
          pointBackgroundColor: primaryRgba,
          pointBorderColor: borderRgba,
          pointHoverBackgroundColor: foregroundRgba,
          pointHoverBorderColor: primaryRgba,
          borderWidth: 2,
        },
      ],
    };
  }, [themeColors]);

  // Create options with site's font family, theme colors, and relative font sizes
  const options = useMemo(() => {
    const foregroundColor = themeColors.foreground || (themeColors.isDark ? '210 40% 98%' : '222.2 84% 4.9%');
    const borderColor = themeColors.border || (themeColors.isDark ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');
    const popoverColor = themeColors.popover || (themeColors.isDark ? '240 11% 20%' : '198 8% 87%');
    const popoverForegroundColor = themeColors.popoverForeground || (themeColors.isDark ? '210 40% 98%' : '222.2 84% 4.9%');
    const mutedForegroundColor = themeColors.mutedForeground || (themeColors.isDark ? '215 20.2% 65.1%' : '215.4 16.3% 46.9%');

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
            color: hslToRgba(foregroundColor, 1),
            font: {
              family: fontFamily,
              size: 12, // 0.75rem relative to base font size
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: hslToRgba(popoverColor, 0.95),
          titleColor: hslToRgba(popoverForegroundColor, 1),
          bodyColor: hslToRgba(mutedForegroundColor, 1),
          borderColor: hslToRgba(borderColor, 1),
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
            color: hslToRgba(borderColor, 0.3),
            lineWidth: 1,
          },
          // Point labels (category labels) - theme-aware
          pointLabels: {
            display: true, // Keep category labels (Coding, Designing, etc.)
            color: hslToRgba(foregroundColor, 1),
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
        data={chartData}
        options={options}
        className="h-80 max-h-80 w-full max-w-full"
      />
    </div>
  );
}
