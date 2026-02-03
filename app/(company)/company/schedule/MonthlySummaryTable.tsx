"use client";

import { useState } from "react";
import { format } from "date-fns";

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

  return (
    <div className="mt-12 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="font-bold text-gray-100 bg-[#02505e] px-4 py-2 uppercase rounded-xs">
          Monthly Summary · {format(start, "yyyy-MM")}
        </div>
          
        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-3 py-1 border border-[#02505e] hover:bg-teal-100 rounded-xs text-xs font-medium"
          >
            ← Prev
          </button>

          <button
            onClick={() => setMonthOffset(0)}
            className="px-3 py-1 border border-[#02505e] hover:bg-teal-100 rounded-xs text-xs font-medium"
          >
            Current
          </button>

          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-3 py-1 border border-[#02505e] hover:bg-teal-100 rounded-xs text-xs font-medium"
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
              <th className="p-3 border border-teal-100 text-center">Contract</th>

              {/* Days column */}
              <th className="p-3 border text-center">
                Days
                <div className="flex justify-center gap-1 mt-1 text-xs font-medium">
                  <span className="px-2 py-0.5 bg-blue-800 text-white">Scheduled</span>
                  <span className="px-2 py-0.5 bg-blue-500 text-white">Worked</span>
                </div>
              </th>

              {/* Hours column */}
              <th className="p-3 border border-teal-100 text-center">
                Hours
                <div className="flex justify-center gap-1 mt-1 text-xs font-medium">
                  <span className="px-2 py-0.5 bg-green-800 text-white">Scheduled</span>
                  <span className="px-2 py-0.5 bg-green-500 text-white">Worked</span>
                </div>
              </th>

              <th className="p-3 border border-teal-100 text-center">Hourly Rate</th>
              <th className="p-3 border border-teal-100 text-center">Salary Earned</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, idx) => {
              const empSchedules = monthSchedules.filter(
                (s) => s.employee.id === emp.id
              );
              const scheduledDays = new Set(
                empSchedules.map((s) => new Date(s.date).toDateString())
              ).size;
              const scheduledHours = empSchedules.reduce(
                (sum, s) => sum + diffHours(s.startTime, s.endTime),
                0
              );

              const empTimeLogs = monthTimeLogs.filter(
                (t) => t.employee.id === emp.id
              );
              const workedDays = new Set(
                empTimeLogs.map((t) => new Date(t.logDate).toDateString())
              ).size;
              const workedHours = empTimeLogs.reduce(
                (sum, t) => sum + diffHours(t.loginTime, t.logoutTime),
                0
              );

              let hourlyRate = 0;
              if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
                hourlyRate = emp.monthlySalary / STANDARD_MONTHLY_HOURS;
              } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
                hourlyRate = emp.hourlyRate;
              }

              const salaryEarned = workedHours * hourlyRate;

              const scheduledHoursPercent = Math.min((scheduledHours / STANDARD_MONTHLY_HOURS) * 100, 100);
              const workedHoursPercent = Math.min((workedHours / STANDARD_MONTHLY_HOURS) * 100, 100);

              return (
                <tr
                  key={emp.id}
                  className={`border-t border-teal-100 hover:bg-teal-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td
                    className="p-3 border border-teal-100 font-medium sticky left-0 bg-[#02505e] text-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={emp.name}
                  >
                    {emp.name}
                  </td>
                  <td className="p-3 border border-teal-100 text-center">{emp.contractType}</td>

                  {/* Days column */}
                  <td className="p-0 border border-teal-100 text-center h-12">
                    <div className="flex flex-col h-full w-full">
                      <div
                        className="h-1/2 w-full bg-blue-800 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{ width: `${(scheduledDays / totalDaysInMonth) * 100}%` }}
                      >
                        {scheduledDays}
                      </div>
                      <div
                        className="h-1/2 w-full bg-blue-500 flex items-center justify-start px-1 text-white text-xs font-semibold"
                        style={{ width: `${(workedDays / totalDaysInMonth) * 100}%` }}
                      >
                        {workedDays}
                      </div>
                    </div>
                  </td>

                  {/* Hours column */}
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

                  <td className="p-3 border border-teal-100 text-center font-medium">{hourlyRate.toFixed(2)}</td>
                  <td className="p-3 border border-teal-100 text-center font-semibold">{salaryEarned.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
