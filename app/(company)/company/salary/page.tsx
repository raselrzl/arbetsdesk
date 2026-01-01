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

/* ---------------- COMPONENT ---------------- */

export default function CompanySalaryPage() {
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

  // Totals
  const totalMinutes = rows.reduce(
    (acc, row) => acc + (row.totalMinutes || 0),
    0
  );
  const totalSalary = rows.reduce((acc, row) => acc + (row.salary || 0), 0);

  if (loading) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Calculating salaries...
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold uppercase">Salary Overview</h1>
      <p className="text-gray-600">
        View all employee salaries calculated from reported working hours. Track monthly earnings, contract types, and payment status at a glance.
      </p>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded-xs shadow border border-teal-100 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-600" />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded-xs border-teal-100"
        />
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xs shadow border border-teal-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-teal-100">
            <tr>
              <th className="p-3 text-left">Employee Name</th>
              <th className="p-3 text-left">Worked Hours</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Contract Type</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const hours = row.totalMinutes / 60;
              return (
                <tr
                  key={row.employeeId}
                  className="border-t border-teal-100 hover:bg-teal-50"
                >
                  {/* Employee Name */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-600" />
                      <span>{row.name}</span>
                    </div>
                  </td>

                  {/* Worked Hours */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{formatMinutes(row.totalMinutes)}</span>
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="p-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <Wallet className="w-4 h-4 text-teal-600" />
                      <span>{row.salary.toFixed(2)} </span>
                    </div>
                    {row.contractType === "HOURLY" && row.hourlyRate && (
                      <div className="text-xs text-gray-500 ml-6">
                        {hours.toFixed(2)}h × {row.hourlyRate} 
                      </div>
                    )}
                    {row.contractType === "MONTHLY" && (
                      <div className="text-xs text-gray-500 ml-6">
                        Monthly Salary
                      </div>
                    )}
                  </td>

                  {/* Contract Type */}
                  <td className="p-3">{row.contractType}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-xs text-xs font-medium ${
                        statusColors[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
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
