"use client";

import { useState } from "react";
import { format } from "date-fns";

type Props = {
  schedules: {
    id: string;
    date: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    employee: {
      id: string;
      name: string;
    };
  }[];
  employees: {
    id: string;
    name: string;
    contractType: "HOURLY" | "MONTHLY";
    hourlyRate?: number;
    monthlySalary?: number;
  }[];
};

/* -------- HELPERS -------- */
function diffHours(start: string | Date, end: string | Date) {
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

/* -------- COMPONENT -------- */
export default function MonthlySummaryTable({ schedules, employees }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const { start, end } = getMonthRange(monthOffset);

  // Filter schedules within month
  const monthSchedules = schedules.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d <= end;
  });

  // Total working hours in month standard (for monthly contracts)
  const STANDARD_MONTHLY_HOURS = 160;

  return (
    <div className="mt-12 space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-teal-950 px-2 py-1 uppercase">
          Monthly Summary ·{" "}
          {format(start, "yyyy-MM")} {/* SSR-safe */}
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
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-100">
              <th className="p-3 border text-left">Employee</th>
              <th className="p-3 border text-center">Contract</th>
              <th className="p-3 border text-center">Working Days</th>
              <th className="p-3 border text-center">Total Hours</th>
              <th className="p-3 border text-center">Hourly Rate</th>
              <th className="p-3 border text-center">Salary Earned</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const empSchedules = monthSchedules.filter(
                (s) => s.employee.id === emp.id
              );

              const workingDays = new Set(
                empSchedules.map((s) =>
                  new Date(s.date).toDateString()
                )
              ).size;

              const totalHours = empSchedules.reduce(
                (sum, s) => sum + diffHours(s.startTime, s.endTime),
                0
              );

              // Determine hourly rate
              let hourlyRate = 0;
              if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
                hourlyRate = emp.monthlySalary / STANDARD_MONTHLY_HOURS;
              } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
                hourlyRate = emp.hourlyRate;
              }

              const totalPay = totalHours * hourlyRate;

              return (
                <tr key={emp.id} className="border-t">
                  <td className="p-3 border font-medium">{emp.name}</td>
                  <td className="p-3 border text-center">{emp.contractType}</td>
                  <td className="p-3 border text-center">{workingDays}</td>
                  <td className="p-3 border text-center font-semibold">
                    {totalHours.toFixed(2)}
                  </td>
                  <td className="p-3 border text-center">{hourlyRate.toFixed(2)}</td>
                  <td className="p-3 border text-center font-semibold">
                    {totalPay.toFixed(2)}
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
