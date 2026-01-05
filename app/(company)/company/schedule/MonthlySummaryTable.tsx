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

  // Filter schedules and timelogs within the month
  const monthSchedules = schedules.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d <= end;
  });

  const monthTimeLogs = timeLogs.filter((t) => {
    const d = new Date(t.logDate);
    return d >= start && d <= end;
  });

  const STANDARD_MONTHLY_HOURS = 160;

  return (
    <div className="mt-12 space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-teal-950 px-2 py-1 uppercase">
          Monthly Summary · {format(start, "yyyy-MM")}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>

          <button
            onClick={() => setMonthOffset(0)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Current
          </button>

          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-max">
          <thead>
            <tr className="bg-teal-100">
              {/* Employee column */}
              <th className="p-3 border text-left sticky left-0 bg-teal-100 z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis">
                Employee
              </th>
              <th className="p-3 border text-center">Contract</th>
              <th className="p-3 border text-center">Scheduled Days</th>
              <th className="p-3 border text-center">Worked Days</th>
              <th className="p-3 border text-center">Scheduled Hours</th>
              <th className="p-3 border text-center">Worked Hours</th>
              <th className="p-3 border text-center">Hourly Rate</th>
              <th className="p-3 border text-center">Salary Earned</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              // Scheduled info
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

              // TimeLog info
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

              // Hourly rate
              let hourlyRate = 0;
              if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
                hourlyRate = emp.monthlySalary / 160;
              } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
                hourlyRate = emp.hourlyRate;
              }

              const salaryEarned = workedHours * hourlyRate;

              return (
                <tr key={emp.id} className="border-t">
                  <td
                    className="p-3 border font-medium sticky left-0 bg-white z-10 w-52 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={emp.name} // tooltip on hover
                  >
                    {emp.name}
                  </td>
                  <td className="p-3 border text-center">{emp.contractType}</td>
                  <td className="p-3 border text-center">{scheduledDays}</td>
                  <td className="p-3 border text-center">{workedDays}</td>
                  <td className="p-3 border text-center font-semibold">
                    {scheduledHours.toFixed(2)}
                  </td>
                  <td className="p-3 border text-center font-semibold">
                    {workedHours.toFixed(2)}
                  </td>
                  <td className="p-3 border text-center">
                    {hourlyRate.toFixed(2)}
                  </td>
                  <td className="p-3 border text-center font-semibold">
                    {salaryEarned.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
