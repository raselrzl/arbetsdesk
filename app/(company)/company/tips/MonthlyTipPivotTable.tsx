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
    <div className="bg-white rounded-xs shadow p-4 border border-teal-100 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">
        Monthly Tips – Daily Breakdown
      </h2>

      <table className="border-collapse min-w-max w-full">
        <thead>
          <tr className="bg-teal-100">
            <th className="sticky left-0 bg-teal-100 p-2 border text-left">
              Employee
            </th>
            {dates.map((d) => (
              <th key={d} className="p-2 border text-center">
                {d.slice(-2)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.entries(employees).map(([id, emp]) => (
            <tr key={id} className="even:bg-teal-50">
              {/* Employee name (sticky) */}
              <td className="sticky left-0 bg-white p-2 border font-semibold">
                {emp.name}
              </td>

              {dates.map((date) => {
                const cell = emp.days[date];

                return (
                  <td key={date} className="p-1 border text-center">
                    {cell ? (
                      <div className="bg-teal-50 border rounded p-1 text-xs leading-tight">
                        <div>
                          <strong>H:</strong>{" "}
                          {cell.hours.toFixed(1)}
                        </div>
                        <div>
                          <strong>T:</strong>{" "}
                          {cell.tip.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
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
