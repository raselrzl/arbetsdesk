"use client";

import { Wallet, User, Clock, Calendar } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getCompanySalaries, type SalaryRow } from "@/app/actions";

// ---------------- Helper ----------------
const formatMinutes = (min: number) => {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return `${hours}h ${minutes}m`;
};

// ---------------- Component ----------------
export default function CompanySalaryPage() {
  // Get current month in "YYYY-MM" format
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(currentMonth);

  const [salaryData, setSalaryData] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanySalaries()
      .then(setSalaryData)
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(
    () => salaryData.filter((row) => row.month === month),
    [salaryData, month]
  );

  if (loading)
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading salary data...
      </div>
    );

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Salary Overview</h1>
      <p className="text-gray-600">Calculated from reported working time.</p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-600" />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
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
                    {row.status}
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
