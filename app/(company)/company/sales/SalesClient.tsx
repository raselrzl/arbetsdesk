"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import {
  addDailySale,
  getMonthlySalesByCompany,
  getYearlySalesByCompany,
} from "./salesactions";
import Link from "next/link";
import MonthlySalesGraph from "./MonthlySalesGraph";
import YearlySalesGraph from "./YearlySalesGraph";

type Sale = {
  id: string;
  date: string;
  amount: number; // GROSS
  method: "CASH" | "CARD";
  vatRate?: number | null;
  vatAmount?: number | null;
  netAmount?: number | null;
  vatTypeId?: string | null;
  vatTypeName?: string | null; // optional friendly name
};

type Props = {
  companyId: string;
  initialMonths: string[];
  initialYears: number[];
};

type VatView = "INCLUDE" | "EXCLUDE";

// Helper: get sale value depending on VAT view
function getSaleValue(sale: Sale, vatView: VatView) {
  if (vatView === "EXCLUDE") {
    return sale.netAmount ?? sale.amount; // fallback for old data
  }
  return sale.amount; // INCLUDE VAT
}

// Helper: get VAT amount
function getVatAmount(sale: Sale) {
  return sale.vatAmount ?? (sale.vatRate ? sale.amount * sale.vatRate : 0);
}

// Format numbers
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SalesClient({
  companyId,
  initialMonths,
  initialYears,
}: Props) {
  const filteredYears = [...initialYears].sort((a, b) => b - a);

  const [months] = useState(initialMonths);
  const [month, setMonth] = useState(initialMonths[0] || "");
  const [sales, setSales] = useState<Sale[]>([]);

  const [yearlyYear, setYearlyYear] = useState(filteredYears[0] || 2026);
  const [yearlySales, setYearlySales] = useState<Sale[]>([]);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"CASH" | "CARD" | "">("");
  const [vatRate, setVatRate] = useState(0);

  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);
  const [addingSale, setAddingSale] = useState(false);

  const [vatView, setVatView] = useState<VatView>("INCLUDE");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  /* ---------- Load monthly sales ---------- */
  useEffect(() => {
    if (!month) return;
    setLoadingMonth(true);

    getMonthlySalesByCompany(companyId, month).then((data) => {
      setSales(
        data.map((s) => ({
          id: s.id,
          date: s.date.toISOString(),
          amount: s.amount,
          method: s.method,
          vatRate: s.vatRate,
          vatAmount: s.vatAmount,
          netAmount: s.netAmount,
          vatTypeId: s.vatTypeId,
          vatTypeName: s.vatType?.name,
        })),
      );
      setLoadingMonth(false);
    });
  }, [month, companyId]);

  /* ---------- Add sale ---------- */
  const addSale = async () => {
    if (!date || !amount || !method || addingSale) return;
    setAddingSale(true);

    await addDailySale(companyId, {
      date,
      amount: Number(amount),
      method,
      vatRate,
    });

    setDate("");
    setAmount("");
    setMethod("");
    setVatRate(0);

    const data = await getMonthlySalesByCompany(companyId, month);
    setSales(
      data.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        amount: s.amount,
        method: s.method,
        vatRate: s.vatRate,
        vatAmount: s.vatAmount,
        netAmount: s.netAmount,
        vatTypeId: s.vatTypeId,
        vatTypeName: s.vatType?.name,
      })),
    );

    setAddingSale(false);
  };

  /* ---------- Monthly summary ---------- */
  const summary = useMemo(() => {
    let cash = 0,
      card = 0,
      vat = 0;
    sales.forEach((s) => {
      const value = getSaleValue(s, vatView);
      const vatAmount = getVatAmount(s);
      if (s.method === "CASH") cash += value;
      if (s.method === "CARD") card += value;
      vat += vatAmount;
    });
    return { cash, card, vat, total: cash + card };
  }, [sales, vatView]);

  /* ---------- Group by date with VAT category ---------- */
  const groupedByDate = useMemo(() => {
    const map: Record<
      string,
      {
        cash: number;
        card: number;
        vat: number;
        total: number;
        vatBreakdown: Record<string, number>;
      }
    > = {};

    sales.forEach((s) => {
      const day = s.date.slice(0, 10);
      const value = getSaleValue(s, vatView);
      const vat = getVatAmount(s);
      const vatName =
        s.vatTypeName || `VAT ${s.vatRate ? s.vatRate * 100 : 0}%`;

      if (!map[day])
        map[day] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };

      if (s.method === "CASH") map[day].cash += value;
      if (s.method === "CARD") map[day].card += value;

      map[day].total += value;
      map[day].vat += vat;

      map[day].vatBreakdown[vatName] =
        (map[day].vatBreakdown[vatName] || 0) + vat;
    });

    return map;
  }, [sales, vatView]);

  /* ---------- Chart Data for Monthly Graph ---------- */
  const chartData = useMemo(
    () =>
      Object.entries(groupedByDate).map(([date, v]) => ({
        date,
        cash: v.cash,
        card: v.card,
        total: v.total,
        vat: v.vat,
        vatBreakdown: v.vatBreakdown, // ✅ include breakdown for tooltip
      })),
    [groupedByDate],
  );

  /* ---------- Load yearly sales ---------- */
  useEffect(() => {
    setLoadingYear(true);
    getYearlySalesByCompany(companyId, yearlyYear).then((data) => {
      setYearlySales(
        data.map((s) => ({
          id: s.id,
          date: s.date.toISOString(),
          amount: s.amount,
          method: s.method,
          vatRate: s.vatRate,
          vatAmount: s.vatAmount,
          netAmount: s.netAmount,
          vatTypeId: s.vatTypeId,
          vatTypeName: s.vatType?.name,
        })),
      );
      setLoadingYear(false);
    });
  }, [yearlyYear, companyId]);

  /* ---------- Group yearly by month ---------- */
  const groupedByMonth = useMemo(() => {
    const map: Record<
      string,
      {
        cash: number;
        card: number;
        vat: number;
        total: number;
        vatBreakdown: Record<string, number>;
      }
    > = {};

    yearlySales.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const value = getSaleValue(s, vatView);
      const vat = getVatAmount(s);
      const vatName =
        s.vatTypeName || `VAT ${s.vatRate ? s.vatRate * 100 : 0}%`;

      if (!map[key])
        map[key] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };

      if (s.method === "CASH") map[key].cash += value;
      if (s.method === "CARD") map[key].card += value;
      map[key].total += value;
      map[key].vat += vat;

      map[key].vatBreakdown[vatName] =
        (map[key].vatBreakdown[vatName] || 0) + vat;
    });

    // fill empty months
    for (let m = 1; m <= 12; m++) {
      const key = `${yearlyYear}-${String(m).padStart(2, "0")}`;
      if (!map[key])
        map[key] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };
    }

    return map;
  }, [yearlySales, yearlyYear, vatView]);

  const yearlySummary = useMemo(() => {
    let cash = 0,
      card = 0,
      vat = 0;
    Object.values(groupedByMonth).forEach((v) => {
      cash += v.cash;
      card += v.card;
      vat += v.vat;
    });
    return { cash, card, vat, total: cash + card };
  }, [groupedByMonth]);

  const yearlyChartData = useMemo(
    () =>
      Object.entries(groupedByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, v]) => ({
          month,
          cash: v.cash,
          card: v.card,
          total: v.total,
          vat: v.vat,
          vatBreakdown: v.vatBreakdown, // ✅ Include breakdown
        })),
    [groupedByMonth],
  );

  /* ---------- UI ---------- */
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 my-20">
      {/* Add Sale */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-gray-50 p-3 border rounded-xs">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as "CASH" | "CARD")}
          className="border p-2"
        >
          <option value="">Payment</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
        </select>
        <select
          value={vatRate}
          onChange={(e) => setVatRate(Number(e.target.value))}
          className="border p-2"
        >
          <option value={0}>No VAT</option>
          <option value={0.12}>Food VAT 12%</option>
          <option value={0.25}>Alcohol VAT 25%</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={addSale}
          disabled={addingSale}
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {addingSale ? "Saving…" : "Add Sale"}
        </button>
      </div>

      {/* Month selector + VAT toggle */}
      <div className="flex justify-between items-center gap-3 bg-gray-50 p-3 rounded-xs border">
        <div className="flex gap-2">
          <Link
            href="/company/analysis"
            className="bg-black text-white px-4 py-2 rounded-xs hover:bg-gray-800 transition"
          >
            Go to Analysis ➠
          </Link>
          <Link
            href="/company/additionalcost"
            className="bg-black text-white px-4 py-2 rounded-xs hover:bg-gray-800 transition"
          >
            Go to Cost ➠
          </Link>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setVatView("INCLUDE")}
            className={`px-4 py-2 border ${vatView === "INCLUDE" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Including VAT
          </button>
          <button
            onClick={() => setVatView("EXCLUDE")}
            className={`px-4 py-2 border ${vatView === "EXCLUDE" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Excluding VAT
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-black" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {loadingMonth && <span className="text-gray-500 ml-2">Loading…</span>}
        </div>
      </div>

     {/* Monthly Sales Table */}
<div className="bg-white shadow-lg shadow-teal-800 border border-teal-100 rounded-xs p-4 mt-8 overflow-x-auto">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase text-teal-900">
    <img src="/icons/3.png" alt="icon" className="w-10 h-10" />
    Monthly Sales
  </h2>

  <table className="w-full text-sm border-collapse min-w-[600px]">
    <thead className="bg-teal-800 text-white">
      <tr>
        <th className="border p-2 text-left text-gray-400">Date</th>
        <th className="border p-2 text-right cursor-pointer select-none text-gray-200">Cash</th>
        <th className="border p-2 text-right cursor-pointer select-none text-gray-200">Card</th>
        <th className="border p-2 text-right cursor-pointer select-none text-gray-200">VAT</th>
        <th className="border p-2 text-right cursor-pointer select-none text-gray-200">Total</th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(groupedByDate).map(([day, v]) => (
        <tr key={day} className="relative group">
          {/* Date */}
          <td className="border border-teal-100 p-2 text-gray-500 whitespace-nowrap">
            {new Date(day).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
          </td>

          {/* Cash */}
          <td className="border border-teal-100 p-2 text-right text-teal-600 relative cursor-pointer">
            {formatNumber(v.cash)}
            <div className="absolute top-0 left-0 bg-teal-300 w-3 h-3 flex items-center justify-center shadow-sm z-10">
              <Calendar className="w-3 h-3 text-gray-200" />
            </div>
          </td>

          {/* Card */}
          <td className="border border-teal-100 p-2 text-right text-teal-600 relative cursor-pointer">
            {formatNumber(v.card)}
          </td>

          {/* VAT with tooltip */}
          <td className="border border-teal-100 p-2 text-right text-gray-600 relative cursor-pointer group">
            {formatNumber(v.vat)}
            {v.vatBreakdown && Object.keys(v.vatBreakdown).length > 0 && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-32 hidden group-hover:block">
                <div className="font-semibold mb-1">VAT Breakdown</div>
                {Object.entries(v.vatBreakdown).map(([name, value]) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span>{formatNumber(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </td>

          {/* Total */}
          <td className="border border-teal-100 p-2 text-right font-semibold text-green-600">
            {formatNumber(v.total)}
          </td>
        </tr>
      ))}

      {/* Totals row */}
      <tr className="font-bold bg-teal-800 text-gray-50">
        <td className="border border-teal-100 p-2 text-gray-100">TOTAL</td>
        <td className="border border-teal-100 p-2 text-right text-teal-100">{formatNumber(summary.cash)}</td>
        <td className="border border-teal-100 p-2 text-right text-teal-100">{formatNumber(summary.card)}</td>
        <td className="border border-teal-100 p-2 text-right text-gray-100">{formatNumber(summary.vat)}</td>
        <td className="border border-teal-100 p-2 text-right text-green-100">{formatNumber(summary.total)}</td>
      </tr>
    </tbody>
  </table>

  {/* Graph */}
  {chartData.length > 0 && <MonthlySalesGraph data={chartData} />}
</div>


      {/* Monthly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-gray-50 border text-center">
          <strong>Cash</strong>
          <div>{formatNumber(summary.cash)}</div>
        </div>
        <div className="p-4 bg-gray-50 border text-center">
          <strong>Card</strong>
          <div>{formatNumber(summary.card)}</div>
        </div>
        <div className="p-4 bg-gray-50 border text-center">
          <strong>VAT</strong>
          <div>{formatNumber(summary.vat)}</div>
        </div>
        <div className="p-4 bg-gray-50 border text-center font-bold">
          <strong>Total</strong>
          <div>{formatNumber(summary.total)}</div>
        </div>
      </div>

      <MonthlySalesGraph data={chartData} />

      {/* Yearly Section */}
      <div className="space-y-6 mt-10">
        <h2 className="text-xl font-semibold">Yearly Sales</h2>
        <div className="flex items-center gap-2 mb-4">
          <span>Year:</span>
          <select
            value={yearlyYear}
            onChange={(e) => setYearlyYear(Number(e.target.value))}
            className="border p-2"
          >
            {filteredYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {loadingYear && <span className="text-gray-500 ml-2">Loading…</span>}
        </div>

       {/* Yearly Sales Table */}
<div className="bg-white shadow-lg shadow-teal-800 border border-teal-100 rounded-xs p-4 mt-8 overflow-x-auto">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase text-teal-900">
    <img src="/icons/3.png" alt="icon" className="w-10 h-10" />
    Yearly Sales
  </h2>

  <div className="flex items-center gap-2 mb-4">
    <span className="text-gray-600">Year:</span>
    <select
      value={yearlyYear}
      onChange={(e) => setYearlyYear(Number(e.target.value))}
      className="border p-2 rounded-xs"
    >
      {filteredYears.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
    {loadingYear && <span className="text-gray-500 ml-2">Loading…</span>}
  </div>

  <table className="w-full text-sm border-collapse min-w-[600px]">
    <thead className="bg-teal-800 text-white">
      <tr>
        <th className="border p-2 text-left text-gray-200">Month</th>
        <th className="border p-2 text-right cursor-pointer text-gray-200">Cash</th>
        <th className="border p-2 text-right cursor-pointer text-gray-200">Card</th>
        <th className="border p-2 text-right cursor-pointer text-gray-200">VAT</th>
        <th className="border p-2 text-right cursor-pointer text-gray-200">Total</th>
      </tr>
    </thead>

    <tbody>
      {Array.from({ length: 12 }).map((_, i) => {
        const key = `${yearlyYear}-${String(i + 1).padStart(2, "0")}`;
        const v = groupedByMonth[key] || { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };

        return (
          <tr key={key} className="relative group">
            <td className="border border-teal-100 p-2 text-gray-500 whitespace-nowrap">
              {MONTH_NAMES[i]}
            </td>
            <td className="border border-teal-100 p-2 text-right text-teal-600">
              {formatNumber(v.cash)}
            </td>
            <td className="border border-teal-100 p-2 text-right text-teal-600">
              {formatNumber(v.card)}
            </td>

            {/* VAT with tooltip */}
            <td className="border border-teal-100 p-2 text-right text-gray-600 relative cursor-pointer group">
              {formatNumber(v.vat)}
              {v.vatBreakdown && Object.keys(v.vatBreakdown).length > 0 && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-teal-100 shadow-lg p-3 text-xs z-20 w-32 hidden group-hover:block">
                  <div className="font-semibold mb-1">VAT Breakdown</div>
                  {Object.entries(v.vatBreakdown).map(([name, value]) => (
                    <div key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span>{formatNumber(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </td>

            <td className="border border-teal-100 p-2 text-right font-semibold text-green-600">
              {formatNumber(v.total)}
            </td>
          </tr>
        );
      })}

      {/* Totals row */}
      <tr className="font-bold bg-teal-800 text-gray-50">
        <td className="border border-teal-100 p-2 text-gray-100">TOTAL</td>
        <td className="border border-teal-100 p-2 text-right text-teal-100">{formatNumber(yearlySummary.cash)}</td>
        <td className="border border-teal-100 p-2 text-right text-teal-100">{formatNumber(yearlySummary.card)}</td>
        <td className="border border-teal-100 p-2 text-right text-gray-100">{formatNumber(yearlySummary.vat)}</td>
        <td className="border border-teal-100 p-2 text-right text-green-100">{formatNumber(yearlySummary.total)}</td>
      </tr>
    </tbody>
  </table>

  {/* Yearly Graph */}
  {yearlyChartData.length > 0 && <YearlySalesGraph data={yearlyChartData} />}
</div>


        {/* Yearly Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-gray-50 border text-center">
            <strong>Cash</strong>
            <div>{formatNumber(yearlySummary.cash)}</div>
          </div>
          <div className="p-4 bg-gray-50 border text-center">
            <strong>Card</strong>
            <div>{formatNumber(yearlySummary.card)}</div>
          </div>
          <div className="p-4 bg-gray-50 border text-center">
            <strong>VAT</strong>
            <div>{formatNumber(yearlySummary.vat)}</div>
          </div>
          <div className="p-4 bg-gray-50 border text-center font-bold">
            <strong>Total</strong>
            <div>{formatNumber(yearlySummary.total)}</div>
          </div>
        </div>

        <YearlySalesGraph data={yearlyChartData} />
      </div>
    </div>
  );
}
