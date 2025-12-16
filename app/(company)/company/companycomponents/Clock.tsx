// app/components/Clock.tsx
"use client";
import { useEffect, useState } from "react";

export default function Clock({ startTime }: { startTime?: string }) {
  const [now, setNow] = useState(new Date());
  const loginTime = startTime ? new Date(startTime) : null;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">
        Current Time: {now.toLocaleTimeString()}
      </p>
      {loginTime && (
        <p className="text-sm text-teal-700">
          Logged In At: {loginTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
