"use client";

import { Calendar, Clock, Plus, User } from "lucide-react";
import { useState, useEffect } from "react";

const employeesFromDB = [
  "Anna Karlsson",
  "Erik Svensson",
  "Johan Nilsson",
  "Maria Andersson",
  "Sara Johansson",
];

export default function CompanySchedulePage() {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleEmployee = (name: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(name)
        ? prev.filter((e) => e !== name)
        : [...prev, name]
    );
  };

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-1">Working Schedule</h1>
      <p className="text-gray-600 mb-6">
        Manage upcoming sessions and schedules for your employees.
      </p>

      {/* Real-time Clock */}
      <div className="text-teal-600 font-semibold text-lg mb-4">
        Current Time:{" "}
        {currentTime.toLocaleTimeString("en-US", { hour12: false })} |{" "}
        {currentTime.toLocaleDateString()}
      </div>

      {/* Add Schedule Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Add New Schedule</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employees Multi-select Buttons */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <User className="w-5 h-5" /> Select Employees
            </label>
            <div className="flex flex-wrap gap-2">
              {employeesFromDB.map((emp) => (
                <button
                  key={emp}
                  type="button"
                  onClick={() => toggleEmployee(emp)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedEmployees.includes(emp)
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-teal-600 border-teal-600"
                  } hover:bg-teal-600 hover:text-white transition`}
                >
                  {emp}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Calendar className="w-5 h-5" /> Date
            </label>
            <input type="date" className="border p-2 rounded w-full" />
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> Start Time
            </label>
            <input type="time" className="border p-2 rounded w-full" />
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> End Time
            </label>
            <input type="time" className="border p-2 rounded w-full" />
          </div>
        </div>

        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Existing Schedules Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Existing Schedules</h2>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left border-b">Employees</th>
              <th className="p-3 text-left border-b">Date</th>
              <th className="p-3 text-left border-b">Start</th>
              <th className="p-3 text-left border-b">End</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 border-t">
              <td className="p-3">Anna Karlsson, Erik Svensson</td>
              <td className="p-3">2025-12-15</td>
              <td className="p-3">08:00</td>
              <td className="p-3">16:00</td>
              <td className="p-3">
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
