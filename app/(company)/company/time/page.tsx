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
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

function formatMinutes(min: number) {
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

function calculateSalary(emp: EmployeeTime) {
  if (emp.status !== "Working") return 0;

  const minutes = minutesBetween(emp.startTime, emp.endTime);
  const hours = minutes / 60;

  if (emp.salaryType === "HOURLY") {
    return hours * (emp.hourlyRate || 0);
  }

  // MONTHLY → 160h standard
  return hours * ((emp.monthlySalary || 0) / 160);
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

  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "Working" | "Not working"
  >("ALL");
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const i = setInterval(() => forceTick(Date.now()), 60000);
    return () => clearInterval(i);
  }, []);

  /* MOCK 30 DAYS */
  const reports: DayReport[] = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
        employees: names.map((name, idx) => {
          const working = Math.random() > 0.25;
          const salaryType: SalaryType =
            Math.random() > 0.5 ? "MONTHLY" : "HOURLY";

          const start = 8 + Math.floor(Math.random() * 2);
          const end = start + 7 + Math.floor(Math.random() * 2);

          return {
            name,
            status: working ? "Working" : "Not working",
            startTime: `${start}:00`,
            endTime: `${end}:00`,
            costCenter: `CC-${200 + idx}`,
            salaryType,
            hourlyRate: salaryType === "HOURLY" ? 155 : undefined,
            monthlySalary: salaryType === "MONTHLY" ? 29000 : undefined,
          };
        }),
      })),
    []
  );

  /* FILTERS */
  const filteredReports = useMemo(() => {
    return reports
      .filter((d) => {
        if (singleDate && d.date !== singleDate) return false;
        if (fromDate && d.date < fromDate) return false;
        if (toDate && d.date > toDate) return false;
        return true;
      })
      .map((d) => ({
        ...d,
        employees: d.employees.filter((e) => {
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
  const totals = useMemo(() => {
    const map: Record<string, { minutes: number; salary: number }> = {};

    filteredReports.forEach((day) =>
      day.employees.forEach((e) => {
        if (e.status !== "Working") return;
        const min = minutesBetween(e.startTime, e.endTime);
        const sal = calculateSalary(e);

        map[e.name] = {
          minutes: (map[e.name]?.minutes || 0) + min,
          salary: (map[e.name]?.salary || 0) + sal,
        };
      })
    );

    return map;
  }, [filteredReports]);

  const clearFilters = () => {
    setNameFilter("");
    setStatusFilter("ALL");
    setSingleDate("");
    setFromDate("");
    setToDate("");
  };

  const grandTotalSalary = Object.values(totals).reduce(
    (sum, v) => sum + v.salary,
    0
  );

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Rapportererad tid</h1>
        <span className="text-green-700 font-medium">Logged in</span>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded shadow">
        {/* Employee */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Employee</label>
          <input
            placeholder="Search employee"
            className="border p-2 rounded"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All</option>
            <option value="Working">Working</option>
            <option value="Not working">Not working</option>
          </select>
        </div>

        {/* Specific date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            Specific date
          </label>
          <input
            type="date"
            className="border p-2 rounded"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
          />
        </div>

        {/* From date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">From date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* To date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">To date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Clear */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-transparent">Clear</label>
          <button
            onClick={clearFilters}
            className="bg-gray-100 hover:bg-gray-200 rounded p-2 font-medium"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* MONTH SUMMARY */}
      {Object.keys(totals).length > 0 && (
        <div className="bg-teal-50 p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Monthly summary</h3>
          {Object.entries(totals).map(([name, v]) => (
            <p key={name}>
              {name}: {formatMinutes(v.minutes)} —{" "}
              <span className="font-semibold">{v.salary.toFixed(2)} SEK</span>
            </p>
          ))}
          <p className="mt-2 font-bold">
            Total salary (all employees): {grandTotalSalary.toFixed(2)} SEK
          </p>
        </div>
      )}

      {/* TABLES */}
      {filteredReports.map((day) => {
        const daySalary = day.employees.reduce(
          (s, e) => s + calculateSalary(e),
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
                  <th className="p-3 text-left">Hours</th>
                  <th className="p-3 text-left">Salary</th>
                  <th className="p-3 text-left">Cost Center</th>
                </tr>
              </thead>
              <tbody>
                {day.employees.map((e, i) => (
                  <tr key={i} className="border-t hover:bg-teal-50">
                    <td className="p-3">{e.name}</td>
                    <td className="p-3">{e.status}</td>
                    <td className="p-3">{e.startTime}</td>
                    <td className="p-3">{e.endTime}</td>
                    <td className="p-3">
                      {e.status === "Working"
                        ? formatMinutes(minutesBetween(e.startTime, e.endTime))
                        : "—"}
                    </td>
                    <td className="p-3">{calculateSalary(e).toFixed(2)} SEK</td>
                    <td className="p-3">{e.costCenter}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t font-semibold text-sm">
              Total salary this day:{" "}
              <span className="text-teal-600">{daySalary.toFixed(2)} SEK</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
