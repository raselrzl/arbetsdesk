"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { getCompanyTimeReports, getAvailableTipMonths } from "@/app/actions";

/* ---------------- TYPES ---------------- */

type EmployeeTime = {
  name: string;
  personalNumber: string;
  status: "Working" | "Not working";
  startTime: string;
  endTime: string;
  costCenter: string;
  totalMinutes: number;
};

type DayReport = {
  date: string;
  employees: EmployeeTime[];
};

/* ---------------- HELPERS ---------------- */

function formatMinutes(min: number) {
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

/* ---------------- PAGE ---------------- */

export default function CompanyTimePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reports, setReports] = useState<DayReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "Working" | "Not working"
  >("ALL");
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  /* REAL-TIME CLOCK */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* FETCH DATA */
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reportsData, months] = await Promise.all([
          getCompanyTimeReports(),
          getAvailableTipMonths(),
        ]);

        setReports(reportsData);
        setAvailableMonths(months);
        if (months.length > 0) setSelectedMonth(months[0]); // default to latest month
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* FILTERED REPORTS */
  const filteredReports = useMemo(() => {
    return reports
      .filter((d) => {
        if (selectedMonth && !d.date.startsWith(selectedMonth)) return false;
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
  }, [
    reports,
    nameFilter,
    statusFilter,
    singleDate,
    fromDate,
    toDate,
    selectedMonth,
  ]);

  /* MONTH TOTAL TIME */
  const totals = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReports.forEach((day) =>
      day.employees.forEach((e) => {
        if (e.status !== "Working" && e.totalMinutes === 0) return;
        map[e.name] = (map[e.name] || 0) + (e.totalMinutes ?? 0);
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
    setSelectedMonth(availableMonths[0] || "");
  };

  const groupedRows = useMemo(() => {
    return filteredReports.map((day) => ({
      date: day.date,
      rows: day.employees,
    }));
  }, [filteredReports]);

  const tableTotalMinutes = useMemo(() => {
    let total = 0;

    filteredReports.forEach((day) =>
      day.employees.forEach((e) => {
        total += e.totalMinutes ?? 0;
      })
    );

    return total;
  }, [filteredReports]);

  /* LOADING */
  if (loading) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading time reports...
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      {/* Header + Clock */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-semibold uppercase">Recorded Hours</h1>

        <div className="flex items-center gap-2 text-teal-600 font-semibold">
          <Clock className="w-5 h-5" />
          <span>
            {currentTime.toLocaleTimeString("en-US", { hour12: false })} |{" "}
            {currentTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xs shadow border border-teal-100">
        <div className="flex flex-col">
          <label>Search by name</label>
          <input
            placeholder="Employee Name"
            className="border p-2 rounded-xs border-teal-100 w-36"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label>Status</label>
          <select
            className="border p-2 rounded-xs border-teal-100 w-36"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All</option>
            <option value="Working">Working</option>
            <option value="Not working">Not working</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>Month</label>
          <select
            className="border p-2 rounded-xs border-teal-100 w-36"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Specific Date</label>
          <input
            type="date"
            className="border p-2 rounded-xs border-teal-100 w-36"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>From / To</label>
          <div className="flex gap-1">
            <input
              type="date"
              className="border p-2 rounded-xs border-teal-100 w-36"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded-xs border-teal-100 w-36"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="bg-amber-300 h-10 mt-3.5 w-24 hover:bg-teal-200 text-teal-800 font-medium px-4 py-2 rounded-xs cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* MONTH SUMMARY */}
      <div className="border border-teal-100 shadow-lg shadow-teal-800 p-4 my-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-teal-900">Hours Completed</h1>
          {selectedMonth && (
            <span className="text-sm text-teal-700 font-medium">
              {new Date(selectedMonth + "-01").toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>
        {Object.keys(totals).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(totals).map(([name, minutes]) => (
              <div
                key={name}
                className="bg-white border border-teal-100 rounded shadow p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                {/* Icon on the left */}
                <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-full text-teal-600 font-bold">
                  ⏱
                </div>

                {/* Name + Time */}
                <div className="flex flex-col">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-teal-700 font-bold">
                    {formatMinutes(minutes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SINGLE TABLE */}
      <div className="bg-white rounded-xs shadow border border-teal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-teal-200">
              <tr>
                <th className="p-3 text-left w-28">Date</th>
                <th className="p-3 text-left">Personnummer</th>
                <th className="p-3 text-center">Time</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {groupedRows.map((group) =>
                group.rows.map((row, index) => (
                  <tr
                    key={`${group.date}-${index}`}
                    className="border-t border-teal-100 hover:bg-teal-50"
                  >
                    {/* DATE (only once per day) */}
                    {index === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        className="p-3 font-semibold text-teal-900 align-top bg-teal-50"
                      >
                        {group.date}
                      </td>
                    )}

                    {/* PERSONNUMMER + NAME */}
                    <td className="p-3 font-mono text-gray-700">
                      {row.personalNumber} — {row.name}
                    </td>

                    {/* TIME */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span>{row.startTime}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span>{row.endTime}</span>
                    </td>

                    {/* TOTAL */}
                    <td className="p-3 text-right font-semibold text-teal-700">
                      {row.totalMinutes > 0
                        ? formatMinutes(row.totalMinutes)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}

              {/* EMPTY STATE */}
              {groupedRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No records found for this month
                  </td>
                </tr>
              )}

              {/* TABLE TOTAL ROW */}
              {groupedRows.length > 0 && (
                <tr className="border-t-2 border-teal-300 bg-teal-50">
                  <td
                    colSpan={3}
                    className="p-4 text-right font-semibold text-teal-900"
                  >
                    Total worked hours
                  </td>
                  <td className="p-4 text-right font-bold text-teal-900">
                    {formatMinutes(tableTotalMinutes)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
