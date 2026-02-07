"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ProfitRow } from "./MonthlyProfitTable";

interface MonthlyProfitGraphProps {
  rows: ProfitRow[];
}

// Custom tooltip showing sales/cost breakdown like the table
/* function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    const row: ProfitRow = payload[0].payload;

    return (
      <div className="bg-white border border-teal-100 p-3 shadow-lg text-sm rounded w-56">
        <div className="font-semibold mb-2">
          {new Date(row.date).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
          })}
        </div>

      
        <div className="font-semibold text-teal-600 mb-1">Sales</div>
        <div className="flex justify-between pl-2">
          <span>Cash:</span>
          <span>{row.salesBreakdown?.cash?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between pl-2 mb-1">
          <span>Card:</span>
          <span>{row.salesBreakdown?.card?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-teal-200 pt-1 mb-2">
          <span>Total:</span>
          <span>{row.sales.toLocaleString()}</span>
        </div>

        <div className="font-semibold text-gray-600 mb-1">Cost</div>
        <div className="flex justify-between pl-2">
          <span>Salary:</span>
          <span>{row.costBreakdown.salary.toLocaleString()}</span>
        </div>
        {Object.entries(row.costBreakdown.categories).map(([name, value]) => (
          <div key={name} className="flex justify-between pl-2">
            <span>{name}:</span>
            <span>{value.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-1">
          <span>Total:</span>
          <span>{row.cost.toLocaleString()}</span>
        </div>

   
        <div className={`flex justify-between font-semibold mt-2 ${row.result >= 0 ? "text-green-600" : "text-red-600"}`}>
          <span>Result:</span>
          <span>{row.result >= 0 ? `+${row.result.toLocaleString()}` : row.result.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  return null;
} */

// Updated CustomTooltip with VAT details
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (active && payload && payload.length) {
    const row: ProfitRow = payload[0].payload;

    return (
      <div className="bg-white border border-teal-100 p-3 shadow-lg text-sm rounded w-56">
        <div className="font-semibold mb-2">
          {new Date(row.date).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
        </div>

        {/* Sales breakdown */}
        <div className="font-semibold text-teal-600 mb-1">Sales</div>
        <div className="flex justify-between pl-2">
          <span>Excl. VAT:</span>
          <span>{row.salesWithoutVAT?.toLocaleString() ?? 0}</span>
        </div>
        <div className="flex justify-between pl-2">
          <span>VAT:</span>
          <span>{row.vatAmount?.toLocaleString() ?? ((row.salesWithVAT ?? row.sales) - (row.salesWithoutVAT ?? row.sales))}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-teal-200 pt-1 mb-2">
          <span>Total:</span>
          <span>{row.salesWithVAT?.toLocaleString() ?? row.sales.toLocaleString()}</span>
        </div>

        {/* Cost breakdown */}
        <div className="font-semibold text-gray-600 mb-1">Cost</div>
        <div className="flex justify-between pl-2">
          <span>Salary:</span>
          <span>{row.costBreakdown.salary.toLocaleString()}</span>
        </div>
        {Object.entries(row.costBreakdown.categories).map(([name, value]) => (
          <div key={name} className="flex justify-between pl-2">
            <span>{name}:</span>
            <span>{value.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-1">
          <span>Total:</span>
          <span>{row.cost.toLocaleString()}</span>
        </div>

        {/* Result */}
        <div className={`flex justify-between font-semibold mt-2 ${row.result >= 0 ? "text-green-600" : "text-red-600"}`}>
          <span>Result:</span>
          <span>{row.result >= 0 ? `+${row.result.toLocaleString()}` : row.result.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  return null;
}


export default function MonthlyProfitGraph({ rows }: MonthlyProfitGraphProps) {
  const maxValue = Math.max(...rows.flatMap((r: ProfitRow) => [r.sales, r.cost, r.result]));
  const maxAxis = Math.ceil(maxValue / 5000) * 5000;

  const ticks: number[] = [];
  for (let i = 0; i <= maxAxis; i += 5000) ticks.push(i);

  return (
    <div className="mt-8 bg-white p-4 rounded-xs shadow shadow-teal-100">
      <h3 className="font-bold text-teal-900 mb-4 uppercase">
        Sales, Cost & Result Overview
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString(undefined, { day: "2-digit" })
            }
          />
          <YAxis
            orientation="left"
            ticks={ticks}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="sales" name="Sales" fill="#0d9488" />
          <Bar dataKey="cost" name="Cost" fill="#f87171" />
          <Line
            type="monotone"
            dataKey="result"
            name="Result"
            stroke="#16a34a"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
