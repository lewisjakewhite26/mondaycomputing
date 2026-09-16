import { useEffect, useState } from 'react';

function formatTime(d: Date): string {
  let h = d.getHours() % 12;
  if (h === 0) h = 12;
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** Live clock, iOS status-bar style ("9:41", no AM/PM), refreshed every 15s. */
export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(new Date())), 15000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
