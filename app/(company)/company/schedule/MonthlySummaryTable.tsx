"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

type Props = {
  schedules?: {
    id: string;
    date: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    employee: {
      id: string;
      name: string;
    };
  }[];
  timeLogs?: {
    id: string;
    logDate: string | Date;
    loginTime: string | Date | null;
    logoutTime: string | Date | null;
    employee: {
      id: string;
      name: string;
    };
  }[];
  employees?: {
    id: string;
    name: string;
    contractType: "HOURLY" | "MONTHLY";
    hourlyRate?: number;
    monthlySalary?: number;
  }[];
};

/* ---------- HELPERS ---------- */
function diffHours(start: string | Date | null, end: string | Date | null) {
  if (!start || !end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (isNaN(startTime) || isNaN(endTime)) return 0;
  return (endTime - startTime) / 36e5;
}

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/* ---------- COMPONENT ---------- */
export default function MonthlySummaryTable({
  schedules = [],
  timeLogs = [],
  employees = [],
}: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const { start, end } = getMonthRange(monthOffset);

  const monthSchedules = schedules.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d <= end;
  });

  const monthTimeLogs = timeLogs.filter((t) => {
    const d = new Date(t.logDate);
    return d >= start && d <= end;
  });

  const STANDARD_MONTHLY_HOURS = 160;
  const totalDaysInMonth = end.getDate();

  const [selectedEmployee, setSelectedEmployee] = useState<null | {
    id: string;
    name: string;
    contractType: "HOURLY" | "MONTHLY";
    hourlyRate: number;
    monthlySalary?: number;
    scheduledDays: number;
    workedDays: number;
    scheduledHours: number;
    workedHours: number;
    scheduledSalary: number;
    salaryEarned: number;
  }>(null);

  return (
    <div className="mt-12 bg-[#02505e]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 border border-teal-100">
        <div className="font-bold text-gray-100 bg-[#02505e] px-4 py-2 uppercase rounded-xs">
          Monthly Summary · {format(start, "yyyy-MM")}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-3 py-1 border border-teal-400 hover:bg-teal-400 text-teal-400 text-xs font-medium"
          >
            ← Prev
          </button>

          <button
            onClick={() => setMonthOffset(0)}
            className="px-3 py-1 border border-teal-400 hover:bg-teal-400 text-teal-400 text-xs font-medium"
          >
            Current
          </button>

          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-3 py-1 border border-teal-400 hover:bg-teal-400 text-teal-400 text-xs font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xs border border-teal-100">
        <table className="w-full border-collapse text-sm min-w-max">
          <thead>
            <tr className="bg-[#02505e] shadow-inner text-gray-100">
              <th className="p-3 border text-left sticky left-0 bg-[#02505e] text-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                Employee
              </th>
              <th className="p-3 border border-teal-100 text-center">
                Contract
              </th>

              {/* Days */}
              <th className="p-3 border text-center">
                Days
                <div className="flex justify-center gap-1 mt-1 text-xs font-medium">
                  <span className="px-2 py-0.5 bg-teal-800 text-white">
                    Scheduled
                  </span>
                  <span className="px-2 py-0.5 bg-teal-600 text-white">
                    Worked
                  </span>
                </div>
              </th>

              {/* Hourly Rate */}
              <th className="p-3 border border-teal-100 text-center">
                Hourly Rate
              </th>

              {/* Scheduled Salary (NEW COLUMN) */}
              <th className="p-3 border border-teal-100 text-center">
                Scheduled Salary
              </th>
              {/* Hours */}
              <th className="p-3 border border-teal-100 text-center">
                Hours
                <div className="flex justify-center gap-1 mt-1 text-xs font-medium">
                  <span className="px-2 py-0.5 bg-green-800 text-white">
                    Scheduled
                  </span>
                  <span className="px-2 py-0.5 bg-green-500 text-white">
                    Worked
                  </span>
                </div>
              </th>
              {/* Salary Earned */}
              <th className="p-3 border border-teal-100 text-center">
                Salary Earned
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, idx) => {
              const empSchedules = monthSchedules.filter(
                (s) => s.employee.id === emp.id,
              );
              const scheduledDays = new Set(
                empSchedules.map((s) => new Date(s.date).toDateString()),
              ).size;
              const scheduledHours = empSchedules.reduce(
                (sum, s) => sum + diffHours(s.startTime, s.endTime),
                0,
              );

              const empTimeLogs = monthTimeLogs.filter(
                (t) => t.employee.id === emp.id,
              );
              const workedDays = new Set(
                empTimeLogs.map((t) => new Date(t.logDate).toDateString()),
              ).size;
              const workedHours = empTimeLogs.reduce(
                (sum, t) => sum + diffHours(t.loginTime, t.logoutTime),
                0,
              );

              let hourlyRate = 0;
              if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
                hourlyRate = emp.monthlySalary / STANDARD_MONTHLY_HOURS;
              } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
                hourlyRate = emp.hourlyRate;
              }

              // New Scheduled Salary column
              const scheduledSalary =
                emp.contractType === "HOURLY"
                  ? scheduledHours * hourlyRate
                  : emp.monthlySalary || 0;

              const salaryEarned = workedHours * hourlyRate;

              const scheduledHoursPercent = Math.min(
                (scheduledHours / STANDARD_MONTHLY_HOURS) * 100,
                100,
              );
              const workedHoursPercent = Math.min(
                (workedHours / STANDARD_MONTHLY_HOURS) * 100,
                100,
              );

              return (
                <tr
                  key={emp.id}
                  className={`border-t border-teal-100 hover:bg-teal-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* <td
                    onClick={() =>
                      setSelectedEmployee({
                        id: emp.id,
                        name: emp.name,
                        contractType: emp.contractType,
                        hourlyRate,
                        monthlySalary: emp.monthlySalary,
                        scheduledDays,
                        workedDays,
                        scheduledHours,
                        workedHours,
                        scheduledSalary,
                        salaryEarned,
                      })
                    }
                    className="p-3 border border-teal-100 font-medium sticky left-0 bg-[#02505e] text-white z-10 w-52 cursor-pointer hover:bg-teal-700 transition"
                  >
                    {emp.name}
                  </td> */}
                  <td
                    onClick={() =>
                      setSelectedEmployee({
                        id: emp.id,
                        name: emp.name,
                        contractType: emp.contractType,
                        hourlyRate,
                        monthlySalary: emp.monthlySalary,
                        scheduledDays,
                        workedDays,
                        scheduledHours,
                        workedHours,
                        scheduledSalary,
                        salaryEarned,
                      })
                    }
                    className="relative p-3 border border-teal-100 font-medium left-0 
             bg-[#02505e] text-white z-10 w-52 cursor-pointer 
             hover:bg-teal-700 transition group"
                  >
                    {emp.name}

                    {/* Top-right action box */}
                    <div
                      className="absolute top-0 right-0 w-4 h-4
               bg-white/15
                flex items-center justify-center
               text-white/80 text-xs
               group-hover:bg-white/25 
               group-hover:text-white
               transition"
                    >
                      <ArrowUpRight />
                    </div>
                  </td>

                  <td className="p-3 border border-teal-100 text-center">
                    {emp.contractType}
                  </td>

                  {/* Days */}
                  <td className="p-0 border border-teal-100 text-center h-12">
                    <div className="flex flex-col h-full w-full">
                      <div
                        className="h-1/2 w-full bg-teal-800 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{
                          width: `${(scheduledDays / totalDaysInMonth) * 100}%`,
                        }}
                      >
                        {scheduledDays}
                      </div>
                      <div
                        className="h-1/2 w-full bg-teal-600 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{
                          width: `${(workedDays / totalDaysInMonth) * 100}%`,
                        }}
                      >
                        {workedDays}
                      </div>
                    </div>
                  </td>

                  <td className="p-3 border border-teal-100 text-center font-medium">
                    {hourlyRate.toFixed(2)}
                  </td>

                  {/* Scheduled Salary */}
                  <td className="p-3 border border-teal-100 text-center font-semibold">
                    {scheduledSalary.toFixed(2)}
                  </td>

                  {/* Hours */}
                  <td className="p-0 border border-teal-100 text-center h-12">
                    <div className="flex flex-col h-full w-full">
                      <div
                        className="h-1/2 w-full bg-green-800 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{ width: `${scheduledHoursPercent}%` }}
                      >
                        {scheduledHours.toFixed(1)}
                      </div>
                      <div
                        className="h-1/2 w-full bg-green-500 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{ width: `${workedHoursPercent}%` }}
                      >
                        {workedHours.toFixed(1)}
                      </div>
                    </div>
                  </td>

                  <td className="p-3 border border-teal-100 text-center font-semibold">
                    {salaryEarned.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#02505e] text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold uppercase">
                  {selectedEmployee.name}
                </h2>
                <p className="text-sm opacity-80">
                  {selectedEmployee.contractType} · Monthly Summary
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-white text-xl hover:opacity-70"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Days + Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-teal-700">
                    Days
                  </p>
                  <p className="text-sm mt-2">
                    Scheduled:{" "}
                    <span className="font-bold">
                      {selectedEmployee.scheduledDays}
                    </span>
                  </p>
                  <p className="text-sm">
                    Worked:{" "}
                    <span className="font-bold">
                      {selectedEmployee.workedDays}
                    </span>
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-green-700">
                    Hours
                  </p>
                  <p className="text-sm mt-2">
                    Scheduled:{" "}
                    <span className="font-bold">
                      {selectedEmployee.scheduledHours.toFixed(1)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Worked:{" "}
                    <span className="font-bold">
                      {selectedEmployee.workedHours.toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Money */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-gray-600">
                    Hourly Rate
                  </p>
                  <p className="text-lg font-extrabold mt-1">
                    {selectedEmployee.hourlyRate.toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-blue-700">
                    Scheduled Salary
                  </p>
                  <p className="text-lg font-extrabold mt-1">
                    {selectedEmployee.scheduledSalary.toFixed(2)}
                  </p>
                </div>

                <div className="col-span-2 bg-green-100 rounded-xl p-4 flex justify-between items-center">
                  <p className="text-sm font-semibold text-green-800 uppercase">
                    Salary Earned
                  </p>
                  <p className="text-2xl font-extrabold text-green-800">
                    {selectedEmployee.salaryEarned.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Monthly salary (only if monthly) */}
              {selectedEmployee.contractType === "MONTHLY" && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-indigo-700">
                    Monthly Salary
                  </p>
                  <p className="text-lg font-extrabold mt-1">
                    {selectedEmployee.monthlySalary?.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
