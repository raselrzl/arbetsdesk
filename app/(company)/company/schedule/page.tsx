"use client";

import { Calendar, Clock, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import ClockDisplay from "./ClockDisplay";
import {
  createSchedule,
  getCompanyEmployees,
  getSchedulesForCompany,
} from "./schedules";

export default function CompanySchedulePage() {
  const [employeesFromDB, setEmployeesFromDB] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);

  // Toggle employee selection
  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Load employees and schedules using server actions
  const loadData = async () => {
    try {
      const emps = await getCompanyEmployees(); // Server Action
      setEmployeesFromDB(emps);

      const schs = await getSchedulesForCompany(); // Server Action
      setSchedules(schs);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add new schedule
  const addScheduleHandler = async () => {
    if (!date || !startTime || !endTime || selectedEmployees.length === 0)
      return;

    try {
      await createSchedule({
        employeeIds: selectedEmployees,
        date,
        startTime,
        endTime,
      });

      // Reload data
      await loadData();

      // Reset form
      setSelectedEmployees([]);
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error("Error creating schedule:", err);
    }
  };

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-1">Working Schedule</h1>
      <p className="text-gray-600 mb-6">
        Manage upcoming sessions and schedules for your employees.
      </p>

      <ClockDisplay />

      {/* Add Schedule Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Add New Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employees */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <User className="w-5 h-5" /> Select Employees
            </label>
            <div className="flex flex-wrap gap-2">
              {employeesFromDB.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => toggleEmployee(emp.id)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedEmployees.includes(emp.id)
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-teal-600 border-teal-600"
                  } hover:bg-teal-600 hover:text-white transition`}
                >
                  {emp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Calendar className="w-5 h-5" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <button
          onClick={addScheduleHandler}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Existing Schedules Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Existing Schedules</h2>

        {Object.entries(
          schedules.reduce((acc: Record<string, any[]>, sch) => {
            const day = new Date(sch.date).toLocaleDateString();
            if (!acc[day]) acc[day] = [];
            acc[day].push(sch);
            return acc;
          }, {})
        ).map(([day, daySchedules]) => (
          <div key={day} className="mb-4">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{day}</h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left border-b">Employees</th>
                  <th className="p-3 text-left border-b">Start</th>
                  <th className="p-3 text-left border-b">End</th>
                  <th className="p-3 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {daySchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-gray-50 border-t">
                    <td className="p-3">{sch.employee.name}</td>
                    <td className="p-3">
                      {new Date(sch.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3">
                      {new Date(sch.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3">
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
