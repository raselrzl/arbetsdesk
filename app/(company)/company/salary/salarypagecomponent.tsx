"use client";

import { getCompanyMonthlySalary } from "@/app/actions";
import { Wallet, User, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
type ContractType = "HOURLY" | "MONTHLY";
type SalaryStatus = "PENDING" | "PAID" | "REJECTED" | "DRAFT" | "APPROVED";

export type SalaryRow = {
  employeeId: string;
  name: string;
  personalNumber: string | null;
  jobTitle: string | null;
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
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  PAID: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
};

/* ---------------- PROPS ---------------- */
interface Props {
  availableMonths: string[];
  defaultMonth: string;
}

/* ---------------- COMPONENT ---------------- */
export default function CompanySalaryPageComponent({
  availableMonths,
  defaultMonth,
}: Props) {
  const [month, setMonth] = useState(defaultMonth);
  const [rows, setRows] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch salary rows whenever month changes
  useEffect(() => {
    if (!month) return;

    setLoading(true);
    getCompanyMonthlySalary(month)
      .then(setRows)
      .finally(() => setLoading(false));
  }, [month]);

  // Totals (optional, can display elsewhere if needed)
  const totalMinutes = rows.reduce(
    (acc, row) => acc + (row.totalMinutes || 0),
    0,
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
        View all employee salaries calculated from reported working hours. Track
        monthly earnings, contract types, and payment status at a glance.
      </p>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded-xs shadow border border-teal-100 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-teal-600" />
        {availableMonths.length > 0 ? (
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-xs border-teal-100"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-gray-500">No salary data available</span>
        )}
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xs shadow border border-teal-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px] table-fixed">
       {/*    <thead className="bg-teal-100">
            <tr>
              <th className="p-3 text-left w-1/4">EName</th>
              <th className="p-3 text-left w-1/4">Id</th>
              <th className="p-3 text-left w-1/4">Designation</th>
              <th className="p-3 text-left w-1/5">Worked Hours</th>
              <th className="p-3 text-left w-1/5">Salary</th>
              <th className="p-3 text-left w-1/5">Contract Type</th>
              <th className="p-3 text-left w-1/5">View Log</th>
            </tr>
          </thead> */}

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

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{row.personalNumber}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{row.jobTitle}</span>
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
                      <span>{row.salary.toFixed(2)}</span>
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
                   {/*  <span
                      className={`px-2 py-1 rounded-xs text-xs font-medium ${
                        statusColors[row.status]
                      }`}
                    >
                      {row.status}
                    </span> */}
                    <button
                        onClick={() =>
                          (window.location.href = `/company/salary/${row.personalNumber}`)
                        }
                        className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700 text-xs"
                      >
                        View Details
                      </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Optional: Totals row */}
          {rows.length > 0 && (
            <tfoot className="bg-teal-50 font-semibold">
              <tr>
                <td className="p-3">Totals</td>
                <td className="p-3">{formatMinutes(totalMinutes)}</td>
                <td className="p-3">{totalSalary.toFixed(2)}</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
