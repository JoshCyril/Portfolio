'use client'

export default function TimeCal() {
    const date = new Date();
    const showTime = date.getHours() 
        + ':' + date.getMinutes() 
  return (showTime);
}
