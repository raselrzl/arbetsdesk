"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Box, MoveUpRight } from "lucide-react"; // Using Box icon
import { getMonthlyProfitability } from "./analysisactions";


import dynamic from "next/dynamic";

// Dynamically import graph to disable SSR (Next.js client-only)
const MonthlyProfitGraph = dynamic(() => import("./MonthlyProfitGraph"), {
  ssr: false,
});

export interface ProfitRow {
  date: string;
  cost: number;
  sales: number;
  result: number;
  margin: number;
  salesBreakdown?: {
    cash: number;
    card: number;
  };
  costBreakdown: {
    salary: number;
    categories: Record<string, number>;
  };
}

interface Totals {
  cost: number;
  sales: number;
  result: number;
  margin: number;
}

export default function MonthlyProfitTable({
  companyId,
  month,
}: {
  companyId: string;
  month: string;
}) {
  const [rows, setRows] = useState<ProfitRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<
    "sales" | "cost" | "result" | "margin"
  >("result");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openRow, setOpenRow] = useState<string | null>(null);

  useEffect(() => {
    if (!month) return;
    setLoading(true);
    getMonthlyProfitability(companyId, month).then((res) => {
      setRows(res.rows);
      setTotals(res.totals);
      setLoading(false);
    });
  }, [companyId, month]);

  const handleSort = (key: "sales" | "cost" | "result" | "margin") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const diff = b[sortKey] - a[sortKey];
      return sortOrder === "asc" ? -diff : diff;
    });
  }, [rows, sortKey, sortOrder]);

  const getArrowColor = (key: "sales" | "cost" | "result" | "margin") => {
    if (key !== sortKey) return "text-gray-300";
    if (sortOrder === "desc")
      return key === "result" || key === "margin"
        ? "text-green-600"
        : "text-teal-600";
    return key === "result" || key === "margin"
      ? "text-red-600"
      : "text-teal-600";
  };

  const formatCost = (cost: number, sales: number) =>
    cost > sales ? `-${cost.toFixed(0)}` : cost.toFixed(0);

  const formatResult = (value: number) =>
    value >= 0 ? `+${value.toFixed(0)}` : value.toFixed(0);

  return (
    <div className="bg-white shadow-lg shadow-teal-800 rounded-xs p-4 mt-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase text-teal-900">
        <img src="/icons/3.png" alt="icon" className="w-10 h-10" />
        Daily Profitability
      </h2>

      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead className="bg-teal-800 text-white">
          <tr>
            <th className="border p-2 text-left whitespace-nowrap text-gray-400">
              Date
            </th>
            {(["sales", "cost", "result", "margin"] as const).map((key) => (
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
                      transform:
                        sortOrder === "asc" ? "rotate(180deg)" : "rotate(0deg)",
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
              {/* Date */}
              <td className="border border-teal-100 p-2 whitespace-nowrap text-gray-500">
                {new Date(r.date).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                })}
              </td>

              {/* Sales with hover + click breakdown */}
              <td
                className="border border-teal-100 pr-2 text-right text-teal-600 relative cursor-pointer group"
                onClick={() =>
                  setOpenRow(
                    openRow === r.date + "-SALES" ? null : r.date + "-SALES"
                  )
                }
              >
                {/* Small icon in top-left corner */}
                <div className="absolute top-0 left-0 bg-teal-300 w-3 h-3 flex items-center justify-center shadow-sm z-10">
                  <MoveUpRight className="w-3 h-3 text-gray-200" />
                </div>

                {/* Sales value */}
                <span>{r.sales.toFixed(0)}</span>

                {/* Tooltip */}
                <div
                  className={`absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-32
      ${openRow === r.date + "-SALES" ? "block" : "hidden"} group-hover:block`}
                >
                  {/* Top-left icon inside tooltip */}
                  <div className="absolute -top-2 -left-2 bg-teal-400 p-1 border border-teal-100 rounded">
                    <Box className="w-3 h-3 text-gray-100" />
                  </div>

                  <div className="font-semibold mb-1">Sales breakdown</div>
                  <div className="flex justify-between">
                    <span>Cash</span>
                    <span>{r.salesBreakdown?.cash.toFixed(0) ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card</span>
                    <span>{r.salesBreakdown?.card.toFixed(0) ?? 0}</span>
                  </div>

                  <hr className="my-1 border-t-2 border-teal-600" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{r.sales.toFixed(0)}</span>
                  </div>
                </div>
              </td>

              {/* Cost with hover + click breakdown */}
              <td
                className="border border-teal-100 pr-2 text-right text-gray-600 relative cursor-pointer group"
                onClick={() => setOpenRow(openRow === r.date ? null : r.date)}
              >
                <div className="absolute top-0 left-0 bg-teal-300 w-3 h-3 flex items-center justify-center shadow-sm z-10">
                  <MoveUpRight className="w-3 h-3 text-gray-200" />
                </div>
                <span>{formatCost(r.cost, r.sales)}</span>

                {/* Tooltip */}
                <div
                  className={`absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-32
                    ${
                      openRow === r.date ? "block" : "hidden"
                    } group-hover:block`}
                >
                  {/* Top-left icon inside tooltip */}
                  <div className="absolute -top-2 -left-2 bg-red-700 p-1 border border-teal-100 rounded-xs">
                    <Box className="w-3 h-3 text-gray-100" />
                  </div>

                  {/*  <div className="font-semibold mb-1">Cost breakdown</div> */}

                  <div className="flex justify-between">
                    <span>Salary</span>
                    <span>{r.costBreakdown.salary.toFixed(0)}</span>
                  </div>

                  {Object.entries(r.costBreakdown.categories).map(
                    ([name, value]) => (
                      <div key={name} className="flex justify-between">
                        <span>{name}</span>
                        <span>{value.toFixed(0)}</span>
                      </div>
                    )
                  )}

                  <hr className="my-1 border-t-2 border-red-600" />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{r.cost.toFixed(0)}</span>
                  </div>
                </div>
              </td>

              {/* Result */}
              <td
                className={`border border-teal-100 p-2 text-right ${
                  r.result < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatResult(r.result)}
              </td>

              {/* Margin */}
              <td className="border border-teal-100 p-2 text-right">
                {r.margin.toFixed(2)}%
              </td>
            </tr>
          ))}

          {totals && (
            <tr className="font-bold bg-teal-800 text-gray-50">
              <td className="border border-teal-100 p-2 text-gray-100">
                TOTAL
              </td>
              <td className="border p-2 text-right text-teal-100">
                {totals.sales.toFixed(0)}
              </td>
              <td
                className={`border border-teal-100 p-2 text-right ${
                  totals.cost > totals.sales ? "text-red-600" : "text-gray-300"
                }`}
              >
                {totals.cost.toFixed(0)}
              </td>
              <td
                className={`border border-teal-100 p-2 text-right ${
                  totals.result < 0 ? "text-red-600" : "text-green-500"
                }`}
              >
                {formatResult(totals.result)}
              </td>
              <td className="border border-teal-100 p-2 text-right">
                {totals.margin.toFixed(2)}%
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add this at the end of your MonthlyProfitTable render */}
  {rows.length > 0 && <MonthlyProfitGraph rows={rows} />}

    </div>
  );
}
