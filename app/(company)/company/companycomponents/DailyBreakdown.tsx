"use client";

import { useEffect, useState } from "react";

interface DailyBreakdownProps {
  companyId: string;
}

export default function DailyBreakdown({ companyId }: DailyBreakdownProps) {
  const [dailyMinutes, setDailyMinutes] = useState<number[]>([0,0,0,0,0,0,0]);

  const fetchDaily = async () => {
    try {
      const res = await fetch(`/api/daily-worked/${companyId}`);
      const data = await res.json();
      setDailyMinutes(data);
    } catch (err) {
      console.error("Failed to fetch daily minutes:", err);
    }
  };

  useEffect(() => {
    fetchDaily();
    const interval = setInterval(fetchDaily, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [companyId]);

  const max = Math.max(...dailyMinutes, 60); // for scaling bar height

  return (
    <div className="flex gap-2 items-end h-32 p-2 bg-white rounded shadow">
      {dailyMinutes.map((minutes, i) => {
        const height = (minutes / max) * 100;
        const label = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i];
        return (
          <div key={i} className="flex flex-col items-center w-6">
            <div
              className="bg-teal-500 w-full transition-all"
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-xs mt-1">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
