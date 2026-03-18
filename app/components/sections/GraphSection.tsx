"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';


const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
});

const data = {
    labels: [
      'Coding',
      'Designing',
      'Problem-solving',
      'Communication',
      'New skills'
    ],
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
      pointHoverBorderColor: 'rgb(152, 152, 152)'
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
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }
  ]
  };


export default function  GraphSection()  {
    return (
        <div className="mb-2 basis-full flex-col">
          <Radar data={data} className='h-80 max-h-80 w-full max-w-full invert filter-none dark:hue-rotate-180' />
        </div>
      );
}
