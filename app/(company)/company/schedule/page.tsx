"use client";

import { Calendar, Clock, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import ClockDisplay from "./ClockDisplay";
import {
  createSchedule,
  getCompanyEmployees,
  getSchedulesForCompany,
  updateSchedule,
} from "./schedules";

export default function CompanySchedulePage() {
  const [employeesFromDB, setEmployeesFromDB] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [date, setDate] = useState("");

  // Start Time states
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");

  // End Time states
  const [endHour, setEndHour] = useState("00");
  const [endMinute, setEndMinute] = useState("00");

  const [schedules, setSchedules] = useState<any[]>([]);

  // Toggle employee selection
  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Load employees and schedules
  const loadData = async () => {
    try {
      const emps = await getCompanyEmployees();
      setEmployeesFromDB(emps);

      const schs = await getSchedulesForCompany();
      setSchedules(schs);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add new schedule
  /* const addScheduleHandler = async () => {
  const computedStartTime = `${startHour}:${startMinute}`;
  const computedEndTime = `${endHour}:${endMinute}`;

  if (!date || !computedStartTime || !computedEndTime || selectedEmployees.length === 0) return;

  // Check if any selected employee already has a schedule on this date
  const conflictingEmployees = selectedEmployees.filter((empId) =>
    schedules.some(
      (sch) =>
        sch.employee.id === empId &&
        new Date(sch.date).toDateString() === new Date(date).toDateString()
    )
  );

  if (conflictingEmployees.length > 0) {
    const employeeNames = employeesFromDB
      .filter((emp) => conflictingEmployees.includes(emp.id))
      .map((emp) => emp.name)
      .join(", ");

    const confirmUpdate = confirm(
      `The following employee(s) already have a schedule on this date: ${employeeNames}. Do you want to update their schedule?`
    );

    if (!confirmUpdate) return; // Cancel if user selects "No"
  }

  try {
    await createSchedule({
      employeeIds: selectedEmployees,
      date,
      startTime: computedStartTime,
      endTime: computedEndTime,
    });

    // Reload data
    await loadData();

    // Reset form
    setSelectedEmployees([]);
    setDate("");
    setStartHour("08");
    setStartMinute("00");
    setEndHour("09");
    setEndMinute("00");
  } catch (err) {
    console.error("Error creating schedule:", err);
  }
}; */
  const addScheduleHandler = async () => {
    const computedStartTime = `${startHour}:${startMinute}`;
    const computedEndTime = `${endHour}:${endMinute}`;

    if (
      !date ||
      !computedStartTime ||
      !computedEndTime ||
      selectedEmployees.length === 0
    )
      return;

    // Find conflicting schedules
    const conflictingSchedules = schedules.filter(
      (sch) =>
        selectedEmployees.includes(sch.employee.id) &&
        new Date(sch.date).toDateString() === new Date(date).toDateString()
    );

    if (conflictingSchedules.length > 0) {
      const employeeNames = conflictingSchedules
        .map((sch) => sch.employee.name)
        .join(", ");

      const confirmUpdate = confirm(
        `The following Innovator(s) already have a schedule on this date: ${employeeNames}. Do you want to update their schedule?`
      );

      if (!confirmUpdate) return; // Cancel if user selects "No"

      // Update existing schedules
      for (const sch of conflictingSchedules) {
        try {
          await updateSchedule(sch.id, {
            startTime: computedStartTime,
            endTime: computedEndTime,
          });
        } catch (err) {
          console.error(
            `Error updating schedule for ${sch.employee.name}:`,
            err
          );
        }
      }
    }

    // Create new schedules for employees without conflicts
    const employeesToCreate = selectedEmployees.filter(
      (id) => !conflictingSchedules.some((sch) => sch.employee.id === id)
    );

    if (employeesToCreate.length > 0) {
      try {
        await createSchedule({
          employeeIds: employeesToCreate,
          date,
          startTime: computedStartTime,
          endTime: computedEndTime,
        });
      } catch (err) {
        console.error("Error creating new schedules:", err);
        return;
      }
    }

    // Reload data
    await loadData();

    // Reset form
    setSelectedEmployees([]);
    setDate("");
    setStartHour("00");
    setStartMinute("00");
    setEndHour("00");
    setEndMinute("00");
  };

  // Generate hour options
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-1 uppercase">Working Schedule</h1>
      <p className="text-teal-600 mb-6">
        Plan upcoming sessions and build schedules for your team in just a few
        clicks.
      </p>

      <ClockDisplay />

      {/* Add Schedule Form */}
      <div className="bg-white p-6 rounded-xs shadow border border-teal-100 space-y-4">
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
              className="border py-1 px-3 rounded-xs border-teal-100"
            />
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> Start Time
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="border py-1 px-3 rounded-xs border-teal-100"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="border py-1 px-3 rounded-xs border-teal-100"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              <Clock className="w-5 h-5" /> End Time
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="border py-1 px-3 rounded-xs border-teal-100"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="border py-1 px-3 rounded-xs border-teal-100"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={addScheduleHandler}
          className="bg-teal-600 text-white px-4 py-2 rounded-xs cursor-pointer hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Existing Schedules Table */}
      <div className="bg-white rounded-xs shadow p-4 border border-teal-100">
        <h2 className="text-xl font-semibold mb-3 uppercase">
          All Existing Schedules
        </h2>

        {Object.entries(
          schedules.reduce((acc: Record<string, any[]>, sch) => {
            const day = new Date(sch.date).toLocaleDateString();
            if (!acc[day]) acc[day] = [];
            acc[day].push(sch);
            return acc;
          }, {})
        )
          // Sort days descending (latest first)
          .sort(
            ([dayA], [dayB]) =>
              new Date(dayB).getTime() - new Date(dayA).getTime()
          )
          .map(([day, daySchedules]) => (
            <div key={day} className="mb-4">
              <h3 className="text-lg font-semibold text-teal-600 mb-2">
                {day}
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead className="bg-teal-100">
                  <tr>
                    <th className="p-3 text-left border-b">Employees</th>
                    <th className="p-3 text-left border-b">Start</th>
                    <th className="p-3 text-left border-b">End</th>
                    <th className="p-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {daySchedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-gray-50 border-t border-teal-100">
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
