"use client";

import { Calendar, Clock, Plus, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import ClockDisplay from "./ClockDisplay";
import {
  createOrReplaceSchedule,
  getCompanyEmployees,
  getSchedulesForCompany,
  updateSchedule,
} from "./schedules";
import DatePicker from "react-multi-date-picker";
import WeeklyScheduleTable from "./WeeklyScheduleTable";

export default function CompanySchedulePage() {
  const [employeesFromDB, setEmployeesFromDB] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("00");
  const [endMinute, setEndMinute] = useState("00");

  const [schedules, setSchedules] = useState<any[]>([]);

  const [isCreating, setIsCreating] = useState(false);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const removeDate = (date: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== date));
  };

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

  const addScheduleHandler = async () => {
    if (isCreating) return; // extra safety

    const start = `${startHour}:${startMinute}`;
    const end = `${endHour}:${endMinute}`;

    if (!selectedDates.length || !selectedEmployees.length) return;

    setIsCreating(true);

    try {
      for (const date of selectedDates) {
        try {
          await createOrReplaceSchedule({
            employeeIds: selectedEmployees,
            date,
            startTime: start,
            endTime: end,
            replace: false,
          });
        } catch (err: any) {
          if (err.message === "OVERLAP_EXISTS") {
            const ok = confirm(
              `One or more employees already have a schedule overlapping this time on ${new Date(
                date
              ).toLocaleDateString()}. Replace it?`
            );

            if (!ok) continue;

            await createOrReplaceSchedule({
              employeeIds: selectedEmployees,
              date,
              startTime: start,
              endTime: end,
              replace: true,
            });
          } else {
            console.error(err);
          }
        }
      }

      await loadData();

      // reset UI
      setSelectedEmployees([]);
      setSelectedDates([]);
      setStartHour("00");
      setStartMinute("00");
      setEndHour("00");
      setEndMinute("00");
    } finally {
      setIsCreating(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      <h1 className="text-3xl font-bold uppercase text-teal-950 mb-4">Working Schedule</h1>
   {/*    <p className="text-teal-600 mb-6">
        Plan upcoming sessions and build schedules for your team in just a few
        clicks.
      </p> */}

      <ClockDisplay />

      <div className="bg-white p-6 rounded-xs border border-teal-900 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employees */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 uppercase text-teal-900 font-medium text-sm border mt-2 px-2 py-1 border-teal-100">
              Select Employees
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

          {/* Dates */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-teal-600 font-medium">
              {/*  <Calendar className="w-5 h-5" /> Dates */}
            </label>
            <DatePicker
              multiple
              value={selectedDates}
              onChange={(dates: any) =>
                setSelectedDates(dates.map((d: any) => d.format("YYYY-MM-DD")))
              }
              format="YYYY-MM-DD"
              render={(value, openCalendar) => (
                <div
                  onClick={openCalendar}
                  className="flex text-[8px] items-center gap-2 px-3 py-1 rounded-xs  border sm:w-80 border-teal-100 cursor-pointer bg-white"
                >
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="text-teal-600">
                    {selectedDates.length > 0
                      ? selectedDates
                          .map((d) => new Date(d).toLocaleDateString())
                          .join(", ")
                      : "Select date(s)"}
                  </span>
                </div>
              )}
            />

            {/* 1️⃣ Show selected dates nicely */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm"
                >
                  {new Date(date).toLocaleDateString()}
                  <button onClick={() => removeDate(date)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
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
          disabled={isCreating}
          className={`px-4 py-2 rounded-xs flex items-center gap-2 transition cursor-pointer
    ${
      isCreating
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-teal-800 hover:bg-teal-900 text-white"
    }`}
        >
          {isCreating ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Wait Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add Schedule
            </>
          )}
        </button>
      </div>

     <WeeklyScheduleTable schedules={schedules} employees={employeesFromDB} />
    </div>
  );
}
