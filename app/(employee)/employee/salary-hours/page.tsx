"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Wallet } from "lucide-react";
import {
  DailyWork,
  Employee,
  getEmployeeAvailableMonths,
  getEmployeeMonthlyData,
} from "../employeeactions";

export default function EmployeeSalaryPage() {
  const [month, setMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch available months on mount
  useEffect(() => {
    async function fetchMonths() {
      setLoading(true);
      try {
        const months = await getEmployeeAvailableMonths();
        setAvailableMonths(months);
        if (months.length) {
          const sortedMonths = months.sort();
          setMonth(sortedMonths[sortedMonths.length - 1]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMonths();
  }, []);

  // Fetch employee & dailyWork whenever month changes
  useEffect(() => {
    if (!month) return;
    setLoading(true);
    getEmployeeMonthlyData(month)
      .then(({ employee, dailyWork }) => {
        setEmployee(employee);
        setDailyWork(dailyWork);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month]);

  const totalMinutes = useMemo(
    () => dailyWork.reduce((acc, d) => acc + d.totalMinutes, 0),
    [dailyWork]
  );
  const totalHours = (totalMinutes / 60).toFixed(2);

  const salary = useMemo(() => {
    if (!employee) return 0;
    if (employee.contractType === "HOURLY")
      return Math.round((totalMinutes / 60) * (employee.hourlyRate || 0));
    return employee.monthlySalary || 0;
  }, [employee, totalMinutes]);

  const daysInMonth = new Date(
    Number(month.split("-")[0]),
    Number(month.split("-")[1]),
    0
  ).getDate();

  const formatTime = (time: Date | null) =>
    time
      ? new Date(time).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="p-4 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      <h1 className="text-xl font-bold uppercase text-teal-900">
        {employee?.name} - Logged Hours & Salary So far
      </h1>
      <p className="text-teal-400 mb-4 text-sm">
        Monthly overview of login/logout times and estimated salary.
      </p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded-xs shadow border border-teal-100 shadow-teal-200 flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-teal-100 p-2 rounded-xs"
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
          <div className="bg-white overflow-x-auto">
            {/*   <h2 className="text-xl font-semibold mb-2 uppercase text-white rounded-xs bg-green-600 p-1">
              Daily Login/Logout ({month})
            </h2> */}
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
                {dailyWork.length > 0 ? (
                  dailyWork.map((log, idx) => (
                    <tr key={`${log.date}-${idx}`} className="even:bg-gray-50">
                      <td className="p-2 border border-teal-100 font-medium">
                        {log.date}
                      </td>
                      <td className="p-2 border border-teal-100">
                        {formatTime(log.loginTime) || "—"}
                      </td>
                      <td className="p-2 border border-teal-100">
                        {formatTime(log.logoutTime) || "—"}
                      </td>
                      <td className="p-2 border text-right border-teal-100">
                        {(log.totalMinutes / 60).toFixed(2)} H
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border text-center" colSpan={4}>
                      No work data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-teal-300 text-teal-900 rounded-xs p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-5 h-5 text-teal-600" /> Total Hours:{" "}
              {totalHours}h
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Wallet className="w-5 h-5 text-teal-600" /> Earned Salary:{" "}
              {salary}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
