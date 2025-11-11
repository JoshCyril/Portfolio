'use client';

import { useEffect, useRef } from 'react';
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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
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
      // Hide grid lines or make them subtle
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        lineWidth: 1,
      },
      // Hide point labels (the numbers on axes)
      pointLabels: {
        display: true, // Keep category labels (Coding, Designing, etc.)
        font: {
          size: 12,
          weight: 'bold' as const,
        },
      },
    },
  },
};

export default function GraphSectionAnimated() {
  const graphRef = useRef<HTMLDivElement>(null);

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
