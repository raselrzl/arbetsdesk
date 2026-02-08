"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Box, MoveUpRight } from "lucide-react";
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
  salesWithVAT?: number;
  salesWithoutVAT?: number;
  vatAmount?: number;
}

interface Totals {
  cost: number;
  sales: number;
  salesWithVAT?: number;
  salesWithoutVAT?: number;
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
  const [sortKey, setSortKey] = useState<"sales" | "cost" | "result" | "margin">(
    "result"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [showVAT, setShowVAT] = useState(false); // VAT toggle
  const [vatMode, setVatMode] = useState<"excl" | "incl">("excl"); // incl/excl toggle

  useEffect(() => {
    if (!month) return;
    setLoading(true);
    getMonthlyProfitability(companyId, month).then((res) => {
      const updatedRows = res.rows.map((r) => {
        const salesMinusVAT = r.salesWithoutVAT ?? r.sales;
        return {
          ...r,
          result: salesMinusVAT - r.cost,
        };
      });

      setRows(updatedRows);

      const salesWithoutVATTotal = res.totals.salesWithoutVAT ?? res.totals.sales;
      setTotals({
        ...res.totals,
        salesWithVAT: res.totals.salesWithVAT,
        salesWithoutVAT: salesWithoutVATTotal,
        result: salesWithoutVATTotal - res.totals.cost,
      });

      setLoading(false);
    });
  }, [companyId, month]);

  // --- VAT display calculations ---
  const displayRows = useMemo(() => {
    return rows.map((r) => {
      const salesExcl = r.salesWithoutVAT ?? r.sales;
      const salesIncl = r.salesWithVAT ?? r.sales;
      const sales = vatMode === "incl" ? salesIncl : salesExcl;
      const result = sales - r.cost;
      const margin = sales > 0 ? (result / sales) * 100 : 0;
      return {
        ...r,
        displaySales: sales,
        displayResult: result,
        displayMargin: margin,
      };
    });
  }, [rows, vatMode]);

  const displayTotals = useMemo(() => {
    if (!totals) return null;
    const sales = vatMode === "incl" ? totals.salesWithVAT! : totals.salesWithoutVAT ?? totals.sales;
    const result = sales - totals.cost;
    const margin = sales > 0 ? (result / sales) * 100 : 0;
    return {
      ...totals,
      displaySales: sales,
      displayResult: result,
      displayMargin: margin,
    };
  }, [totals, vatMode]);

  // --- Sorting ---
  const sortedRows = useMemo(() => {
    return [...displayRows].sort((a, b) => {
      const aVal =
        sortKey === "sales"
          ? a.displaySales
          : sortKey === "result"
          ? a.displayResult
          : sortKey === "margin"
          ? a.displayMargin
          : a.cost;

      const bVal =
        sortKey === "sales"
          ? b.displaySales
          : sortKey === "result"
          ? b.displayResult
          : sortKey === "margin"
          ? b.displayMargin
          : b.cost;

      const diff = bVal - aVal;
      return sortOrder === "asc" ? -diff : diff;
    });
  }, [displayRows, sortKey, sortOrder]);

  const handleSort = (key: "sales" | "cost" | "result" | "margin") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const getArrowColor = (key: "sales" | "cost" | "result" | "margin") => {
    if (key !== sortKey) return "text-gray-300";
    if (sortOrder === "desc")
      return key === "result" || key === "margin" ? "text-green-600" : "text-teal-600";
    return key === "result" || key === "margin" ? "text-red-600" : "text-teal-600";
  };

  const formatCost = (cost: number) => cost.toFixed(0);
  const formatResult = (value: number) => (value >= 0 ? `+${value.toFixed(0)}` : value.toFixed(0));

  return (
    <div className="bg-white shadow-lg shadow-teal-800 border border-teal-100 rounded-xs p-4 mt-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 uppercase text-teal-900">
        <img src="/icons/3.png" alt="icon" className="w-10 h-10" />
        Daily Profitability
      </h2>

      {/* VAT toggle button */}
      <div className="mb-4">
        <button
          onClick={() => setShowVAT(!showVAT)}
          className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
        >
          {showVAT ? "Hide VAT Details" : "Show VAT Details"}
        </button>
      </div>

      {/* Incl/Excl VAT switch */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm text-gray-600">Excl. VAT</span>
        <button
          onClick={() => setVatMode(vatMode === "excl" ? "incl" : "excl")}
          className={`relative w-12 h-6 rounded-full transition ${vatMode === "incl" ? "bg-teal-600" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              vatMode === "incl" ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span className="text-sm text-gray-600">Incl. VAT</span>
      </div>

      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead className="bg-teal-800 text-white">
          <tr>
            <th className="border p-2 text-left whitespace-nowrap text-gray-400">Date</th>
            {(["sales", "cost", "result", "margin"] as const).map((key) => (
              <th
                key={key}
                className="border p-2 text-right cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort(key)}
              >
                <div className="flex items-center justify-end gap-1">
                  <span className={`${sortKey === key ? "text-teal-600 font-semibold" : ""} truncate`}>
                    {key === "sales"
                      ? showVAT
                        ? "Sales incl. VAT"
                        : "Sales"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
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
              {/* Date */}
              <td className="border border-teal-100 p-2 whitespace-nowrap text-gray-500">
                {new Date(r.date).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
              </td>

              {/* Sales */}
              <td
                className="border border-teal-100 pr-2 text-right text-teal-600 relative cursor-pointer group"
                onClick={() =>
                  setOpenRow(openRow === r.date + "-SALES" ? null : r.date + "-SALES")
                }
              >
                <div className="absolute top-0 left-0 bg-teal-300 w-3 h-3 flex items-center justify-center shadow-sm z-10">
                  <MoveUpRight className="w-3 h-3 text-gray-200" />
                </div>

                {showVAT ? (
                  <div className="text-right">
                    <div>Excl. VAT: {r.salesWithoutVAT?.toFixed(0)}</div>
                    <div>VAT: {(r.salesWithVAT! - r.salesWithoutVAT!).toFixed(0)}</div>
                    <div className="font-semibold">Total: {r.salesWithVAT?.toFixed(0)}</div>
                  </div>
                ) : (
                  <span>{r.displaySales.toFixed(0)}</span>
                )}

                {/* Tooltip */}
                <div
                  className={`absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-40
                    ${openRow === r.date + "-SALES" ? "block" : "hidden"} group-hover:block`}
                >
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
                  <div className="flex justify-between text-teal-600">
                    <span>Excl. VAT</span>
                    <span>{r.salesWithoutVAT?.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-teal-600">
                    <span>VAT</span>
                    <span>{(r.salesWithVAT! - r.salesWithoutVAT!).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total incl. VAT</span>
                    <span>{r.salesWithVAT?.toFixed(0)}</span>
                  </div>
                </div>
              </td>

              {/* Cost */}
              <td
                className="border border-teal-100 pr-2 text-right text-gray-600 relative cursor-pointer group"
                onClick={() => setOpenRow(openRow === r.date ? null : r.date)}
              >
                <div className="absolute top-0 left-0 bg-gray-400 w-3 h-3 flex items-center justify-center shadow-sm z-10">
                  <MoveUpRight className="w-3 h-3 text-gray-200" />
                </div>
                <span>{formatCost(r.cost)}</span>

                <div
                  className={`absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-32
                    ${openRow === r.date ? "block" : "hidden"} group-hover:block`}
                >
                  <div className="absolute -top-2 -left-2 bg-red-700 p-1 border border-teal-100 rounded-xs">
                    <Box className="w-3 h-3 text-gray-100" />
                  </div>
                  <div className="flex justify-between">
                    <span>Salary</span>
                    <span>{r.costBreakdown.salary.toFixed(0)}</span>
                  </div>
                  {Object.entries(r.costBreakdown.categories).map(([name, value]) => (
                    <div key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span>{value.toFixed(0)}</span>
                    </div>
                  ))}
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
                  r.displayResult < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatResult(r.displayResult)}
              </td>

              {/* Margin */}
              <td className="border border-teal-100 p-2 text-right">{r.displayMargin.toFixed(2)}%</td>
            </tr>
          ))}

          {displayTotals && (
            <tr className="font-bold bg-teal-800 text-gray-50">
              <td className="border border-teal-100 p-2 text-gray-100">TOTAL</td>
              <td className="border p-2 text-right text-teal-100">
                {showVAT
                  ? `Excl: ${totals?.salesWithoutVAT?.toFixed(0)}, VAT: ${(
                      totals!.salesWithVAT! - totals!.salesWithoutVAT!
                    ).toFixed(0)}, Total: ${totals!.salesWithVAT?.toFixed(0)}`
                  : displayTotals.displaySales.toFixed(0)}
              </td>
              <td className={`border border-teal-100 p-2 text-right ${displayTotals.displayResult < 0 ? "text-red-600" : "text-gray-300"}`}>
                {displayTotals.cost.toFixed(0)}
              </td>
              <td className={`border border-teal-100 p-2 text-right ${displayTotals.displayResult < 0 ? "text-red-600" : "text-green-500"}`}>
                {formatResult(displayTotals.displayResult)}
              </td>
              <td className="border border-teal-100 p-2 text-right">{displayTotals.displayMargin.toFixed(2)}%</td>
            </tr>
          )}
        </tbody>
      </table>

      {rows.length > 0 && <MonthlyProfitGraph rows={rows} />}
    </div>
  );
}
