"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function EmployeeDashboard() {
  const [showHoursModal, setShowHoursModal] = useState(false);

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      date: "2025-12-13",
      time: "10:00 - 11:00",
      topic: "Team Meeting",
      status: "Scheduled",
    },
    {
      date: "2025-12-14",
      time: "14:00 - 15:30",
      topic: "Project Review",
      status: "Cancelled",
    },
    {
      date: "2025-12-15",
      time: "09:00 - 10:30",
      topic: "Client Call",
      status: "Not possible to attend",
    },
  ];

  // Mock hours worked
  const hoursWorked = [
    { date: "December 2", start: "11:00", end: "19:25", duration: "8h 25m" },
    { date: "December 3", start: "10:32", end: "19:36", duration: "9h 03m" },
    { date: "December 4", start: "10:37", end: "17:14", duration: "6h 37m" },
    { date: "December 5", start: "10:35", end: "20:42", duration: "10h 07m" },
    { date: "December 6", start: "10:04", end: "17:34", duration: "7h 29m" },
    { date: "December 7", start: "10:22", end: "15:04", duration: "4h 41m" },
    { date: "December 10", start: "10:30", end: "19:11", duration: "8h 41m" },
    { date: "December 11", start: "10:38", end: "19:26", duration: "8h 48m" },
  ];

  const totalHours = "63h 54m";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-20 max-w-7xl mx-auto">
      {/* LEFT COLUMN: Upcoming Sessions */}
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-4">Upcoming Sessions</h2>
        <ul className="space-y-3">
          {upcomingSessions.map((session, idx) => (
            <li
              key={idx}
              className="grid grid-cols-2 gap-2 items-start p-3 rounded-md hover:bg-teal-50 shadow-[0_4px_6px_-1px_rgba(20,83,45,0.4),0_2px_4px_-1px_rgba(20,83,45,0.06)]"
            >
              {/* Left: Date & Topic */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-sm">{session.date}</span>
                <span className="font-medium text-gray-700">
                  {session.topic}
                </span>
              </div>
              {/* Right: Status & Time */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-teal-600 text-xs font-semibold">
                  {session.status || "Scheduled"}
                </span>
                <span className="text-gray-500 text-sm">{session.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="grid grid-rows-[auto_auto] gap-4">
        {/* Show Schedule link */}
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          <div>
            <a
              href="/employee/schedule"
              className="text-teal-600 font-semibold hover:underline"
            >
              Show Schedule
            </a>
          </div>

          {/* Hours Worked Card */}
          <button
            onClick={() => setShowHoursModal(true)}
            className="md:w-88 h-20 grid grid-cols-2 items-center bg-white p-1 rounded-md hover:bg-teal-50 transition-shadow duration-200 shadow-[0_4px_6px_-1px_rgba(20,83,45,0.4),0_2px_4px_-1px_rgba(20,83,45,0.06)]"
          >
            <span className="font-medium text-gray-700 text-sm">
              Hours Worked This Month
            </span>
            <div className="flex items-center justify-end gap-1 text-teal-600 font-semibold">
              {totalHours.split(" ")[0]} <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* HOURS WORKED MODAL */}
      {showHoursModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 grid place-items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Hours Worked</h2>
            <p className="text-gray-500 mb-2">
              The period 2025-12-01 – 2025-12-31
            </p>
            <p className="font-semibold text-gray-700 mb-4">
              Total Hours So Far: {totalHours}
            </p>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Date</th>
                  <th className="py-2">Start - End</th>
                  <th className="py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {hoursWorked.map((hour, idx) => (
                  <tr key={idx} className="border-b hover:bg-teal-50">
                    <td className="py-2">{hour.date}</td>
                    <td className="py-2">
                      {hour.start} – {hour.end}
                    </td>
                    <td className="py-2">{hour.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
              onClick={() => setShowHoursModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
