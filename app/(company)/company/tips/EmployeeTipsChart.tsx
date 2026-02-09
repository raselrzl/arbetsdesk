"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

export function EmployeeTipsChart({
  dailyTips,
}: {
  dailyTips: any[];
}) {
  const data = useMemo(() => {
    const acc: Record<string, { name: string; tip: number }> = {};

    for (const day of dailyTips) {
      const finished = day.employees.filter(
        (e: any) => e.loggedOutTime && e.hours > 0
      );

      const totalHours = finished.reduce(
        (a: number, e: any) => a + e.hours,
        0
      );
      if (!totalHours) continue;

      const tipPerHour = day.totalTip / totalHours;

      for (const emp of finished) {
        if (!acc[emp.id]) {
          acc[emp.id] = { name: emp.name, tip: 0 };
        }
        acc[emp.id].tip += emp.hours * tipPerHour;
      }
    }

    return Object.values(acc).sort((a, b) => b.tip - a.tip);
  }, [dailyTips]);

  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xs shadow-lg shadow-[#00687a] p-4 border border-[#00687a]">
      <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#00687a] uppercase">
        Monthly Tips by Employee
      </h2>

      {/* scroll on small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] md:min-w-full">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tip" fill="#00687a" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
