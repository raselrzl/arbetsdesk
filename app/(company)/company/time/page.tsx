"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { getCompanyTimeReports } from "@/app/actions";

/* ---------------- TYPES ---------------- */

type EmployeeTime = {
  name: string;
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

  /* REAL-TIME CLOCK */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* FETCH REAL DATA */
  useEffect(() => {
    getCompanyTimeReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  /* FILTERED REPORTS */
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
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading time reports...
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded-xs shadow border border-teal-100">
        <input
          placeholder="Search employee"
          className="border p-2 rounded-xs border-teal-100"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <select
          className="border p-2 rounded-xs border-teal-100"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">All</option>
          <option value="Working">Working</option>
          <option value="Not working">Not working</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded-xs border-teal-100"
          value={singleDate}
          onChange={(e) => setSingleDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded-xs border-teal-100"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded-xs border-teal-100"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button
          onClick={clearFilters}
          className="bg-teal-100 hover:bg-teal-200 rounded-xs p-2 font-medium cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* MONTH SUMMARY */}
      {Object.keys(totals).length > 0 && (
        <div className="bg-teal-100 p-4 rounded-xs shadow text-sm">
          <h3 className="font-semibold mb-2">Monthly time summary</h3>
          {Object.entries(totals).map(([name, minutes]) => (
            <p key={name}>
              {name}:{" "}
              <span className="font-semibold">
                {formatMinutes(minutes)}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* TABLES */}
      {filteredReports.map((day) => (
        <div key={day.date} className="bg-white rounded-xs shadow border border-teal-100">
          <div className="px-4 py-3 border-b font-semibold bg-teal-400">{day.date}</div>

          <table className="w-full text-sm">
            <thead className="bg-teal-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Worked time</th>
                <th className="p-3 text-left">Cost Center</th>
              </tr>
            </thead>
            <tbody>
              {day.employees.map((e, i) => (
                <tr key={i} className="border-t border-teal-100 hover:bg-teal-50">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.status}</td>
                  <td className="p-3">{e.startTime}</td>
                  <td className="p-3">{e.endTime}</td>
                  <td className="p-3">
                    {e.totalMinutes > 0
                      ? formatMinutes(e.totalMinutes)
                      : "—"}
                  </td>
                  <td className="p-3">{e.costCenter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
