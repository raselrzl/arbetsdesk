"use client";

import { useMemo } from "react";

type DailyTip = {
  date: string;
  totalTip: number;
  employees: {
    id: string;
    name: string;
    hours: number;
    loggedOutTime?: string;
  }[];
};

export function MonthlyTipPivotTable({
  dailyTips,
}: {
  dailyTips: DailyTip[];
}) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const { dates, employees } = useMemo(() => {
    const dateSet = new Set<string>();
    const empMap: Record<
      string,
      {
        name: string;
        days: Record<string, { hours: number; tip: number }>;
      }
    > = {};

    for (const day of dailyTips) {
      dateSet.add(day.date);

      const finished = day.employees.filter(
        (e) => e.loggedOutTime && e.hours > 0
      );

      const totalHours = finished.reduce((a, e) => a + e.hours, 0);
      if (!totalHours) continue;

      const tipPerHour = day.totalTip / totalHours;

      for (const emp of finished) {
        if (!empMap[emp.id]) {
          empMap[emp.id] = { name: emp.name, days: {} };
        }

        empMap[emp.id].days[day.date] = {
          hours: emp.hours,
          tip: emp.hours * tipPerHour,
        };
      }
    }

    return {
      dates: Array.from(dateSet).sort(),
      employees: empMap,
    };
  }, [dailyTips]);

  if (!dates.length) return null;

  return (
    <div className="bg-[#00687a] rounded-xs shadow-lg p-5 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-white tracking-wide uppercase">
        Monthly Tips – Daily Breakdown
      </h2>

      <table className="border-separate border-spacing-0 min-w-max w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-20 bg-[#005665] p-3 border-b border-white/20 text-left font-semibold text-white">
              Employee
            </th>

            {dates.map((d) => {
              const dateObj = new Date(d);
              const dayName = weekDays[dateObj.getDay()];
              const dayNum = d.slice(-2);

              return (
                <th
                  key={d}
                  className="p-3 border-b border-white/20 text-center text-teal-100 font-medium"
                >
                  <div className="leading-tight">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      {dayName}
                    </div>
                    <div className="text-sm">{dayNum}</div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {Object.entries(employees).map(([id, emp]) => (
            <tr
              key={id}
              className="hover:bg-white/5 transition-colors"
            >
              {/* Employee name */}
              <td className="sticky left-0 z-10 bg-[#00687a] p-3 border-b border-white/10 font-medium text-white whitespace-nowrap">
                {emp.name}
              </td>

              {dates.map((date) => {
                const cell = emp.days[date];

                return (
                  <td
                    key={date}
                    className="p-2 border-b border-white/10 text-center"
                  >
                    {cell ? (
                      <div className="bg-[#005665] border border-white/10 rounded-md px-2 py-1 text-xs text-teal-50 space-y-0.5">
                        <div className="flex justify-between opacity-90">
                          <span>Hours</span>
                          <span>{cell.hours.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-emerald-300">
                          <span>Tips</span>
                          <span>{cell.tip.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-teal-200/40">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
