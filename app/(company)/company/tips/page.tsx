"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, Wallet } from "lucide-react";
import { getMonthlyTips, addDailyTip, getCompanyEmployees } from "@/app/actions";

type DailyTip = {
  date: string;
  totalTip: number;
  employees: { id: string; name: string; hours: number; loggedOutTime?: string; status: string }[];
};

type Employee = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: "Working" | "Off" | "On Break";
  companyId: string;
};

// ------------------- Month Selector -------------------
function MonthSelector({ month, setMonth, months }: { month: string; setMonth: (m: string) => void; months: string[] }) {
  return (
    <div className="bg-white p-4 rounded-xs shadow flex items-center gap-3 mb-4 border border-teal-100">
      <Calendar className="w-5 h-5 text-teal-600" />
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded-xs border-teal-100">
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}

// ------------------- Add Tip Form -------------------
function AddTipForm({ newDate, setNewDate, newAmount, setNewAmount, onAddTip }: { newDate: string; setNewDate: (d: string) => void; newAmount: string; setNewAmount: (a: string) => void; onAddTip: () => void }) {
  return (
    <div className="bg-white p-4 rounded-xs shadow flex flex-wrap gap-2 items-center border border-teal-100">
      <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border p-2 rounded-xs border-teal-100" />
      <input type="number" placeholder="Tip amount" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="border p-2 rounded-xs border-teal-100" />
      <button onClick={onAddTip} className="bg-teal-600 text-white px-4 py-2 rounded-xs hover:bg-teal-700 cursor-pointer">Add Tip</button>
    </div>
  );
}

// ------------------- Calendar -------------------
function TipsCalendar({ dailyTipsForMonth, daysInMonth }: { dailyTipsForMonth: DailyTip[]; daysInMonth: number }) {
  return (
    <div className="bg-white rounded-xs shadow p-4 shadow-teal-100">
      <h2 className="text-xl font-semibold mb-2">Calendar</h2>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0");
          const tipForDay = dailyTipsForMonth.find((t) => t.date.endsWith(`-${day}`));
          return (
            <div key={i} className="h-20 border border-teal-100 rounded p-2 flex flex-col justify-between bg-teal-50">
              <span className="font-semibold">{day}</span>
              {tipForDay && (
                <span className="text-sm flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-teal-600" /> {tipForDay.totalTip} SEK
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------- Daily Distribution -------------------
function DailyDistribution({ dailyTip }: { dailyTip: DailyTip }) {
  // Only include employees who worked and logged out
  const finishedEmployees = dailyTip.employees.filter(e => e.status === "Working" && e.loggedOutTime);
  if (!finishedEmployees.length) return null;

  const totalHours = finishedEmployees.reduce((acc, e) => acc + e.hours, 0);
  if (totalHours === 0) return null;

  const tipPerHour = dailyTip.totalTip / totalHours;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Tip Distribution for {dailyTip.date} (Total: {dailyTip.totalTip} SEK)</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {finishedEmployees.map(emp => {
          const tip = emp.hours * tipPerHour;
          return (
            <div key={emp.id} className="border rounded p-3 flex flex-col items-center bg-teal-50">
              <span className="font-semibold">{emp.name}</span>
              <span>Hours Worked: {emp.hours.toFixed(2)}</span>
              <span>Tip: {tip.toFixed(2)} SEK</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------- Main Component -------------------
export default function CompanyTipsPage() {
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, "0")}`);
  const currentMonth = `${currentYear}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`;

  const [month, setMonth] = useState(currentMonth);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);

  // ------------------- Load Data -------------------
  useEffect(() => {
    async function loadData() {
      try {
        const employees = await getCompanyEmployees();
        setEmployeesList(employees);

        if (!employees.length) return;
        const companyId = employees[0].companyId;
        if (!companyId) return;

        const data = await getMonthlyTips(companyId, month);
        const daily: DailyTip[] = data.tips.map((tip: any) => {
          const logsForDay = data.timeLogs.filter(
            (l: any) => l.logDate.toISOString().slice(0, 10) === tip.date.toISOString().slice(0, 10)
          );
          return {
            date: tip.date.toISOString().slice(0, 10),
            totalTip: tip.amount,
            employees: logsForDay.map((l: any) => ({
              id: l.employee.id,
              name: l.employee.name,
              hours: (l.totalMinutes ?? 0) / 60,
              loggedOutTime: l.loggedOutTime,
              status: l.employee.status,
            })),
          };
        });
        setDailyTips(daily);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [month]);

  // ------------------- Add Tip -------------------
  const addTipHandler = async () => {
    if (!newDate || !newAmount || !employeesList.length) return;
    const companyId = employeesList[0].companyId;
    if (!companyId) return;

    await addDailyTip({ date: newDate, amount: Number(newAmount) });
    setNewDate("");
    setNewAmount("");

    // reload daily tips
    const data = await getMonthlyTips(companyId, month);
    const daily: DailyTip[] = data.tips.map((tip: any) => {
      const logsForDay = data.timeLogs.filter(
        (l: any) => l.logDate.toISOString().slice(0, 10) === tip.date.toISOString().slice(0, 10)
      );
      return {
        date: tip.date.toISOString().slice(0, 10),
        totalTip: tip.amount,
        employees: logsForDay.map((l: any) => ({
          id: l.employee.id,
          name: l.employee.name,
          hours: (l.totalMinutes ?? 0) / 60,
          loggedOutTime: l.loggedOutTime,
          status: l.employee.status,
        })),
      };
    });
    setDailyTips(daily);
  };

  // ------------------- Derived Data -------------------
  const dailyTipsForMonth = useMemo(() => dailyTips.filter(t => t.date.startsWith(month)), [dailyTips, month]);
  const daysInMonth = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }, [month]);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Tips Management</h1>
      <p className="text-gray-600 mb-4">Add daily tips or see daily distribution. Tips are distributed based on hours worked.</p>

      <MonthSelector month={month} setMonth={setMonth} months={months} />

      <AddTipForm newDate={newDate} setNewDate={setNewDate} newAmount={newAmount} setNewAmount={setNewAmount} onAddTip={addTipHandler} />

      <div className="bg-white p-4 rounded-xs shadow shadow-teal-100 border border-teal-100 flex items-center gap-3">
        <Wallet className="w-5 h-5 text-teal-600" />
        <span className="font-semibold">Total Tips This Month: {dailyTipsForMonth.reduce((acc, t) => acc + t.totalTip, 0)} SEK</span>
      </div>

      <TipsCalendar dailyTipsForMonth={dailyTipsForMonth} daysInMonth={daysInMonth} />

      {/* Show tip distribution for all days */}
      {dailyTipsForMonth.map(dailyTip => (
        <DailyDistribution key={dailyTip.date} dailyTip={dailyTip} />
      ))}
    </div>
  );
}
