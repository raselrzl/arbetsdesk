"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { getEmployeeMonthlySchedule } from "../employeeactions";

type DailySchedule = {
  date: string;        // YYYY-MM-DD
  startTime: string;   // ISO string
  endTime: string;     // ISO string
  hours: number;
};

export default function MySchedulePage() {
  const [month, setMonth] = useState("2025-12");
  const [scheduleData, setScheduleData] = useState<DailySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SCHEDULE ---------------- */
  useEffect(() => {
    setLoading(true);
    getEmployeeMonthlySchedule(month)
      .then(setScheduleData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month]);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const daysInMonth = new Date(
    Number(month.split("-")[0]),
    Number(month.split("-")[1]),
    0
  ).getDate();

  /* ---------------- TOTAL HOURS ---------------- */
  const totalHours = useMemo(
    () => scheduleData.reduce((acc, s) => acc + s.hours, 0),
    [scheduleData]
  );

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Schedule</h1>
      <p className="text-gray-600">
        View your work schedule for the selected month.
      </p>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-600" />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">
          Calendar ({month})
        </h2>

        {loading && (
          <p className="text-sm text-gray-400">Loading schedule...</p>
        )}

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = (i + 1).toString().padStart(2, "0");
            const dateKey = `${month}-${day}`;

            // ✅ MULTIPLE schedules per day
            const daySchedules = scheduleData.filter(
              (s) => s.date === dateKey
            );

            const dayTotalHours = daySchedules.reduce(
              (acc, s) => acc + s.hours,
              0
            );

            return (
              <div
                key={dateKey}
                className={`min-h-28 border rounded p-2 flex flex-col items-center gap-1
                  ${
                    daySchedules.length
                      ? "bg-teal-50"
                      : "bg-gray-50"
                  }`}
              >
                <span className="font-semibold">{day}</span>

                {daySchedules.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-1 w-full">
                      {daySchedules.map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded px-1 py-0.5 text-center text-xs text-teal-700"
                        >
                          <div>
                            {formatTime(s.startTime)} –{" "}
                            {formatTime(s.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-teal-800 mt-auto">
                      <Clock className="w-3 h-3" />
                      {dayTotalHours.toFixed(1)}h
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm mt-auto">
                    Off
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Hours */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-teal-600" />
        <span className="font-semibold">
          Total Hours This Month: {totalHours.toFixed(1)}h
        </span>
      </div>
    </div>
  );
}
