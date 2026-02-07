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
    { cash: number; card: number; vat: number; total: number; vatBreakdown: Record<string, number> }
  > = {};

  sales.forEach((s) => {
    const day = s.date.slice(0, 10);
    const value = getSaleValue(s, vatView);
    const vat = getVatAmount(s);
    const vatName = s.vatTypeName || `VAT ${s.vatRate ? s.vatRate * 100 : 0}%`;

    if (!map[day])
      map[day] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };

    if (s.method === "CASH") map[day].cash += value;
    if (s.method === "CARD") map[day].card += value;

    map[day].total += value;
    map[day].vat += vat;

    map[day].vatBreakdown[vatName] = (map[day].vatBreakdown[vatName] || 0) + vat;
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
    { cash: number; card: number; vat: number; total: number; vatBreakdown: Record<string, number> }
  > = {};

  yearlySales.forEach((s) => {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const value = getSaleValue(s, vatView);
    const vat = getVatAmount(s);
    const vatName = s.vatTypeName || `VAT ${s.vatRate ? s.vatRate * 100 : 0}%`;

    if (!map[key]) map[key] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };

    if (s.method === "CASH") map[key].cash += value;
    if (s.method === "CARD") map[key].card += value;
    map[key].total += value;
    map[key].vat += vat;

    map[key].vatBreakdown[vatName] = (map[key].vatBreakdown[vatName] || 0) + vat;
  });

  // fill empty months
  for (let m = 1; m <= 12; m++) {
    const key = `${yearlyYear}-${String(m).padStart(2, "0")}`;
    if (!map[key]) map[key] = { cash: 0, card: 0, vat: 0, total: 0, vatBreakdown: {} };
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
      <div className="overflow-x-auto border rounded-xs">
        <table className="min-w-[700px] w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Date</th>
              <th className="p-2 border text-right">Cash</th>
              <th className="p-2 border text-right">Card</th>
              <th className="p-2 border text-right">VAT</th>
              <th className="p-2 border text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByDate).map(([day, v]) => (
              <tr key={day}>
                <td className="p-2 border">{day}</td>
                <td className="p-2 border text-right">
                  {formatNumber(v.cash)}
                </td>
                <td className="p-2 border text-right">
                  {formatNumber(v.card)}
                </td>
                <td className="p-2 border text-right">{formatNumber(v.vat)}</td>
                <td className="p-2 border text-right font-semibold">
                  {formatNumber(v.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

        {/* Yearly Table */}
        <div className="overflow-x-auto border rounded-xs">
          <table className="min-w-[700px] w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Month</th>
                <th className="p-2 border text-right">Cash</th>
                <th className="p-2 border text-right">Card</th>
                <th className="p-2 border text-right">VAT</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }).map((_, i) => {
                const key = `${yearlyYear}-${String(i + 1).padStart(2, "0")}`;
                const v = groupedByMonth[key] || {
                  cash: 0,
                  card: 0,
                  vat: 0,
                  total: 0,
                };
                return (
                  <tr key={key}>
                    <td className="p-2 border">{MONTH_NAMES[i]}</td>
                    <td className="p-2 border text-right">
                      {formatNumber(v.cash)}
                    </td>
                    <td className="p-2 border text-right">
                      {formatNumber(v.card)}
                    </td>
                    <td className="p-2 border text-right">
                      {formatNumber(v.vat)}
                    </td>
                    <td className="p-2 border text-right font-semibold">
                      {formatNumber(v.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
