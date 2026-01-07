"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { getMonthlyProfitability } from "./analysisactions";

interface ProfitRow {
  date: string;
  cost: number;
  sales: number;
  result: number;
  margin: number;
}

interface Totals {
  cost: number;
  sales: number;
  result: number;
  margin: number;
}

export default function MonthlyProfitTable({ companyId, month }: { companyId: string; month: string }) {
  const [rows, setRows] = useState<ProfitRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<"sales" | "cost" | "result" | "margin">("result");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // desc = high to low

  useEffect(() => {
    if (!month) return;
    setLoading(true);

    getMonthlyProfitability(companyId, month).then((res) => {
      setRows(res.rows);
      setTotals(res.totals);
      setLoading(false);
    });
  }, [companyId, month]);

  // Toggle sort key & direction
  const handleSort = (key: "sales" | "cost" | "result" | "margin") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Sort rows
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const diff = b[sortKey] - a[sortKey];
      return sortOrder === "asc" ? -diff : diff;
    });
  }, [rows, sortKey, sortOrder]);

  // Determine arrow color
  const getArrowColor = (key: "sales" | "cost" | "result" | "margin") => {
    if (key !== sortKey) return "text-gray-300"; // inactive
    // For descending (high to low), green for positive, red for negative
    if (sortOrder === "desc") {
      if (key === "result" || key === "margin") return "text-green-600";
      return "text-teal-600";
    } else {
      // ascending (low to high)
      if (key === "result" || key === "margin") return "text-red-600";
      return "text-teal-600";
    }
  };

  if (loading) return <p className="text-gray-500 mt-4">Loading profitability data...</p>;
  if (!rows.length) return <p className="text-gray-500 mt-4">No data available for this month.</p>;

  return (
    <div className="bg-white border rounded p-4 mt-8 overflow-x-auto">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Calendar className="w-5 h-5 text-teal-600" /> Daily Profitability
  </h2>

  <table className="w-full text-sm border-collapse min-w-[600px]">
    <thead className="bg-gray-100">
      <tr>
        <th className="border p-2 text-left whitespace-nowrap">Date</th>

        {(["cost", "sales", "result", "margin"] as const).map((key) => (
          <th
            key={key}
            className="border p-2 text-right cursor-pointer select-none whitespace-nowrap"
            onClick={() => handleSort(key)}
          >
            <div className="flex items-center justify-end gap-1">
              <span
                className={`${
                  sortKey === key ? "text-teal-600 font-semibold" : ""
                } truncate`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span
                className={`text-lg ${getArrowColor(key)}`}
                style={{
                  transform: sortOrder === "asc" ? "rotate(180deg)" : "rotate(0deg)",
                  display: "inline-block",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {sortedRows.map((r) => (
        <tr key={r.date}>
          <td className="border p-2 whitespace-nowrap">
            {new Date(r.date).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            })}
          </td>
          <td className="border p-2 text-right">{r.cost.toFixed(0)}</td>
          <td className="border p-2 text-right">{r.sales.toFixed(0)}</td>
          <td
            className={`border p-2 text-right ${
              r.result < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {r.result.toFixed(0)}
          </td>
          <td className="border p-2 text-right">{r.margin.toFixed(2)}%</td>
        </tr>
      ))}

      {totals && (
        <tr className="font-bold bg-gray-50">
          <td className="border p-2">TOTAL</td>
          <td className="border p-2 text-right">{totals.cost.toFixed(0)}</td>
          <td className="border p-2 text-right">{totals.sales.toFixed(0)}</td>
          <td
            className={`border p-2 text-right ${
              totals.result < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {totals.result.toFixed(0)}
          </td>
          <td className="border p-2 text-right">{totals.margin.toFixed(2)}%</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  );
}
