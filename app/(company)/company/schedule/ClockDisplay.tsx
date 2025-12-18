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
    <div className="text-teal-600 font-semibold text-lg mb-4">
      Current Time: {time.toLocaleTimeString("en-US", { hour12: false })} |{" "}
      {time.toLocaleDateString()}
    </div>
  );
}
