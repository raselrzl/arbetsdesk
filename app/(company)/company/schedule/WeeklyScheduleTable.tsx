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
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
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

  /* ---------------- COLOR HELPERS ---------------- */

  // Tailwind-safe palette (can be extended infinitely)
  const EMPLOYEE_COLORS = [
    "bg-red-100 border-red-400",
    "bg-blue-100 border-blue-400",
    "bg-green-100 border-green-400",
    "bg-yellow-100 border-yellow-400",
    "bg-purple-100 border-purple-400",
    "bg-pink-100 border-pink-400",
    "bg-indigo-100 border-indigo-400",
    "bg-teal-100 border-teal-400",
    "bg-orange-100 border-orange-400",
  ];

  // Deterministic hash → color (unlimited employees)
  function getEmployeeColor(employeeId: string) {
    let hash = 0;
    for (let i = 0; i < employeeId.length; i++) {
      hash = employeeId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % EMPLOYEE_COLORS.length;
    return EMPLOYEE_COLORS[index];
  }

  function getEmployeeColorClasses(employeeId: string) {
    const full = getEmployeeColor(employeeId); // e.g., "bg-red-100 border-red-400"
    const bg = full.match(/bg-\S+/)?.[0] ?? "bg-gray-100";
    const border = full.match(/border-\S+/)?.[0] ?? "border-gray-400";
    const text = border.replace("border", "text"); // "border-red-400" → "text-red-400"
    return { bg, border, text };
  }

  return (
    <div className="space-y-3 mt-20">
      {/* WEEK FILTER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-[#02505e] px-2 py-1 uppercase">
          Week {weekNumber} · {formatDate(start)} – {formatDate(end)}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            Current
          </button>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-max">
          <thead>
            <tr className="bg-[#02505e] text-gray-100">
              {/*   <th className="p-3 border text-left sticky left-0 bg-teal-100 z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                Schedule
              </th> */}

              {daysOfWeek.map((day) => (
                <th
                  key={formatDate(day)}
                  className="p-3 border-teal-800 text-center w-28 uppercase"
                >
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                  <p className="text-xs text-gray-400 uppercase">
                    {formatDate(day)}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t border-teal-100">
                {/* <td
                  className="p-3 border font-medium sticky left-0 bg-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis"
                  title={emp.name}
                >
                  {emp.name}
                </td> */}

                {daysOfWeek.map((day) => {
                  const dayKey = formatDate(day);
                  const empSchedules =
                    schedulesByDay[dayKey]?.filter(
                      (s) => s.employee.id === emp.id,
                    ) || [];

                  return (
                    <td
                      key={dayKey}
                      className="p-2 border border-teal-100 text-xs text-center w-28"
                    >
                      {empSchedules.length === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        empSchedules.map((sch) => {
                          const colorClass = getEmployeeColor(emp.id);
                          const { bg, border, text } = getEmployeeColorClasses(
                            emp.id,
                          );

                          return (
                            <div
                              key={sch.id}
                              className={`mb-1 rounded px-2 py-3 border-l-6 text-left ${colorClass}`}
                            >
                              <div
                                className={`font-semibold text-[18px] truncate ${text}`}
                              >
                                {emp.name}
                              </div>
                              <div className={`text-[10px] ${text}`}>
                                {formatTime(sch.startTime)} –{" "}
                                {formatTime(sch.endTime)}
                              </div>
                            </div>
                          );
                        })
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
