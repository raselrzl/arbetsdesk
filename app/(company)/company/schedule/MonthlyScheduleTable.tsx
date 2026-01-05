"use client";

import { useState } from "react";

type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
};

/* -------- HELPERS -------- */

function diffHours(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / 36e5;
}

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/* -------- COMPONENT -------- */

export default function MonthlyScheduleTable({ schedules, employees }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { start, end } = getMonthRange(monthOffset);

  /* Days in month */
  const daysInMonth = Array.from(
    { length: end.getDate() },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1)
  );

  /* Filter month schedules */
  const monthSchedules = schedules.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  /* Group schedules by day */
  const schedulesByDay: Record<string, any[]> = {};
  daysInMonth.forEach((d) => {
    schedulesByDay[d.toDateString()] = [];
  });

  monthSchedules.forEach((sch) => {
    const key = new Date(sch.date).toDateString();
    if (schedulesByDay[key]) {
      schedulesByDay[key].push(sch);
    }
  });

  return (
    <div className="space-y-3 mt-10">
      {/* MONTH FILTER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-teal-950 px-2 py-1 uppercase">
          {start.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>

          <button
            onClick={() => setMonthOffset(0)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Current
          </button>

          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border-collapse text-xs">
          <thead>
            <tr className="bg-teal-100">
              {/* Employee column fixed width */}
              <th className="p-2 border text-left sticky left-0 bg-teal-100 z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                Employee
              </th>

              {daysInMonth.map((day) => (
                <th
                  key={day.toDateString()}
                  className="p-2 border text-center min-w-[60px]"
                >
                  {day.getDate()}
                  <p className="text-[10px] text-gray-600">
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </p>
                </th>
              ))}

              <th className="p-2 border text-center bg-teal-100 w-20">
                Total (h)
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const totalHours = monthSchedules
                .filter((s) => s.employee.id === emp.id)
                .reduce((sum, s) => sum + diffHours(s.startTime, s.endTime), 0);

              return (
                <tr key={emp.id} className="border-t">
                  <td className="p-2 border font-medium sticky left-0 bg-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                    {emp.name}
                  </td>

                  {daysInMonth.map((day) => {
                    const dayKey = day.toDateString();
                    const empSchedules =
                      schedulesByDay[dayKey]?.filter(
                        (s) => s.employee.id === emp.id
                      ) || [];

                    return (
                      <td
                        key={dayKey}
                        className="p-2 border text-center min-w-[60px]"
                      >
                        {empSchedules.length === 0 ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          empSchedules.map((sch) => (
                            <div key={sch.id} className="whitespace-nowrap">
                              {new Date(sch.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                              –
                              {new Date(sch.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}

                  <td className="p-2 border text-center font-semibold bg-gray-50 w-20">
                    {totalHours.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
