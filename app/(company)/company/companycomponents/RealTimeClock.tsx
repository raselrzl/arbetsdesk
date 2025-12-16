"use client";

import { useState, useEffect } from "react";
import { Clock10 } from "lucide-react";

export default function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // set initial time on mount
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null; // render nothing on server

  return (
    <div className="flex items-center gap-2 text-teal-600 font-semibold">
      <Clock10 className="w-5 h-5" />
      <span>
        {currentTime.toLocaleTimeString("en-US", { hour12: false })} |{" "}
        {currentTime.toLocaleDateString("en-US")}
      </span>
    </div>
  );
}
