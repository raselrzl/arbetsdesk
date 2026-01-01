"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import {
  addCompanyCostType,
  addDailyCost,
  getAvailableCostMonths,
  getCompanyCostTypes,
  getMonthlyCosts,
} from "./additionalcostaction";

/* ---------------- TYPES ---------------- */

type CostType = {
  id: string;
  name: string;
};

type Cost = {
  id: string;
  date: string;
  amount: number;
  costType: CostType;
};

function capitalizeFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* ---------------- MAIN ---------------- */

export default function CompanyCostsPage() {
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState("");
  const [costTypes, setCostTypes] = useState<CostType[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);

  const [newType, setNewType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("");

  /* -------- Loading states -------- */
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [addingType, setAddingType] = useState(false);
  const [addingCost, setAddingCost] = useState(false);

  /* -------- Load months & cost types -------- */
  useEffect(() => {
    async function load() {
      setLoadingPage(true);

      const types = await getCompanyCostTypes();
      setCostTypes(types);

      const m = await getAvailableCostMonths();
      setMonths(m);
      if (m.length) setMonth(m[0]);

      setLoadingPage(false);
    }
    load();
  }, []);

  /* -------- Load monthly costs -------- */
  useEffect(() => {
    if (!month) return;

    setLoadingMonth(true);

    getMonthlyCosts(month).then((data) => {
      setCosts(
        data.map((c) => ({
          id: c.id,
          date: c.date.toISOString(),
          amount: c.amount,
          costType: {
            id: c.costType.id,
            name: c.costType.name,
          },
        }))
      );
      setLoadingMonth(false);
    });
  }, [month]);

  /* -------- Add cost type -------- */
  const addType = async () => {
    if (!newType.trim() || addingType) return;

    const exists = costTypes.some(
      (t) => t.name === newType.trim().toLowerCase()
    );
    if (exists) {
      alert("Cost type already exists");
      return;
    }

    setAddingType(true);
    await addCompanyCostType(newType);
    setNewType("");
    setCostTypes(await getCompanyCostTypes());
    setAddingType(false);
  };

  /* -------- Add cost -------- */
  const addCost = async () => {
    if (!date || !amount || !selectedType || addingCost) return;

    setAddingCost(true);

    await addDailyCost({
      date,
      amount: Number(amount),
      costTypeId: selectedType,
    });

    setDate("");
    setAmount("");

    const data = await getMonthlyCosts(month);
    setCosts(
      data.map((c) => ({
        id: c.id,
        date: c.date.toISOString(),
        amount: c.amount,
        costType: {
          id: c.costType.id,
          name: c.costType.name,
        },
      }))
    );

    setAddingCost(false);
  };

  /* -------- Monthly summary -------- */
  const summary = useMemo(() => {
    const acc: Record<string, number> = {};
    costs.forEach((c) => {
      acc[c.costType.name] = (acc[c.costType.name] || 0) + c.amount;
    });
    return acc;
  }, [costs]);

  if (loadingPage) {
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading company costs…
      </div>
    );
  }

 return (
  <div className="p-4 md:p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
    <h1 className="text-2xl md:text-4xl font-bold">Company Costs</h1>

    {/* Month Selector */}
    <div className="bg-white p-4 shadow border flex flex-col md:flex-row gap-3 items-start md:items-center">
      <div className="flex items-center gap-2">
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
      </div>

      {loadingMonth && (
        <span className="text-sm text-gray-500">Loading…</span>
      )}
    </div>

    {/* Add Cost Type */}
    <div className="bg-white p-4 shadow border">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          placeholder="New cost category"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addType}
          disabled={addingType}
          className="bg-teal-600 text-white px-4 py-2 disabled:opacity-50 w-full md:w-auto"
        >
          {addingType ? "Adding…" : "Add Category"}
        </button>
      </div>
    </div>

    {/* Add Cost */}
    <div className="bg-white p-4 shadow border">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select category</option>
          {costTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {capitalizeFirst(t.name)}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={addCost}
          disabled={addingCost}
          className="bg-teal-600 text-white px-4 py-2 disabled:opacity-50 md:col-span-2"
        >
          {addingCost ? "Saving…" : "Add Cost"}
        </button>
      </div>
    </div>

    {/* Costs Table */}
    <div className="bg-white shadow border overflow-x-auto">
      <table className="min-w-[600px] w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">Date</th>
            <th className="p-2 border text-left">Category</th>
            <th className="p-2 border text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {loadingMonth && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                Loading costs…
              </td>
            </tr>
          )}

          {!loadingMonth && costs.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No costs added for this month
              </td>
            </tr>
          )}

          {costs.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">
                {c.date.slice(0, 10)}
              </td>
              <td className="p-2 border">
                {capitalizeFirst(c.costType.name)}
              </td>
              <td className="p-2 border text-right">
                {c.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Summary */}
    {Object.keys(summary).length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(summary).map(([k, v]) => (
          <div key={k} className="p-4 bg-teal-50 border">
            <strong>{capitalizeFirst(k)}</strong>
            <div>{v}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
