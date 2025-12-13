"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, Wallet } from "lucide-react";

type DailyTip = {
  date: string;
  totalTip: number;
  employees: { name: string; hours: number }[];
};

// Employees
const employees = [
  "Anna Karlsson",
  "Erik Svensson",
  "Johan Nilsson",
  "Maria Andersson",
  "Sara Johansson",
];

// Months
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

export default function CompanyTipsPage() {
  const [month, setMonth] = useState("2025-01");
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);

  const [newDate, setNewDate] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // Random tips simulation for 1-2 months
  useEffect(() => {
    const tips: DailyTip[] = [];
    const randomMonths = months.sort(() => 0.5 - Math.random()).slice(0, 2);

    randomMonths.forEach((m) => {
      const daysInMonth = 28 + Math.floor(Math.random() * 3);
      for (let i = 1; i <= daysInMonth; i++) {
        if (Math.random() < 0.3) continue; // 30% chance no tip
        const day = i.toString().padStart(2, "0");
        const numEmployees = 1 + Math.floor(Math.random() * 3);
        const selectedEmployees = [...employees]
          .sort(() => 0.5 - Math.random())
          .slice(0, numEmployees);
        const employeesWithHours = selectedEmployees.map((name) => ({
          name,
          hours: 4 + Math.floor(Math.random() * 5),
        }));

        tips.push({
          date: `${m}-${day}`,
          totalTip: 200 + Math.floor(Math.random() * 800),
          employees: employeesWithHours,
        });
      }
    });

    setDailyTips(tips);
  }, []);

  // Add tip manually
  const addTip = () => {
    if (!newDate || !newAmount) return;
    const employeesForTip = employees.map((name) => ({ name, hours: 8 })); // default 8 hours for simplicity
    setDailyTips((prev) => [
      ...prev,
      {
        date: newDate,
        totalTip: Number(newAmount),
        employees: employeesForTip,
      },
    ]);
    setNewDate("");
    setNewAmount("");
  };

  // Filter for current month
  const dailyTipsForMonth = useMemo(
    () => dailyTips.filter((t) => t.date.startsWith(month)),
    [dailyTips, month]
  );

  // Monthly total per employee
  const monthlyEmployeeTips = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => (map[e] = 0));

    dailyTipsForMonth.forEach((day) => {
      const totalHours = day.employees.reduce((acc, e) => acc + e.hours, 0);
      const tipPerHour = day.totalTip / totalHours;
      day.employees.forEach((e) => {
        map[e.name] += e.hours * tipPerHour;
      });
    });

    return map;
  }, [dailyTipsForMonth]);

  // Calendar days
  const daysInMonth = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }, [month]);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Tips Management</h1>
      <p className="text-gray-600 mb-4">
        Add daily tips or see monthly distribution. Tips are distributed based
        on hours worked.
      </p>

      {/* Month selector */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-teal-600" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Add daily tip */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-2 items-center">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Tip amount"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addTip}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add Tip
        </button>
      </div>

      {/* Total Tips */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Wallet className="w-5 h-5 text-teal-600" />
        <span className="font-semibold">
          Total Tips This Month:{" "}
          {dailyTipsForMonth.reduce((acc, t) => acc + t.totalTip, 0)} SEK
        </span>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Calendar ({month})</h2>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = (i + 1).toString().padStart(2, "0");
            const tipForDay = dailyTipsForMonth.find((t) =>
              t.date.endsWith(`-${day}`)
            );
            return (
              <div
                key={i}
                className="h-20 border rounded p-2 flex flex-col justify-between bg-yellow-50"
              >
                <span className="font-semibold">{day}</span>
                {tipForDay && (
                  <span className="text-sm flex items-center gap-1">
                    <Wallet className="w-4 h-4 text-teal-600" />{" "}
                    {tipForDay.totalTip} SEK
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Monthly Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {employees.map((name) => (
            <div
              key={name}
              className="border rounded p-3 flex flex-col items-center bg-teal-50"
            >
              <span className="font-semibold">{name}</span>
              <span className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-teal-600" />{" "}
                {Math.floor(monthlyEmployeeTips[name])} SEK
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
