"use client";

import { getCompanyMonthlySalary, SalaryRow } from "@/app/actions";
import { Wallet, User, Clock, Calendar, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
type ContractType = "HOURLY" | "MONTHLY";
type SalaryStatus = "PENDING" | "PAID" | "REJECTED" | "DRAFT" | "APPROVED";

/* ---------------- HELPERS ---------------- */
const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
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

  const [year, monthNumber] = month.split("-").map(Number);
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  /* ---------------- FETCH SALARIES ---------------- */
  useEffect(() => {
    if (!month) return;

    setLoading(true);
    getCompanyMonthlySalary(month)
      .then((data) => {
        // Use backend salary directly
        setRows(data);
      })
      .finally(() => setLoading(false));
  }, [month]);

  /* ---------------- TOTALS ---------------- */
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
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      {/* ---------------- MONTH SELECTOR ---------------- */}
      <div className="p-4 shadow border border-[#02505e] bg-[#02505e] flex items-center gap-3 justify-between text-gray-100">
        <h1 className="text-xl font-bold uppercase">Salary Overview</h1>
        <div className="flex items-center bg-[#02505e] text-gray-100">
          <Calendar className="w-5 h-5 text-gray-100" />
          {availableMonths.length > 0 ? (
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded-xs border-teal-100"
            >
              {availableMonths.map((m) => (
                <option
                  key={m}
                  value={m}
                  className="bg-teal-100 text-[#02505e]"
                >
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-gray-500">No salary data available</span>
          )}
        </div>
      </div>

      {/* ---------------- SALARY TABLE ---------------- */}
      <div className="bg-white rounded-xs shadow border border-[#02505e] overflow-x-auto">
        <table className="w-full text-sm min-w-[600px] table-fixed">
          <tbody>
            {rows.map((row) => {
              const hours = row.totalMinutes / 60;
              return (
                <tr
                  key={row.employeeId}
                  className="border-t border-[#02505e] hover:bg-teal-50"
                >
                  {/* Employee Name */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-600" />
                      <span>{row.name}</span>
                    </div>
                  </td>

                  {/* Personal Number */}
                  <td className="p-3">{row.personalNumber}</td>

                  {/* Job Title */}
                  <td className="p-3">{row.jobTitle}</td>

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
                        {hours.toFixed(6)}h × {row.hourlyRate}
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

                  {/* View Details */}
                  <td className="p-3">
                    <button
                      onClick={() =>
                        (window.location.href = `/company/salary/${row.personalNumber}?month=${monthNumber}&year=${year}`)
                      }
                      className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700 text-xs"
                    >
                      Create Salary
                    </button>
                  </td>

                  <td className="relative">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenRowId(
                            openRowId === row.employeeId
                              ? null
                              : row.employeeId,
                          )
                        }
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openRowId === row.employeeId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-xs z-50">
                          <ul className="flex flex-col">
                            <li>
                              <a
                                href={`/company/salary/salary-slip/${row.employeeId}?month=${monthNumber}&year=${year}`}
                                className="px-4 py-2 text-sm hover:bg-gray-100 block"
                              >
                                View Salary Slip
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/company/salary/salary-slip/download/${row.employeeId}?month=${monthNumber}&year=${year}`}
                                className="px-4 py-2 text-sm hover:bg-gray-100 block"
                              >
                                Download Slip
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/company/salary/salary-slip/send-email/${row.employeeId}?month=${monthNumber}&year=${year}`}
                                className="px-4 py-2 text-sm hover:bg-gray-100 block"
                              >
                                Send Slip to Email
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/company/salary/salary-slip/update/${row.employeeId}?month=${monthNumber}&year=${year}`}
                                className="px-4 py-2 text-sm hover:bg-gray-100 block"
                              >
                                Update Slip
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/company/salary/salary-slip/send-employee/${row.employeeId}?month=${monthNumber}&year=${year}`}
                                className="px-4 py-2 text-sm hover:bg-gray-100 block"
                              >
                                Send to Employee
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* ---------------- TOTALS ROW ---------------- */}
          {rows.length > 0 && (
            <tfoot className="bg-teal-50 font-semibold">
              <tr>
                <td className="p-3">Totals</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3">{formatMinutes(totalMinutes)}</td>
                <td className="p-3">{totalSalary.toFixed(2)}</td>
                <td className="p-3"></td>
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
