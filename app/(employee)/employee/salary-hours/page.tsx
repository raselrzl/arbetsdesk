"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Wallet } from "lucide-react";
import {
  DailyWork,
  Employee,
  getEmployeeAvailableMonths,
  getEmployeeMonthlyData,
} from "../employeeactions";

const months = [
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
  "2025-06",
  "2025-07",
  "2025-08",
  "2025-09",
  "2025-10",
];

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
        if (months.length) setMonth(months[0]); // select first available month by default
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
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">
        {employee?.name} - Logged Hours & Salary
      </h1>
      <p className="text-gray-600 mb-4">
        Monthly overview of login/logout times and salary.
      </p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
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
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-2">
              Daily Login/Logout ({month})
            </h2>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, "0");
                const dateKey = `${month}-${day}`;
                const logs = dailyWork.filter((d) => d.date === dateKey);

                return (
                  <div
                    key={i}
                    className={`h-24 border rounded p-1 flex flex-col justify-between items-center ${
                      logs.length ? "bg-yellow-50" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold">{day}</span>
                    {logs.length ? (
                      logs.map((log, idx) => (
                        <div
                          key={idx}
                          className="text-sm flex flex-col items-center"
                        >
                          <span className="flex items-center gap-1">
                            Login: <Clock className="w-4 h-4 text-teal-600" />{" "}
                            {formatTime(log.loginTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            Logout: <Clock className="w-4 h-4 text-teal-600" />{" "}
                            {formatTime(log.logoutTime)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {(log.totalMinutes / 60).toFixed(2)} h
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No work</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-5 h-5 text-teal-600" /> Total Hours:{" "}
              {totalHours}h
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Wallet className="w-5 h-5 text-teal-600" /> Monthly Salary:{" "}
              {salary}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
