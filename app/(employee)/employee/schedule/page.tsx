"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock } from "lucide-react";

// Each day's schedule
type DailySchedule = {
  date: string;
  startTime?: string; // "09:00"
  endTime?: string; // "17:00"
  hours: number; // total hours worked
};

export default function MySchedulePage() {
  const [month, setMonth] = useState("2025-12");

  // Random schedule for demonstration
  const scheduleData: DailySchedule[] = useMemo(() => {
    const daysInMonth = new Date(
      Number(month.split("-")[0]),
      Number(month.split("-")[1]),
      0
    ).getDate();
    const data: DailySchedule[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, "0");
      // Randomly decide if worked today
      if (Math.random() > 0.4) {
        const startHour = 8 + Math.floor(Math.random() * 4); // 8AM to 11AM
        const endHour = startHour + 4 + Math.floor(Math.random() * 4); // 4-7 hours shift
        data.push({
          date: `${month}-${day}`,
          startTime: `${startHour.toString().padStart(2, "0")}:00`,
          endTime: `${endHour.toString().padStart(2, "0")}:00`,
          hours: endHour - startHour,
        });
      } else {
        data.push({
          date: `${month}-${day}`,
          hours: 0,
        });
      }
    }
    return data;
  }, [month]);

  const totalHours = useMemo(
    () => scheduleData.reduce((acc, d) => acc + d.hours, 0),
    [scheduleData]
  );

  const daysInMonth = new Date(
    Number(month.split("-")[0]),
    Number(month.split("-")[1]),
    0
  ).getDate();

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Schedule</h1>
      <p className="text-gray-600 mb-4">
        View your schedule for the selected month. Start and end times are
        displayed for each shift.
      </p>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3 mb-4">
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
        <h2 className="text-xl font-semibold mb-2">Calendar ({month})</h2>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = (i + 1).toString().padStart(2, "0");
            const dayData = scheduleData.find((d) =>
              d.date.endsWith(`-${day}`)
            );
            return (
              <div
                key={i}
                className={`h-24 border rounded p-2 flex flex-col justify-between items-center 
                  ${dayData?.hours ? "bg-teal-50" : "bg-gray-50"}`}
              >
                <span className="font-semibold">{day}</span>
                {dayData?.hours ? (
                  <>
                    <span className="text-sm text-teal-700">
                      {dayData ? (
                        <span className="text-sm text-teal-700">
                          {dayData.startTime} - {dayData.endTime}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Off</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-teal-700">
                      <Clock className="w-4 h-4" /> {dayData.hours}h
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Off</span>
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
          Total Hours This Month: {totalHours}h
        </span>
      </div>
    </div>
  );
}
