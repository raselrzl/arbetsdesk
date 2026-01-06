"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, List } from "lucide-react";
import {
  getEmployeeMonthlySchedule,
  getEmployeeAvailableMonths,
} from "../employeeactions";

type DailySchedule = {
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  hours: number;
};

type ViewMode = "calendar" | "table";

export default function MySchedulePage() {
  const [month, setMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<DailySchedule[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<DailySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("calendar");

  /* ---------------- AVAILABLE MONTHS ---------------- */
  useEffect(() => {
    async function fetchMonths() {
      const months = await getEmployeeAvailableMonths();
      if (months.length) {
        const sorted = months.sort();
        setAvailableMonths(sorted);
        setMonth(sorted[sorted.length - 1]); // latest month
      }
    }
    fetchMonths();
  }, []);

  /* ---------------- MONTHLY SCHEDULE ---------------- */
  useEffect(() => {
    if (!month) return;
    setLoading(true);
    getEmployeeMonthlySchedule(month)
      .then(setScheduleData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month]);

  /* ---------------- TODAY SCHEDULE (INDEPENDENT) ---------------- */
  useEffect(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    getEmployeeMonthlySchedule(currentMonth)
      .then((data) => {
        setTodaySchedules(data.filter((s) => s.date === todayKey));
      })
      .catch(console.error);
  }, []);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  /* ---------------- GROUP BY DATE ---------------- */
  const schedulesByDate = useMemo(() => {
    return scheduleData.reduce<Record<string, DailySchedule[]>>((acc, s) => {
      acc[s.date] = acc[s.date] || [];
      acc[s.date].push(s);
      return acc;
    }, {});
  }, [scheduleData]);

  /* ---------------- TOTAL HOURS ---------------- */
  const totalHours = useMemo(
    () => scheduleData.reduce((acc, s) => acc + s.hours, 0),
    [scheduleData]
  );

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-4 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold uppercase text-teal-900">
          My Schedule
        </h1>
        <p className="text-sm text-teal-500">Monthly work schedule overview</p>
      </div>

      {/* MONTH + VIEW */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 border border-teal-100">
        <Calendar className="w-5 h-5 text-teal-600" />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-teal-100 p-2"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView("calendar")}
            className={`p-2 border ${view === "calendar" ? "bg-teal-200" : ""}`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`p-2 border ${view === "table" ? "bg-teal-200" : ""}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TODAY BOX */}
      <div
        className={`border p-4 ${
          todaySchedules.length
            ? "bg-amber-100 border-amber-300"
            : "bg-teal-50 border-teal-200"
        }`}
      >
        <div className="font-semibold mb-1">Today ({todayKey})</div>

        {todaySchedules.length ? (
          todaySchedules.map((s, i) => (
            <div key={i} className="text-sm">
              {formatTime(s.startTime)} – {formatTime(s.endTime)}
            </div>
          ))
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </div>

      {loading && <p className="text-gray-400">Loading schedule…</p>}

      {/* CALENDAR VIEW */}
      {!loading && view === "calendar" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = (i + 1).toString().padStart(2, "0");
            const dateKey = `${month}-${day}`;
            const daySchedules = schedulesByDate[dateKey] || [];

            return (
              <div
                key={dateKey}
                className={`border p-2 min-h-20 ${
                  dateKey === todayKey
                    ? "bg-amber-100 border-amber-300"
                    : "border-teal-100"
                }`}
              >
                <div className="font-semibold text-sm text-teal-950">{day}</div>
                {daySchedules.length ? (
                  daySchedules.map((s, idx) => (
                    <div key={idx} className="text-xs text-teal-700">
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {!loading && view === "table" && (
        <div className="overflow-x-auto bg-white border">
          <table className="w-full text-sm">
            <thead className="bg-teal-200">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Schedule</th>
                <th className="p-2 border">Hours</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, "0");
                const dateKey = `${month}-${day}`;
                const daySchedules = schedulesByDate[dateKey] || [];

                return (
                  <tr
                    key={dateKey}
                    className={
                      dateKey === todayKey ? "bg-amber-100" : "even:bg-gray-50"
                    }
                  >
                    <td className="p-2 border border-teal-100">{dateKey}</td>
                    <td className="p-2 border border-teal-100">
                      {daySchedules.length
                        ? daySchedules.map((s, idx) => (
                            <div key={idx}>
                              {formatTime(s.startTime)} –{" "}
                              {formatTime(s.endTime)}
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="p-2 border border-teal-100 text-right">
                      {(() => {
                        const h = daySchedules.reduce((a, s) => a + s.hours, 0);
                        return h > 0 ? `${h.toFixed(1)}h` : "—";
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TOTAL */}
      <div className="bg-teal-300 p-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">
          Total Hours: {totalHours.toFixed(1)}h
        </span>
      </div>
    </div>
  );
}
