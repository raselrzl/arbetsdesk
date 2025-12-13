"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- TYPES ---------------- */

type SalaryType = "HOURLY" | "MONTHLY";

type EmployeeTime = {
  name: string;
  status: "Working" | "Not working";
  startTime: string;
  endTime: string;
  costCenter: string;
  salaryType: SalaryType;
  hourlyRate?: number;
  monthlySalary?: number;
};

type DayReport = {
  date: string;
  employees: EmployeeTime[];
};

/* ---------------- HELPERS ---------------- */

function minutesBetween(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
}

function formatMinutes(min: number) {
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

const names = [
  "Anna Karlsson",
  "Erik Svensson",
  "Johan Nilsson",
  "Maria Andersson",
  "Sara Johansson",
];

/* ---------------- PAGE ---------------- */

export default function CompanyTimePage() {
  const [, forceTick] = useState(0);

  /* FILTER STATES */
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "Working" | "Not working">("ALL");
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => forceTick(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  /* MOCK 30 DAYS */
  const reports: DayReport[] = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000)
          .toISOString()
          .slice(0, 10),
        employees: names.map((name, idx) => {
          const working = Math.random() > 0.25;
          const salaryType: SalaryType =
            Math.random() > 0.5 ? "MONTHLY" : "HOURLY";

          const startHour = 8 + Math.floor(Math.random() * 2);
          const endHour = startHour + 7 + Math.floor(Math.random() * 2);

          return {
            name,
            status: working ? "Working" : "Not working",
            startTime: `${startHour}:00`,
            endTime: `${endHour}:00`,
            costCenter: `CC-${200 + idx}`,
            salaryType,
            hourlyRate: salaryType === "HOURLY" ? 155 : undefined,
            monthlySalary: salaryType === "MONTHLY" ? 29000 : undefined,
          };
        }),
      })),
    []
  );

  /* APPLY FILTERS */
  const filteredReports = useMemo(() => {
    return reports
      .filter((day) => {
        if (singleDate && day.date !== singleDate) return false;
        if (fromDate && day.date < fromDate) return false;
        if (toDate && day.date > toDate) return false;
        return true;
      })
      .map((day) => ({
        ...day,
        employees: day.employees.filter((e) => {
          if (
            nameFilter &&
            !e.name.toLowerCase().includes(nameFilter.toLowerCase())
          )
            return false;
          if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
          return true;
        }),
      }))
      .filter((d) => d.employees.length > 0);
  }, [reports, nameFilter, statusFilter, singleDate, fromDate, toDate]);

  /* MONTH TOTALS */
  const monthTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredReports.forEach((day) =>
      day.employees.forEach((emp) => {
        if (emp.status !== "Working") return;
        const minutes = minutesBetween(emp.startTime, emp.endTime);
        totals[emp.name] = (totals[emp.name] || 0) + minutes;
      })
    );

    return totals;
  }, [filteredReports]);

  const clearFilters = () => {
    setNameFilter("");
    setStatusFilter("ALL");
    setSingleDate("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Rapportererad tid</h1>
        <span className="text-sm font-medium text-green-700">Logged in</span>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded shadow">
        <input
          placeholder="Search employee"
          className="border p-2 rounded"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">All status</option>
          <option value="Working">Working</option>
          <option value="Not working">Not working</option>
        </select>

        <input type="date" className="border p-2 rounded" value={singleDate} onChange={(e) => setSingleDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <button onClick={clearFilters} className="bg-gray-100 hover:bg-gray-200 rounded p-2 text-sm">
          Clear
        </button>
      </div>

      {/* MONTH SUMMARY */}
      {nameFilter && (
        <div className="bg-teal-50 p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Monthly summary</h3>
          {Object.entries(monthTotals).map(([name, min]) => (
            <p key={name}>
              {name}: <span className="font-semibold">{formatMinutes(min)}</span>
            </p>
          ))}
        </div>
      )}

      {/* TABLES */}
      {filteredReports.map((day) => {
        const dailyTotal = day.employees.reduce(
          (sum, e) =>
            e.status === "Working"
              ? sum + minutesBetween(e.startTime, e.endTime)
              : sum,
          0
        );

        return (
          <div key={day.date} className="bg-white rounded shadow">
            <div className="px-4 py-3 border-b font-semibold">{day.date}</div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Cost Center</th>
                </tr>
              </thead>
              <tbody>
                {day.employees.map((e, i) => {
                  const min =
                    e.status === "Working"
                      ? minutesBetween(e.startTime, e.endTime)
                      : 0;

                  return (
                    <tr key={i} className="border-t hover:bg-teal-50">
                      <td className="p-3">{e.name}</td>
                      <td className="p-3">{e.status}</td>
                      <td className="p-3">{e.startTime}</td>
                      <td className="p-3">{e.endTime}</td>
                      <td className="p-3">
                        {e.status === "Working" ? formatMinutes(min) : "—"}
                      </td>
                      <td className="p-3">{e.costCenter}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t text-sm font-semibold">
              Total this day:{" "}
              <span className="text-teal-600">
                {formatMinutes(dailyTotal)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
