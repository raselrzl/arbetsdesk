"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import {
  addDailySale,
  getAvailableSalesMonths,
  getMonthlySales,
} from "./salesactions";

/* ---------------- TYPES ---------------- */

type Sale = {
  id: string;
  date: string;
  amount: number;
  method: "CASH" | "CARD";
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/* ---------------- MAIN ---------------- */

export default function SalesPage() {
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"CASH" | "CARD" | "">("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [addingSale, setAddingSale] = useState(false);

  /* -------- Load months -------- */
  useEffect(() => {
    async function load() {
      setLoadingPage(true);
      const m = await getAvailableSalesMonths();
      setMonths(m);
      if (m.length) setMonth(m[0]);
      setLoadingPage(false);
    }
    load();
  }, []);

  /* -------- Load monthly sales -------- */
  useEffect(() => {
    if (!month) return;

    setLoadingMonth(true);
    getMonthlySales(month).then((data) => {
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
  }, [month]);

  /* -------- Add sale -------- */
  const addSale = async () => {
    if (!date || !amount || !method || addingSale) return;

    setAddingSale(true);

    await addDailySale({
      date,
      amount: Number(amount),
      method,
    });

    setDate("");
    setAmount("");
    setMethod("");

    const data = await getMonthlySales(month);
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

    return {
      cash,
      card,
      total: cash + card,
    };
  }, [sales]);

  /* -------- Group by date -------- */
  const groupedByDate = useMemo(() => {
    const map: Record<
      string,
      { cash: number; card: number; total: number }
    > = {};

    sales.forEach((s) => {
      const day = s.date.slice(0, 10);

      if (!map[day]) {
        map[day] = { cash: 0, card: 0, total: 0 };
      }

      if (s.method === "CASH") map[day].cash += s.amount;
      if (s.method === "CARD") map[day].card += s.amount;

      map[day].total += s.amount;
    });

    return map;
  }, [sales]);

  if (loadingPage) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading sales…
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      <h1 className="text-2xl md:text-4xl font-bold text-teal-900">
        Sales
      </h1>

      {/* Month selector */}
      <div className="bg-white p-4 shadow border flex items-center gap-3">
        <Calendar />
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
        {loadingMonth && (
          <span className="text-sm text-gray-500">Loading…</span>
        )}
      </div>

      {/* Add sale */}
      <div className="bg-white p-4 shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2"
          />

          <select
            value={method}
            onChange={(e) =>
              setMethod(e.target.value as "CASH" | "CARD")
            }
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
            className="bg-teal-600 text-white px-4 py-2 disabled:opacity-50"
          >
            {addingSale ? "Saving…" : "Add Sale"}
          </button>
        </div>
      </div>

      {/* Sales table (grouped by date) */}
      <div className="bg-white shadow border overflow-x-auto">
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
            {!loadingMonth &&
              Object.keys(groupedByDate).length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500"
                  >
                    No sales for this month
                  </td>
                </tr>
              )}

            {Object.entries(groupedByDate).map(
              ([day, values]) => (
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
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-teal-50 border">
          <strong>Cash</strong>
          <div>{formatNumber(summary.cash)}</div>
        </div>
        <div className="p-4 bg-teal-50 border">
          <strong>Card</strong>
          <div>{formatNumber(summary.card)}</div>
        </div>
        <div className="p-4 bg-teal-100 border font-bold">
          <strong>Total</strong>
          <div>{formatNumber(summary.total)}</div>
        </div>
      </div>
    </div>
  );
}
