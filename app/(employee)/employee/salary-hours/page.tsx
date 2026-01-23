"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Wallet } from "lucide-react";
import {
  DailyWork,
  Employee,
  getEmployeeAvailableMonths,
  getEmployeeMonthlyData,
  getEmployeeCompanies,
} from "../employeeactions";

export default function EmployeeSalaryPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ companyId: string; companyName: string }[]>([]);
  const [month, setMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH COMPANIES ----------------
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const result = await getEmployeeCompanies();
        setCompanies(result);
        if (result.length) setCompanyId(result[0].companyId);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCompanies();
  }, []);

  // ---------------- FETCH AVAILABLE MONTHS ----------------
 useEffect(() => {
  if (!companyId) return;

  setLoading(true);
  setAvailableMonths([]);
  setMonth(""); // reset month immediately

  getEmployeeAvailableMonths(companyId)
    .then((months) => {
      // sort by year-month properly
      const sorted = months.sort((a, b) => a.localeCompare(b));
      setAvailableMonths(sorted);

      if (sorted.length) {
        setMonth(sorted[sorted.length - 1]); // set latest month
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [companyId]);


  // ---------------- FETCH EMPLOYEE MONTHLY DATA ----------------
  useEffect(() => {
    if (!companyId || !month) {
      setDailyWork([]);
      setEmployee(null);
      return;
    }

    setLoading(true);
    getEmployeeMonthlyData(month, companyId)
      .then(({ employee, dailyWork }) => {
        setEmployee(employee);
        setDailyWork(dailyWork);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [companyId, month]);

  // ---------------- CALCULATIONS ----------------
  const totalMinutes = useMemo(() => dailyWork.reduce((acc, d) => acc + d.totalMinutes, 0), [dailyWork]);
  const totalHours = (totalMinutes / 60).toFixed(2);

  const salary = useMemo(() => {
    if (!employee) return 0;
    if (employee.contractType === "HOURLY") return Math.round((totalMinutes / 60) * (employee.hourlyRate || 0));
    return employee.monthlySalary || 0;
  }, [employee, totalMinutes]);

  const formatTime = (time: Date | null) =>
    time ? new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—";

  // ---------------- RENDER ----------------
  return (
    <div className="p-4 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      <h1 className="text-xl font-bold uppercase text-teal-900">
        {employee?.name || "Employee"} - Logged Hours & Salary
      </h1>

      {/* Company selector */}
      {companies.length > 1 && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-teal-900 font-semibold">Company:</label>
          <select
            value={companyId || ""}
            onChange={(e) => setCompanyId(e.target.value)}
            className="border border-teal-100 p-2 rounded-xs"
          >
            {companies.map((c) => (
              <option key={c.companyId} value={c.companyId}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Month selector */}
      <div className="bg-white p-4 rounded-xs shadow border border-teal-100 shadow-teal-200 flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-teal-100 p-2 rounded-xs"
          disabled={loading || availableMonths.length === 0}
        >
          {availableMonths.length > 0 ? (
            availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))
          ) : (
            <option value="">No data</option>
          )}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          {/* Daily work table */}
          <div className="bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-teal-200 text-teal-900">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Login</th>
                  <th className="p-2 border">Logout</th>
                  <th className="p-2 border">Hours</th>
                </tr>
              </thead>
              <tbody>
                {dailyWork.length ? (
                  dailyWork.map((log, idx) => (
                    <tr key={`${log.date}-${idx}`} className="even:bg-gray-50">
                      <td className="p-2 border border-teal-100 font-medium">{log.date}</td>
                      <td className="p-2 border border-teal-100">{formatTime(log.loginTime)}</td>
                      <td className="p-2 border border-teal-100">{formatTime(log.logoutTime)}</td>
                      <td className="p-2 border text-right border-teal-100">
                        {(log.totalMinutes / 60).toFixed(2)} H
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-2 border text-center">
                      No work data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-teal-300 text-teal-900 rounded-xs p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-5 h-5 text-teal-600" /> Total Hours: {totalHours}h
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Wallet className="w-5 h-5 text-teal-600" /> Earned Salary: {salary}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
