"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock, Wallet } from "lucide-react";

// Example individual employee
const employee = {
  name: "Anna Karlsson",
  monthlySalary: 30000,
};

// Months
const months = [
  "2025-01","2025-02","2025-03","2025-04","2025-05",
  "2025-06","2025-07","2025-08","2025-09","2025-10"
];

// Daily work type
type DailyWork = {
  date: string;
  loginTime: string;
  logoutTime: string;
};

export default function EmployeeSalaryPage() {
  const [month, setMonth] = useState("2025-12");
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);

  // Simulate fetching from DB with random login/logout times
  useEffect(() => {
    const [y, m] = month.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const data: DailyWork[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${month}-${i.toString().padStart(2, "0")}`;
      if (Math.random() < 0.3) { // 30% chance no work that day
        data.push({ date, loginTime: "", logoutTime: "" });
        continue;
      }
      const loginHour = 8 + Math.floor(Math.random() * 3); // 8-10 AM
      const logoutHour = loginHour + 4 + Math.floor(Math.random() * 5); // 4-8 hours later
      data.push({
        date,
        loginTime: `${loginHour.toString().padStart(2, "0")}:00`,
        logoutTime: `${logoutHour.toString().padStart(2, "0")}:00`,
      });
    }

    setDailyWork(data);
  }, [month]);

  // Calculate total hours
  const totalHours = useMemo(() => {
    return dailyWork.reduce((acc, d) => {
      if (!d.loginTime || !d.logoutTime) return acc;
      const [lh, lm] = d.loginTime.split(":").map(Number);
      const [oh, om] = d.logoutTime.split(":").map(Number);
      const hours = oh + om/60 - (lh + lm/60);
      return acc + hours;
    }, 0);
  }, [dailyWork]);

  // Salary (fixed for now)
  const salary = useMemo(() => employee.monthlySalary, [totalHours]);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{employee.name} - Logged Hours & Salary</h1>
      <p className="text-gray-600 mb-4">
        Monthly overview of login/logout times and salary.
      </p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <select value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Daily login/logout times */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Daily Login/Logout ({month})</h2>
        <div className="grid grid-cols-7 gap-1">
          {dailyWork.map((d, i) => (
            <div key={i} className="h-24 border rounded p-2 flex flex-col justify-between bg-yellow-50">
              <span className="font-semibold">{d.date.split("-")[2]}</span>
              {d.loginTime && d.logoutTime ? (
                <>
                  <span className="text-sm flex items-center gap-1">
                    Login: <Clock className="w-4 h-4 text-teal-600" /> {d.loginTime}
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    Logout: <Clock className="w-4 h-4 text-teal-600" /> {d.logoutTime}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No work</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 font-medium">
          <Clock className="w-5 h-5 text-teal-600" /> Total Hours: {totalHours.toFixed(2)}h
        </div>
        <div className="flex items-center gap-2 font-medium">
          <Wallet className="w-5 h-5 text-teal-600" /> Monthly Salary: {salary} SEK
        </div>
      </div>
    </div>
  );
}
