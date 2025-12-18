"use client";
import { Wallet, User, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompanyMonthlySalary } from "@/app/actions";

/* ---------------- TYPES ---------------- */

type ContractType = "HOURLY" | "MONTHLY";
type SalaryStatus = "PENDING" | "PAID" | "REJECTED";

export type SalaryRow = {
  employeeId: string;
  name: string;
  contractType: ContractType;
  totalMinutes: number;
  hourlyRate?: number | null;
  monthlySalary?: number | null;
  salary: number;
  status: SalaryStatus;
};

/* ---------------- HELPERS ---------------- */

const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
};

const statusColors: Record<SalaryStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

/* ---------------- PAGE ---------------- */

export default function CompanySalaryPage() {
  // Get current year-month in "YYYY-MM" format
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [rows, setRows] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanyMonthlySalary(month)
      .then(setRows)
      .finally(() => setLoading(false));
  }, [month]);

  if (loading) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Calculating salaries...
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Salary Overview</h1>
      <p className="text-gray-600">
        Salaries calculated from reported working time.
      </p>

      {/* Month Selector */}
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
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Worked Time</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const totalHours = row.totalMinutes / 60;
              return (
                <tr key={row.employeeId} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    {row.name}
                  </td>
                  <td className="px-3 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {formatMinutes(row.totalMinutes)}
                  </td>
                  <td className="px-3 py-2 font-semibold flex flex-col">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-teal-600" />
                      {row.salary.toFixed(2)} SEK
                    </div>
                    {row.contractType === "HOURLY" && (
                      <span className="text-xs text-gray-500 ml-6">
                        {totalHours.toFixed(2)}h × {row.hourlyRate} SEK
                      </span>
                    )}
                    {row.contractType === "MONTHLY" && (
                      <span className="text-xs text-gray-500 ml-6">
                        Monthly salary
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No salary data for selected month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

