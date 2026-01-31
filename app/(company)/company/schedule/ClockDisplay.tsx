"use client";

import { useEffect, useState } from "react";

export default function ClockDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Mark as mounted and set initial time
    setTime(new Date());

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Don't render anything on the server

  return (
    <div className="flex justify-between max-w-7xl px-3 py-1.5 
                    bg-teal-900
                    rounded-xs text-lg text-neutral-200 font-extrabold">
      <span className="font-mono tabular-nums">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </span>

      <span className="text-neutral-400">
        {time.toLocaleDateString()}
      </span>
    </div>
  );
}
