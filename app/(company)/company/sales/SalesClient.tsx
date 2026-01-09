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
  amount: number;
  method: "CASH" | "CARD";
};

type Props = {
  companyId: string;
  initialMonths: string[];
  initialYears: number[];
};

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
  // Filter only years >= 2026
  const filteredYears = initialYears.sort((a, b) => b - a);

  const [months, setMonths] = useState(initialMonths);
  const [month, setMonth] = useState(initialMonths[0] || "");
  const [sales, setSales] = useState<Sale[]>([]);

  const [year, setYear] = useState(filteredYears[0] || 2026);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"CASH" | "CARD" | "">("");

  const [loadingMonth, setLoadingMonth] = useState(false);
  const [addingSale, setAddingSale] = useState(false);

  // Yearly state
  const [yearlyYear, setYearlyYear] = useState(filteredYears[0] || 2026);
  const [yearlySales, setYearlySales] = useState<Sale[]>([]);
  const [loadingYear, setLoadingYear] = useState(false);

  /* -------- Load monthly sales -------- */
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
        }))
      );
      setLoadingMonth(false);
    });
  }, [month, companyId]);

  /* -------- Add sale -------- */
  const addSale = async () => {
    if (!date || !amount || !method || addingSale) return;

    setAddingSale(true);

    await addDailySale(companyId, { date, amount: Number(amount), method });

    setDate("");
    setAmount("");
    setMethod("");

    const data = await getMonthlySalesByCompany(companyId, month);
    setSales(
      data.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        amount: s.amount,
        method: s.method,
      }))
    );

    setAddingSale(false);
  };

  /* -------- Monthly summary -------- */
  const summary = useMemo(() => {
    let cash = 0;
    let card = 0;

    sales.forEach((s) => {
      if (s.method === "CASH") cash += s.amount;
      if (s.method === "CARD") card += s.amount;
    });

    return { cash, card, total: cash + card };
  }, [sales]);

  /* -------- Group by date -------- */
  const groupedByDate = useMemo(() => {
    const map: Record<string, { cash: number; card: number; total: number }> =
      {};

    sales.forEach((s) => {
      const day = s.date.slice(0, 10);
      if (!map[day]) map[day] = { cash: 0, card: 0, total: 0 };
      if (s.method === "CASH") map[day].cash += s.amount;
      if (s.method === "CARD") map[day].card += s.amount;
      map[day].total += s.amount;
    });

    return map;
  }, [sales]);

  const chartData = useMemo(() => {
    return Object.entries(groupedByDate).map(([date, values]) => ({
      date,
      cash: values.cash,
      card: values.card,
      total: values.total,
    }));
  }, [groupedByDate]);

  // Load yearly sales
  useEffect(() => {
    if (!yearlyYear) return;
    setLoadingYear(true);
    getYearlySalesByCompany(companyId, yearlyYear).then((data) => {
      setYearlySales(
        data.map((s) => ({
          id: s.id,
          date: s.date.toISOString(),
          amount: s.amount,
          method: s.method,
        }))
      );
      setLoadingYear(false);
    });
  }, [yearlyYear, companyId]);

  // Group yearly sales by month
  const groupedByMonth = useMemo(() => {
    const map: Record<string, { cash: number; card: number; total: number }> =
      {};

    yearlySales.forEach((s) => {
      const d = new Date(s.date);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!map[month]) map[month] = { cash: 0, card: 0, total: 0 };
      if (s.method === "CASH") map[month].cash += s.amount;
      if (s.method === "CARD") map[month].card += s.amount;
      map[month].total += s.amount;
    });

    // Ensure all 12 months exist
    for (let m = 1; m <= 12; m++) {
      const key = `${yearlyYear}-${String(m).padStart(2, "0")}`;
      if (!map[key]) map[key] = { cash: 0, card: 0, total: 0 };
    }

    return map;
  }, [yearlySales, yearlyYear]);

  // Prepare chart data
  const yearlyChartData = useMemo(() => {
    return Object.entries(groupedByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month,
        cash: values.cash,
        card: values.card,
        total: values.total,
      }));
  }, [groupedByMonth]);

  // Yearly summary
  const yearlySummary = useMemo(() => {
    let cash = 0,
      card = 0;
    Object.values(groupedByMonth).forEach((v) => {
      cash += v.cash;
      card += v.card;
    });
    return { cash, card, total: cash + card };
  }, [groupedByMonth]);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 my-20">
      {/* Add sale */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xs border">
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
          <option value="">Payment method</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
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

      {/* Month selector + Analysis link */}
      <div className="flex justify-between items-center gap-3 bg-gray-50 p-3 rounded-xs border">
        {/* Link to Analysis */}
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

        {/* Month selector */}
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

      {/* Sales table */}
      <div className="overflow-x-auto border rounded-xs">
        <table className="min-w-[700px] w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Date</th>
              <th className="p-2 border text-right">Cash</th>
              <th className="p-2 border text-right">Card</th>
              <th className="p-2 border text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByDate).map(([day, values]) => (
              <tr key={day}>
                <td className="p-2 border">{day}</td>
                <td className="p-2 border text-right">
                  {formatNumber(values.cash)}
                </td>
                <td className="p-2 border text-right">
                  {formatNumber(values.card)}
                </td>
                <td className="p-2 border text-right font-semibold">
                  {formatNumber(values.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-gray-50 border text-center">
          <strong>Cash</strong>
          <div>{formatNumber(summary.cash)}</div>
        </div>
        <div className="p-4 bg-gray-50 border text-center">
          <strong>Card</strong>
          <div>{formatNumber(summary.card)}</div>
        </div>
        <div className="p-4 bg-gray-50 border text-center font-bold">
          <strong>Total</strong>
          <div>{formatNumber(summary.total)}</div>
        </div>
      </div>

      <MonthlySalesGraph data={chartData} />

      {/* Yearly Sales Section */}
      <div className="space-y-6 mt-10">
        <h2 className="text-xl font-semibold">Yearly Sales</h2>

        {/* Year selector */}
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

        {/* Yearly table */}
        <div className="overflow-x-auto border rounded-xs">
          <table className="min-w-[700px] w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Month</th>
                <th className="p-2 border text-right">Cash</th>
                <th className="p-2 border text-right">Card</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }).map((_, i) => {
                const key = `${yearlyYear}-${String(i + 1).padStart(2, "0")}`;
                const values = groupedByMonth[key] || {
                  cash: 0,
                  card: 0,
                  total: 0,
                };
                const monthName = MONTH_NAMES[i]; // fixed, no toLocaleString

                return (
                  <tr key={key}>
                    <td className="p-2 border">{monthName}</td>
                    <td className="p-2 border text-right">
                      {formatNumber(values.cash)}
                    </td>
                    <td className="p-2 border text-right">
                      {formatNumber(values.card)}
                    </td>
                    <td className="p-2 border text-right font-semibold">
                      {formatNumber(values.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Yearly summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-gray-50 border text-center">
            <strong>Cash</strong>
            <div>{formatNumber(yearlySummary.cash)}</div>
          </div>
          <div className="p-4 bg-gray-50 border text-center">
            <strong>Card</strong>
            <div>{formatNumber(yearlySummary.card)}</div>
          </div>
          <div className="p-4 bg-gray-50 border text-center font-bold">
            <strong>Total</strong>
            <div>{formatNumber(yearlySummary.total)}</div>
          </div>
        </div>

        {/* Yearly Graph */}
        <YearlySalesGraph data={yearlyChartData} />
      </div>
    </div>
  );
}
