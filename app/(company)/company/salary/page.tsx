"use client";

import { Wallet, User, Clock, Calendar } from "lucide-react";
import { useState, useMemo } from "react";

type SalaryRow = {
  employeeId: string;
  name: string;
  totalMinutes: number;
  monthlySalary: number;
  month: string; // e.g., "2025-01"
};

// Employee names
const employeeNames = [
  "Anna Karlsson",
  "Erik Svensson",
  "Johan Nilsson",
  "Maria Andersson",
  "Sara Johansson",
];

// Helper to format minutes
const formatMinutes = (min: number) =>
  `${Math.floor(min / 60)}h ${min % 60}m`;

// Generate mock data for 10 months
const generateSalaryData = (): SalaryRow[] => {
  const data: SalaryRow[] = [];
  for (let m = 1; m <= 10; m++) {
    const monthStr = `2025-${String(m).padStart(2, "0")}`;
    employeeNames.forEach((name, i) => {
      const hoursWorked = 140 + Math.floor(Math.random() * 41); // 140-180h
      const minutesWorked = hoursWorked * 60;
      const monthlySalary = 25000 + Math.floor(Math.random() * 10001); // 25000-35000 SEK
      data.push({
        employeeId: `${i + 1}-${m}`,
        name,
        totalMinutes: minutesWorked,
        monthlySalary,
        month: monthStr,
      });
    });
  }
  return data;
};

const allSalaryData = generateSalaryData();

export default function CompanySalaryPage() {
  const [month, setMonth] = useState("2025-01");

  // Filter data for selected month
  const filteredData = useMemo(
    () => allSalaryData.filter((row) => row.month === month),
    [month]
  );

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Salary Overview</h1>
      <p className="text-gray-600">
        Calculated from reported working time.
      </p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-600" />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
          min="2025-01"
          max="2025-10"
        />
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Worked Time</th>
              <th className="p-3 text-left">Monthly Salary</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.employeeId} className="border-t hover:bg-gray-50">
                <td className="px-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  {row.name}
                </td>
                <td className="px-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  {formatMinutes(row.totalMinutes)}
                </td>
                <td className="px-3 font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-teal-600" />
                  {row.monthlySalary} SEK
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
