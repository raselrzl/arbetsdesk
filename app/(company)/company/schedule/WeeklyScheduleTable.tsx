"use client";

import { useState } from "react";
import { updateSchedule, updateScheduleTime } from "./schedules";

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

export default function WeeklyScheduleTable({
  schedules,
  employees,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const { start, end } = getWeekRange(weekOffset);
  const weekNumber = getWeekNumber(start);

  const [selectedSchedule, setSelectedSchedule] = useState<null | {
    employee: { id: string; name: string };
    schedule: any;
  }>(null);

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

  function getEmployeeColor(employeeId: string) {
    let hash = 0;
    for (let i = 0; i < employeeId.length; i++) {
      hash = employeeId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % EMPLOYEE_COLORS.length;
    return EMPLOYEE_COLORS[index];
  }

  function getEmployeeColorClasses(employeeId: string) {
    const full = getEmployeeColor(employeeId);
    const bg = full.match(/bg-\S+/)?.[0] ?? "bg-gray-100";
    const border = full.match(/border-\S+/)?.[0] ?? "border-gray-400";
    const text = border.replace("border", "text");
    return { bg, border, text };
  }

  /* ---------------- POPUP TIME EDIT HELPERS ---------------- */
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  const [editStartHour, setEditStartHour] = useState("00");
  const [editStartMinute, setEditStartMinute] = useState("00");
  const [editEndHour, setEditEndHour] = useState("00");
  const [editEndMinute, setEditEndMinute] = useState("00");
  const [isUpdating, setIsUpdating] = useState(false);

  const openPopup = (emp: { id: string; name: string }, sch: any) => {
    setSelectedSchedule({ employee: emp, schedule: sch });
    const startDate = new Date(sch.startTime);
    const endDate = new Date(sch.endTime);
    setEditStartHour(startDate.getHours().toString().padStart(2, "0"));
    setEditStartMinute(startDate.getMinutes().toString().padStart(2, "0"));
    setEditEndHour(endDate.getHours().toString().padStart(2, "0"));
    setEditEndMinute(endDate.getMinutes().toString().padStart(2, "0"));
  };

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) return;
    setIsUpdating(true);
    try {
      await updateScheduleTime({
        scheduleId: selectedSchedule.schedule.id,
        startTime: `${editStartHour}:${editStartMinute}`,
        endTime: `${editEndHour}:${editEndMinute}`,
      });
      setSelectedSchedule(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update schedule.");
    } finally {
      setIsUpdating(false);
    }
  };

  /* ---------------- RENDER ---------------- */
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
                {daysOfWeek.map((day) => {
                  const dayKey = formatDate(day);
                  const empSchedules =
                    schedulesByDay[dayKey]?.filter(
                      (s) => s.employee.id === emp.id
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
                          const { bg, border, text } =
                            getEmployeeColorClasses(emp.id);

                          return (
                            <div
                              key={sch.id}
                              onClick={() => openPopup(emp, sch)}
                              className={`mb-1 rounded px-2 py-3 border-l-6 text-left cursor-pointer ${colorClass}`}
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

      {/* POPUP */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className={`rounded px-4 py-3 border-l-6 ${
              getEmployeeColorClasses(selectedSchedule.employee.id).bg
            } ${
              getEmployeeColorClasses(selectedSchedule.employee.id).border
            } w-80 relative`}
          >
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedSchedule(null)}
            >
              ✕
            </button>

            <h2
              className={`font-semibold text-[18px] truncate mb-2 ${
                getEmployeeColorClasses(selectedSchedule.employee.id).text
              }`}
            >
              {selectedSchedule.employee.name}
            </h2>

            <p
              className={`text-[10px] mb-2 ${
                getEmployeeColorClasses(selectedSchedule.employee.id).text
              }`}
            >
              Date: {formatDate(selectedSchedule.schedule.date)}
            </p>

            {/* Editable Time */}
            <div className="flex gap-2 text-[10px] mb-2 items-center">
              <span
                className={
                  getEmployeeColorClasses(selectedSchedule.employee.id).text
                }
              >
                Start:
              </span>
              <select
                value={editStartHour}
                onChange={(e) => setEditStartHour(e.target.value)}
                className="border rounded-xs px-1 py-0.5 text-[10px]"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              :
              <select
                value={editStartMinute}
                onChange={(e) => setEditStartMinute(e.target.value)}
                className="border rounded-xs px-1 py-0.5 text-[10px]"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <span
                className={
                  getEmployeeColorClasses(selectedSchedule.employee.id).text
                }
              >
                End:
              </span>
              <select
                value={editEndHour}
                onChange={(e) => setEditEndHour(e.target.value)}
                className="border rounded-xs px-1 py-0.5 text-[10px]"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              :
              <select
                value={editEndMinute}
                onChange={(e) => setEditEndMinute(e.target.value)}
                className="border rounded-xs px-1 py-0.5 text-[10px]"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {selectedSchedule.schedule.details && (
              <p
                className={`text-[10px] mb-2 ${
                  getEmployeeColorClasses(selectedSchedule.employee.id).text
                }`}
              >
                Details: {selectedSchedule.schedule.details}
              </p>
            )}

            <button
              onClick={handleUpdateSchedule}
              disabled={isUpdating}
              className={`mt-2 w-full px-3 py-1 rounded-xs ${
                isUpdating
                  ? "bg-gray-400 cursor-not-allowed"
                  : `bg-[#02505e] hover:bg-teal-900 text-gray-100`
              }`}
            >
              {isUpdating ? "Updating..." : "Update Schedule"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
