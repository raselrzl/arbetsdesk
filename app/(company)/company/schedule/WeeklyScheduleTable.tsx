"use client";

import { useState } from "react";

type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
};

/* ---------------- HELPERS ---------------- */

function getWeekRange(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday + offset * 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/* ---------------- COMPONENT ---------------- */

export default function WeeklyScheduleTable({
  schedules,
  employees,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { start, end } = getWeekRange(weekOffset);

  /* Filter selected week only */
  const weekSchedules = schedules.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  /* Build week days (Mon–Sun) */
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  /* Group schedules by day */
  const schedulesByDay: Record<string, any[]> = {};
  daysOfWeek.forEach((d) => {
    schedulesByDay[d.toDateString()] = [];
  });

  weekSchedules.forEach((sch) => {
    const key = new Date(sch.date).toDateString();
    if (schedulesByDay[key]) {
      schedulesByDay[key].push(sch);
    }
  });

  function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
const weekNumber = getWeekNumber(start);


  return (
    <div className="space-y-3">
      {/* WEEK FILTER */}
      <div className="flex items-center justify-between">
        {/* <div className="font-semibold text-teal-700">
          Week of{" "}
          {start.toLocaleDateString()} – {end.toLocaleDateString()}
        </div> */}
        <div className="font-semibold text-teal-700">
  Week {weekNumber} · {start.toLocaleDateString()} – {end.toLocaleDateString()}
</div>


        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Current
          </button>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-100">
              <th className="p-3 border text-left">Schedule</th>
              {daysOfWeek.map((day) => (
                <th
                  key={day.toDateString()}
                  className="p-3 border text-center"
                >
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                  <p className="text-xs text-gray-600">
                    {day.toLocaleDateString()}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-3 border font-medium">
                  {emp.name}
                </td>

                {daysOfWeek.map((day) => {
                  const dayKey = day.toDateString();
                  const empSchedules =
                    schedulesByDay[dayKey]?.filter(
                      (s) => s.employee.id === emp.id
                    ) || [];

                  return (
                    <td key={dayKey} className="p-3 border text-xs">
                      {empSchedules.length === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        empSchedules.map((sch) => (
                          <div key={sch.id}>
                            {new Date(sch.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {new Date(sch.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
