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
import DailyTotalBarChart from "./CompanyCostAnalysisGraph";
import StackedBarChart from "./StackedBarChart";
import MonthlyStackedBarChart from "./MonthlyStackedBarChart";
import Link from "next/link";

/* ---------------- TYPES ---------------- */
type CostType = { id: string; name: string };
type Cost = { id: string; date: string; amount: number; costType: CostType };

type GroupedItem = { category: string; amount: number };
type GroupedByDate = Record<string, GroupedItem[]>;

type CompanyCostsClientProps = {
  companyId: string;
  initialCostTypes: CostType[];
  initialMonths: string[];
};

function capitalizeFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* ---------------- Month Selector ---------------- */
function MonthSelect({
  months,
  selectedMonth,
  onChange,
}: {
  months: string[];
  selectedMonth: string;
  onChange: (month: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <Calendar />
      <select
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CompanyCostsClient({
  companyId,
  initialCostTypes,
  initialMonths,
}: CompanyCostsClientProps) {
  const [months, setMonths] = useState<string[]>(initialMonths);
  const [month, setMonth] = useState(initialMonths[0] || "");
  const [costTypes, setCostTypes] = useState<CostType[]>(initialCostTypes);
  const [costs, setCosts] = useState<Cost[]>([]);

  const [newType, setNewType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [yearlyYear, setYearlyYear] = useState("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [addingType, setAddingType] = useState(false);
  const [addingCost, setAddingCost] = useState(false);

  const [dailyMonth, setDailyMonth] = useState(initialMonths[0] || "");
  const [stackedMonth, setStackedMonth] = useState(initialMonths[0] || "");

  useEffect(() => {
    async function load() {
      setLoadingPage(true);

      // Fetch cost types if not provided
      if (!initialCostTypes.length) {
        const types = await getCompanyCostTypes();
        setCostTypes(types);
      }

      // Fetch months if not provided
      if (!initialMonths.length) {
        const m = await getAvailableCostMonths();
        setMonths(m);
        if (m.length) {
          setMonth(m[0]);
          setDailyMonth(m[0]);
          setStackedMonth(m[0]);
        }
      }

      setLoadingPage(false);
    }
    load();
  }, [initialCostTypes, initialMonths]);

  useEffect(() => {
    if (!months.length) return;

    setLoadingMonth(true);
    Promise.all(months.map((m) => getMonthlyCosts(m)))
      .then((allData) => {
        const flattened = allData.flat();
        setCosts(
          flattened.map((c) => ({
            id: c.id,
            date: c.date.toISOString(),
            amount: c.amount,
            costType: {
              id: c.costType.id,
              name: c.costType.name,
            },
          }))
        );
      })
      .finally(() => setLoadingMonth(false));
  }, [months]);

  useEffect(() => {
    if (!costs.length) return;
    const yearsSet = new Set(costs.map((c) => c.date.slice(0, 4)));
    const yearsArray = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
    setAvailableYears(yearsArray);
    if (!yearlyYear && yearsArray.length) setYearlyYear(yearsArray[0]);
  }, [costs, yearlyYear]);

  const addType = async () => {
    if (!newType.trim() || addingType) return;
    const exists = costTypes.some(
      (t) => t.name === newType.trim().toLowerCase()
    );
    if (exists) return alert("Cost type already exists");

    setAddingType(true);
    await addCompanyCostType(newType);
    setNewType("");
    setCostTypes(await getCompanyCostTypes());
    setAddingType(false);
  };

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

    const allData = await Promise.all(months.map((m) => getMonthlyCosts(m)));
    const flattened = allData.flat();
    setCosts(
      flattened.map((c) => ({
        id: c.id,
        date: c.date.toISOString(),
        amount: c.amount,
        costType: { id: c.costType.id, name: c.costType.name },
      }))
    );

    setAddingCost(false);
  };

  /* -------- Filtered costs -------- */
  const filteredDailyCosts = useMemo(
    () => costs.filter((c) => c.date.startsWith(dailyMonth)),
    [costs, dailyMonth]
  );
  const filteredStackedCosts = useMemo(
    () => costs.filter((c) => c.date.startsWith(stackedMonth)),
    [costs, stackedMonth]
  );

  const dailyTotalGraphData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredDailyCosts.forEach((c) => {
      const day = c.date.slice(0, 10);
      map[day] = (map[day] || 0) + c.amount;
    });
    return Object.entries(map).map(([date, total]) => ({ date, total }));
  }, [filteredDailyCosts]);

  const stackedGraphData = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    filteredStackedCosts.forEach((c) => {
      const day = c.date.slice(0, 10);
      const category = capitalizeFirst(c.costType.name);
      if (!map[day]) map[day] = {};
      map[day][category] = (map[day][category] || 0) + c.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, categories]) => ({ date, ...categories }));
  }, [filteredStackedCosts]);

  const allCategories = useMemo(() => {
    const set = new Set(costs.map((c) => capitalizeFirst(c.costType.name)));
    return Array.from(set).sort();
  }, [costs]);

  const grandTotal = useMemo(
    () =>
      costs
        .filter((c) => c.date.startsWith(month))
        .reduce((sum, c) => sum + c.amount, 0),
    [costs, month]
  );

  const summary = useMemo(() => {
    const acc: Record<string, number> = {};
    costs.forEach(
      (c) => (acc[c.costType.name] = (acc[c.costType.name] || 0) + c.amount)
    );
    return acc;
  }, [costs]);

  const monthlyStackedDataByYear = useMemo(() => {
    if (!yearlyYear) return [];
    const map: Record<string, Record<string, number>> = {};
    costs.forEach((c) => {
      if (!c.date.startsWith(yearlyYear)) return;
      const monthKey = c.date.slice(0, 7);
      const category = capitalizeFirst(c.costType.name);
      if (!map[monthKey]) map[monthKey] = {};
      map[monthKey][category] = (map[monthKey][category] || 0) + c.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, categories]) => ({ month, ...categories }));
  }, [costs, yearlyYear]);

  const groupedByDate: GroupedByDate = useMemo(() => {
    if (!month) return {};
    return costs
      .filter((c) => c.date.startsWith(month))
      .reduce((acc: GroupedByDate, c) => {
        const dateKey = c.date.slice(0, 10);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({
          category: capitalizeFirst(c.costType.name),
          amount: c.amount,
        });
        return acc;
      }, {});
  }, [costs, month]);

  if (loadingPage)
    return (
      <div className="p-6 mt-20 text-center text-gray-500">
        Loading company costs…
      </div>
    );
  return (
    <div className="p-4 md:p-6 mt-20 max-w-full md:max-w-7xl mx-auto space-y-6 mb-20">
    

      {/* Add Cost Type */}
      <div className="bg-amber-100 p-4 rounded-xs">
        <label className="block mb-2 text-sm font-medium text-teal-700">
          Add New Cost Category (e.g., Electricity, Rent)
        </label>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter category name"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="border border-teal-300 bg-white rounded-xs p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={addType}
            disabled={addingType}
            className="bg-teal-800 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 disabled:opacity-50 w-full md:w-[200px] rounded-xs transition-colors"
          >
            {addingType ? "Adding…" : "Add Cost category"}
          </button>
        </div>
      </div>

      {/* Add Cost */}
      <div className="bg-white p-4 my-15 border border-teal-200 rounded-xs">
        <label className="block mb-6 text-sm font-medium text-teal-700 ">
          Add New Cost (Pick a category below)
        </label>
        <div className="flex flex-wrap justify-between gap-6">
          {/* Date Picker */}
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-teal-300 w-32 rounded-xs h-8 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {costTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1 rounded-full border transition-colors cursor-pointer
            ${
              selectedType === t.id
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-teal-900 border-teal-300 hover:bg-teal-100"
            }`}
              >
                {capitalizeFirst(t.name)}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Amount"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-teal-300 rounded-xs h-8 p-2 w-32 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* Add Button */}
          <button
            onClick={addCost}
            disabled={addingCost || !selectedType || !date || !amount}
            className="bg-teal-800 hover:bg-teal-700 h-8 text-white px-4 rounded-xs disabled:opacity-60 md:col-span-2 transition-colors"
          >
            {addingCost ? "Saving…" : "Add Cost"}
          </button>
        </div>
      </div>


  {/* Top-level Month Selector */}
      <div className="bg-white flex justify-between gap-3 items-start md:items-center">
        <Link
          href="/company/analysis"
          className="text-teal-900 bg-teal-200 hover:bg-teal-100 px-4 py-2 text-[12px] font-semibold uppercase rounded-xs border border-teal-200 transition flex items-center gap-2"
        >
          Go to analysis <span>➠</span>
        </Link>
        <div className="flex items-center gap-1 py-0.5 flex-wrap text-teal-900 border border-teal-200 px-1">
          <Calendar />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xs px-3 py-1"
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
      </div>
      {/* Costs Table */}
      <div className="bg-white shadow border overflow-x-auto">
        <table className="min-w-[400px] w-full border table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Date</th>
              <th className="p-2 border text-left">Category & Amount</th>
              <th className="p-2 border text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByDate).map(([date, items]) => {
              const dateTotal = items.reduce((sum, i) => sum + i.amount, 0);
              return (
                <tr key={date}>
                  <td className="p-2 border font-medium">{date}</td>
                  <td className="p-2 border">
                    {items.map((i, idx) => (
                      <div key={idx}>
                        {i.category}: {i.amount}
                      </div>
                    ))}
                  </td>
                  <td className="p-2 border text-right font-medium">
                    {dateTotal}
                  </td>
                </tr>
              );
            })}
            {costs.length > 0 && (
              <tr className="bg-gray-100 font-bold">
                <td className="p-2 border" colSpan={2}>
                  Total
                </td>
                <td className="p-2 border text-right">{grandTotal}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {Object.keys(summary).length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 min-w-[400px]">
            {Object.entries(summary).map(([k, v]) => (
              <div key={k} className="p-4 bg-teal-50 border">
                <strong>{capitalizeFirst(k)}</strong>
                <div>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="space-y-6">
        {dailyTotalGraphData.length > 0 && (
          <div className="bg-white border shadow p-4">
            <MonthSelect
              months={months}
              selectedMonth={dailyMonth}
              onChange={setDailyMonth}
            />
            <DailyTotalBarChart
              title="Daily Total Cost"
              data={dailyTotalGraphData}
            />
          </div>
        )}

        {stackedGraphData.length > 0 && allCategories.length > 0 && (
          <div className="overflow-x-auto bg-white border shadow p-4">
            <MonthSelect
              months={months}
              selectedMonth={stackedMonth}
              onChange={setStackedMonth}
            />
            <div className="min-w-[300px] md:min-w-[700px]">
              <StackedBarChart
                title="Daily Costs by Category"
                data={stackedGraphData}
                categories={allCategories}
              />
            </div>
          </div>
        )}

        {monthlyStackedDataByYear.length > 0 && allCategories.length > 0 && (
          <div className="overflow-x-auto bg-white border shadow p-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Calendar />
              <select
                value={yearlyYear}
                onChange={(e) => setYearlyYear(e.target.value)}
                className="border p-2"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[300px] md:min-w-[700px]">
              <MonthlyStackedBarChart
                title={`Monthly Costs by Category (${yearlyYear})`}
                data={monthlyStackedDataByYear}
                categories={allCategories}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
