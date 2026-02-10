"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, Wallet } from "lucide-react";
import {
  getMonthlyTips,
  addDailyTip,
  getCompanyEmployees,
  getAvailableTipMonths,
  saveMonthlyTipDistribution,
  getMonthlyTipStatus,
  getMonthlyFinalizedTips,
  payEmployeeMonthlyTip,
  rejectEmployeeMonthlyTip,
} from "@/app/actions";
import { DailyTipsChart } from "./DailyTipsChart";
import { EmployeeTipsChart } from "./EmployeeTipsChart";
import { MonthlyTipPivotTable } from "./MonthlyTipPivotTable";

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
    <div className="flex items-center gap-3 mb-4 rounded-xs border bg-[#00687a] text-gray-100 border-[#00687a]">
      <Calendar className="w-5 h-5 pl-2" />
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border px-2 h-10 text-sm border-[#00687a]"
      >
        {months.map((m) => (
          <option key={m} value={m} className="bg-[#00687a] text-gray-100">
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
    <div className="bg-white p-4 shadow flex flex-wrap gap-2 items-center border border-[#00687a] shadow-[#00687a]">
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="border p-2 rounded-xs border-[#00687a] text-[#00687a]"
      />
      <input
        type="number"
        placeholder="Tip amount"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
        className="border p-2 rounded-xs border-[#00687a] text-[#00687a]"
      />
      <button
        onClick={onAddTip}
        className="bg-[#00687a] text-white px-4 py-2 rounded-xs hover:bg-teal-700"
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
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const yearMonth = dailyTipsForMonth[0]?.date.slice(0, 7); // YYYY-MM

  return (
    <div className="bg-[#00687a] rounded-xs shadow p-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-100 uppercase">
        Tips Calendar
      </h2>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          const dateObj = new Date(`${yearMonth}-${day}`);
          const dayName = weekDays[dateObj.getDay()];

          const tipForDay = dailyTipsForMonth.find((t) =>
            t.date.endsWith(`-${day}`),
          );

          return (
            <div
              key={i}
              className="h-20 border border-teal-100 rounded p-2 flex flex-col justify-between bg-teal-50"
            >
              <span className="font-semibold text-sm">
                {dayName} {day}
              </span>

              {tipForDay && (
                <span className="text-sm flex items-center gap-1">
                  <img src="/icons/1.png" alt="Tip" className="w-4 h-4" />
                  {tipForDay.totalTip}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MONTHLY EMPLOYEE SUMMARY ---------------- */

function MonthlyEmployeeTipSummary({
  dailyTips,
  tipStatus,
  finalizedTips,
}: {
  dailyTips: DailyTip[];
  tipStatus: "DRAFT" | "FINALIZED" | "PAID";
  finalizedTips: Record<string, number>;
}) {
  const monthlyTotals = useMemo(() => {
    const acc: Record<string, { id: string; name: string; totalTip: number }> =
      {};

    for (const day of dailyTips) {
      const finished = day.employees.filter(
        (e) => e.loggedOutTime && e.hours > 0,
      );

      if (!finished.length) continue;

      const totalHours = finished.reduce((a, e) => a + e.hours, 0);
      if (totalHours === 0) continue;

      const tipPerHour = day.totalTip / totalHours;

      for (const emp of finished) {
        const tip = emp.hours * tipPerHour;

        if (!acc[emp.id]) {
          acc[emp.id] = {
            id: emp.id,
            name: emp.name,
            totalTip: 0,
          };
        }

        acc[emp.id].totalTip += tip;
      }
    }

    return Object.values(acc).sort((a, b) => b.totalTip - a.totalTip);
  }, [dailyTips]);

  // ✅ Move state here BEFORE any early return
  const [employeeStatus, setEmployeeStatus] = useState<
    Record<string, "FINALIZED" | "PAID" | "REJECTED">
  >({});

  // initialize employeeStatus whenever monthlyTotals or tipStatus changes
  useEffect(() => {
    const initial: Record<string, "FINALIZED" | "PAID" | "REJECTED"> = {};
    for (const emp of monthlyTotals) {
      initial[emp.id] = tipStatus === "PAID" ? "PAID" : "FINALIZED";
    }
    setEmployeeStatus(initial);
  }, [monthlyTotals, tipStatus]);

  if (!monthlyTotals.length) return null;

  const handleStatusChange = async (empId: string, status: "PAID" | "REJECTED") => {
    const confirmed = confirm(`Mark ${monthlyTotals.find(e => e.id === empId)?.name} as ${status}?`);
    if (!confirmed) return;

    try {
      const employees = await getCompanyEmployees();
      const companyId = employees[0].companyId;
      const month = dailyTips[0]?.date.slice(0, 7);
      if (!month) return;

      if (status === "PAID") {
        await payEmployeeMonthlyTip(empId, companyId, month, "admin-id");
      } else if (status === "REJECTED") {
        await rejectEmployeeMonthlyTip(empId, companyId, month, "admin-id");
      }

      setEmployeeStatus((prev) => ({ ...prev, [empId]: status }));
      alert(`Employee tip marked as ${status}`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-xs w-full">
      <h2 className="text-xl font-bold mb-3 text-[#00687a] uppercase">
        Monthly Tip Distribution (Per Employee)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-gray-100">
        {monthlyTotals.map((emp) => (
          <div
            key={emp.id}
            className="p-4 bg-[#00687a] flex flex-col items-center"
          >
            <span className="font-semibold uppercase">{emp.name}</span>
            <span className="text-lg font-bold text-gray-100">
              {emp.totalTip.toFixed(2)}
            </span>

            {(tipStatus === "FINALIZED" || tipStatus === "PAID") && (
              <>
                <span className="text-sm mt-1">
                  Finalized: {finalizedTips[emp.id]?.toFixed(2) || 0}
                </span>

                <select
                  value={employeeStatus[emp.id] || "FINALIZED"}
                  onChange={(e) =>
                    handleStatusChange(emp.id, e.target.value as "PAID" | "REJECTED")
                  }
                  className="mt-2 p-1 text-sm rounded-xs border border-teal-300 text-gray-800 bg-gray-100"
                >
                  <option value="FINALIZED" disabled className="bg-teal-200">
                    Finalized
                  </option>
                  <option value="PAID" className="bg-teal-200">PAID</option>
                  <option value="REJECTED" className="bg-teal-200">REJECTED</option>
                </select>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



function TipStatusBadge({
  status,
}: {
  status: "DRAFT" | "FINALIZED" | "PAID";
}) {
  const styles = {
    DRAFT: "bg-gray-200 text-gray-700",
    FINALIZED: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
  };

  const labels = {
    DRAFT: "Not finalized",
    FINALIZED: "Not paid",
    PAID: "Paid",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold uppercase rounded-full ${styles[status]}`}
    >
      {labels[status]}
    </span>
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
  const [tipStatus, setTipStatus] = useState<"DRAFT" | "FINALIZED" | "PAID">(
    "DRAFT",
  );

  const [finalizedTips, setFinalizedTips] = useState<Record<string, number>>(
    {},
  );

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
            tip.date.toISOString().slice(0, 10),
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
                    name: log.employee.person.name,
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
              }, {}),
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

    try {
      await addDailyTip({
        date: newDate,
        amount: Number(newAmount),
      });

      alert("Tip added successfully!"); // ✅ show success alert

      // Clear input fields
      setNewDate("");
      setNewAmount("");

      // Refetch tips for the current month
      if (!month) return;

      const employees = await getCompanyEmployees();
      setEmployeesList(employees);
      if (!employees.length) return;

      const companyId = employees[0].companyId;
      const data = await getMonthlyTips(companyId, month);

      const daily: DailyTip[] = data.tips.map((tip: any) => {
        const logsForDay = data.timeLogs.filter(
          (l: any) =>
            l.logDate.toISOString().slice(0, 10) ===
            tip.date.toISOString().slice(0, 10),
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
              }, {}),
          ),
        };
      });

      setDailyTips(daily); // ✅ update calendar
    } catch (error) {
      console.error(error);
      alert("Failed to add tip. Please try again.");
    }
  };

  /* -------- Derived -------- */
  const dailyTipsForMonth = useMemo(
    () => dailyTips.filter((t) => t.date.startsWith(month)),
    [dailyTips, month],
  );

  const daysInMonth = useMemo(() => {
    if (!month) return 0;
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }, [month]);

  useEffect(() => {
    if (!month || !employeesList.length) return;

    async function loadStatus() {
      const companyId = employeesList[0].companyId;
      const res = await getMonthlyTipStatus(companyId, month);
      setTipStatus(res.status as "DRAFT" | "FINALIZED" | "PAID");
    }

    loadStatus();
  }, [month, employeesList]);

  useEffect(() => {
    if (tipStatus === "FINALIZED" || tipStatus === "PAID") {
      const loadFinalizedTips = async () => {
        const employees = await getCompanyEmployees();
        const companyId = employees[0].companyId;
        const data = await getMonthlyFinalizedTips(companyId, month);
        setFinalizedTips(data);
      };
      loadFinalizedTips();
    }
  }, [month, tipStatus]);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#00687a] uppercase">
          Tips Distribution
        </h1>

        <div className="flex gap-3">
          <a
            href="/company/analysis"
            className="px-4 py-2 text-sm font-medium border border-[#00687a] text-[#00687a] rounded-xs hover:bg-teal-50"
          >
            Analysis ➠
          </a>

          <a
            href="/company/additionalcost"
            className="px-4 py-2 text-sm font-medium border border-[#00687a] text-[#00687a] rounded-xs hover:bg-teal-50"
          >
            Cost ➠
          </a>

          <a
            href="/company/sales"
            className="px-4 py-2 text-sm font-medium border border-[#00687a] text-[#00687a] rounded-xs hover:bg-teal-50"
          >
            Sales ➠
          </a>
        </div>
      </div>

      <AddTipForm
        newDate={newDate}
        setNewDate={setNewDate}
        newAmount={newAmount}
        setNewAmount={setNewAmount}
        onAddTip={addTipHandler}
      />

      <div className="flex flex-col bg-white text-[#00687a] p-4 rounded-xs shadow shadow-[#00687a] gap-3 border border-[#00687a]">
        <div className="flex gap-2 text-3xl mb-10 text-[#00687a] justify-between">
          <span className="font-semibold uppercase">
            Total Amount:{" "}
            {dailyTipsForMonth.reduce((a, b) => a + b.totalTip, 0)}{" "}
          </span>

          <div className="flex items-center gap-3">
            <MonthSelector month={month} setMonth={setMonth} months={months} />
            <TipStatusBadge status={tipStatus} />
          </div>

          <button
            onClick={async () => {
              if (
                !confirm(
                  `Finalize tips for ${month}?\nThis will lock the distribution and prevent changes.`,
                )
              ) {
                return;
              }

              try {
                const employees = await getCompanyEmployees();
                const companyId = employees[0].companyId;

                await saveMonthlyTipDistribution(companyId, month);

                // ✅ Update the status in the UI
                setTipStatus("FINALIZED");

                alert("Monthly tips finalized and locked successfully!");
              } catch (e: any) {
                alert(e.message);
              }
            }}
            className="
    h-10 px-5
    flex items-center gap-2
    bg-linear-to-r from-emerald-600 to-green-600
    text-white text-sm font-semibold uppercase
    rounded-xs
    shadow-md shadow-green-600/30
    hover:from-emerald-700 hover:to-green-700
    hover:shadow-lg hover:shadow-green-600/40
    transition-all duration-200
    active:scale-95
  "
          >
            <Wallet className="w-4 h-4" />
            Finalize Tips
          </button>
        </div>
        <MonthlyEmployeeTipSummary
          dailyTips={dailyTipsForMonth}
          tipStatus={tipStatus}
          finalizedTips={finalizedTips}
        />
      </div>

      <MonthlyTipPivotTable dailyTips={dailyTipsForMonth} />
      <TipsCalendar
        dailyTipsForMonth={dailyTipsForMonth}
        daysInMonth={daysInMonth}
      />
      <DailyTipsChart dailyTips={dailyTipsForMonth} />

      <EmployeeTipsChart dailyTips={dailyTipsForMonth} />
    </div>
  );
}
