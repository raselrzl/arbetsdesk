"use client";

import { useState } from "react";

/* ---------------- HELPERS ---------------- */
function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // Local time YYYY-MM-DD
}

function formatTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

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

function getWeekNumber(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/* ---------------- COMPONENT ---------------- */
type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
};

export default function WeeklyScheduleTable({ schedules, employees }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const { start, end } = getWeekRange(weekOffset);
  const weekNumber = getWeekNumber(start);

  // Filter schedules for this week
  const weekSchedules = schedules.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  // Build week days array (Mon–Sun)
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  // Group schedules by day
  const schedulesByDay: Record<string, any[]> = {};
  daysOfWeek.forEach((d) => {
    schedulesByDay[formatDate(d)] = [];
  });

  weekSchedules.forEach((sch) => {
    const key = formatDate(sch.date);
    if (schedulesByDay[key]) {
      schedulesByDay[key].push(sch);
    }
  });

  return (
    <div className="space-y-3">
      {/* WEEK FILTER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-teal-950 px-2 py-1 uppercase">
          Week {weekNumber} · {formatDate(start)} – {formatDate(end)}
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
        <table className="w-full border-collapse text-sm min-w-max">
          <thead>
            <tr className="bg-teal-100">
              <th className="p-3 border text-left sticky left-0 bg-teal-100 z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                Schedule
              </th>

              {daysOfWeek.map((day) => (
                <th key={formatDate(day)} className="p-3 border text-center w-28">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                  <p className="text-xs text-gray-600">{formatDate(day)}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td
                  className="p-3 border font-medium sticky left-0 bg-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis"
                  title={emp.name}
                >
                  {emp.name}
                </td>

                {daysOfWeek.map((day) => {
                  const dayKey = formatDate(day);
                  const empSchedules =
                    schedulesByDay[dayKey]?.filter((s) => s.employee.id === emp.id) || [];

                  return (
                    <td key={dayKey} className="p-3 border text-xs text-center w-28">
                      {empSchedules.length === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        empSchedules.map((sch) => (
                          <div key={sch.id}>
                            {formatTime(sch.startTime)} – {formatTime(sch.endTime)}
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
