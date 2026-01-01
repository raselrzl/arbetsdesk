"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, Wallet } from "lucide-react";
import {
  getMonthlyTips,
  addDailyTip,
  getCompanyEmployees,
  getAvailableTipMonths,
} from "@/app/actions";

/* ---------------- TYPES ---------------- */

type DailyTip = {
  date: string;
  totalTip: number;
  employees: {
    id: string;
    name: string;
    hours: number;
    loggedOutTime?: string;
    status: string;
  }[];
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

/* ---------------- MONTH SELECTOR ---------------- */

function MonthSelector({
  month,
  setMonth,
  months,
}: {
  month: string;
  setMonth: (m: string) => void;
  months: string[];
}) {
  if (!months.length) return null;

  return (
    <div className="bg-white p-4 rounded-xs shadow flex items-center gap-3 mb-4 border border-teal-100">
      <Calendar className="w-5 h-5 text-teal-600" />
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded-xs border-teal-100"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- ADD TIP FORM ---------------- */

function AddTipForm({
  newDate,
  setNewDate,
  newAmount,
  setNewAmount,
  onAddTip,
}: {
  newDate: string;
  setNewDate: (d: string) => void;
  newAmount: string;
  setNewAmount: (a: string) => void;
  onAddTip: () => void;
}) {
  return (
    <div className="bg-white p-4 rounded-xs shadow flex flex-wrap gap-2 items-center border border-teal-100">
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="border p-2 rounded-xs border-teal-100"
      />
      <input
        type="number"
        placeholder="Tip amount"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
        className="border p-2 rounded-xs border-teal-100"
      />
      <button
        onClick={onAddTip}
        className="bg-teal-600 text-white px-4 py-2 rounded-xs hover:bg-teal-700"
      >
        Add Tip
      </button>
    </div>
  );
}

/* ---------------- CALENDAR ---------------- */

function TipsCalendar({
  dailyTipsForMonth,
  daysInMonth,
}: {
  dailyTipsForMonth: DailyTip[];
  daysInMonth: number;
}) {
  return (
    <div className="bg-white rounded-xs shadow p-4 border border-teal-100">
      <h2 className="text-xl font-semibold mb-2">Calendar</h2>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          const tipForDay = dailyTipsForMonth.find((t) =>
            t.date.endsWith(`-${day}`)
          );

          return (
            <div
              key={i}
              className="h-20 border border-teal-100 rounded p-2 flex flex-col justify-between bg-teal-50"
            >
              <span className="font-semibold">{day}</span>
              {tipForDay && (
                <span className="text-sm flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-teal-600" />
                  {tipForDay.totalTip} SEK
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- DAILY DISTRIBUTION ---------------- */

function DailyDistribution({ dailyTip }: { dailyTip: DailyTip }) {
  const finishedEmployees = dailyTip.employees.filter(
    (e) => e.loggedOutTime && e.hours > 0
  );

  if (!finishedEmployees.length) return null;

  const totalHours = finishedEmployees.reduce((acc, e) => acc + e.hours, 0);

  const tipPerHour = dailyTip.totalTip / totalHours;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-teal-100">
      <h2 className="text-xl font-semibold mb-2">
        Tip Distribution – {dailyTip.date}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {finishedEmployees.map((emp) => (
          <div
            key={emp.id}
            className="border rounded p-3 flex flex-col items-center bg-teal-50"
          >
            <span className="font-semibold">{emp.name}</span>
            <span>Hours: {emp.hours.toFixed(2)}</span>
            <span>Tip: {(emp.hours * tipPerHour).toFixed(2)} SEK</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function CompanyTipsPage() {
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState("");
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newAmount, setNewAmount] = useState("");

  /* -------- Load available months -------- */
  useEffect(() => {
    async function loadMonths() {
      const availableMonths = await getAvailableTipMonths();
      setMonths(availableMonths);
      if (availableMonths.length) {
        setMonth(availableMonths[0]); // latest month
      }
    }
    loadMonths();
  }, []);

  /* -------- Load tips for selected month -------- */
  useEffect(() => {
    if (!month) return;

    async function loadData() {
      const employees = await getCompanyEmployees();
      setEmployeesList(employees);
      if (!employees.length) return;

      const companyId = employees[0].companyId;
      const data = await getMonthlyTips(companyId, month);

      const daily: DailyTip[] = data.tips.map((tip: any) => {
        const logsForDay = data.timeLogs.filter(
          (l: any) =>
            l.logDate.toISOString().slice(0, 10) ===
            tip.date.toISOString().slice(0, 10)
        );

        return {
          date: tip.date.toISOString().slice(0, 10),
          totalTip: tip.amount,
          employees: Object.values(
            logsForDay
              .filter((l: any) => l.logoutTime && l.totalMinutes)
              .reduce((acc: any, log: any) => {
                const empId = log.employee.id;

                if (!acc[empId]) {
                  acc[empId] = {
                    id: empId,
                    name: log.employee.name,
                    hours: 0,
                    loggedOutTime: log.logoutTime,
                    status: log.employee.status,
                  };
                }

                acc[empId].hours += log.totalMinutes / 60;

                // keep latest logout time
                if (acc[empId].loggedOutTime < log.logoutTime) {
                  acc[empId].loggedOutTime = log.logoutTime;
                }

                return acc;
              }, {})
          ),
        };
      });

      setDailyTips(daily);
    }

    loadData();
  }, [month]);

  /* -------- Add tip -------- */
  const addTipHandler = async () => {
    if (!newDate || !newAmount) return;
    await addDailyTip({
      date: newDate,
      amount: Number(newAmount),
    });
    setNewDate("");
    setNewAmount("");
    setMonth((m) => m); // trigger reload
  };

  /* -------- Derived -------- */
  const dailyTipsForMonth = useMemo(
    () => dailyTips.filter((t) => t.date.startsWith(month)),
    [dailyTips, month]
  );

  const daysInMonth = useMemo(() => {
    if (!month) return 0;
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }, [month]);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Tips Management</h1>

      <MonthSelector month={month} setMonth={setMonth} months={months} />

      <AddTipForm
        newDate={newDate}
        setNewDate={setNewDate}
        newAmount={newAmount}
        setNewAmount={setNewAmount}
        onAddTip={addTipHandler}
      />

      <div className="bg-white p-4 rounded-xs shadow border border-teal-100 flex items-center gap-3">
        <Wallet className="w-5 h-5 text-teal-600" />
        <span className="font-semibold">
          Total Tips: {dailyTipsForMonth.reduce((a, b) => a + b.totalTip, 0)}{" "}
          SEK
        </span>
      </div>

      <TipsCalendar
        dailyTipsForMonth={dailyTipsForMonth}
        daysInMonth={daysInMonth}
      />

      {dailyTipsForMonth.map((d) => (
        <DailyDistribution key={d.date} dailyTip={d} />
      ))}
    </div>
  );
}
