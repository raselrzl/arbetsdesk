"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function RealTimeClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex items-center gap-2 text-teal-600 font-semibold text-lg">
      <Clock className="w-5 h-5" />
      <span>
        {now.toLocaleTimeString("en-US", { hour12: false })} |{" "}
        {now.toLocaleDateString()}
      </span>
    </div>
  );
}
