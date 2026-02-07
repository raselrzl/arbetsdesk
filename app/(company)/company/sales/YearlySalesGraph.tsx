"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

type GraphData = {
  month: string;
  cash: number;
  card: number;
  total: number;
  vatBreakdown?: Record<string, number>; // ✅ VAT by category
};

type Props = {
  data: GraphData[];
  showVat?: boolean;
};

export default function YearlySalesGraph({ data, showVat = true }: Props) {
  const [activeTab, setActiveTab] = useState<"line" | "bar">("line");

  // Gather all VAT categories dynamically
  const vatCategories = Array.from(
    new Set(
      data.flatMap((d) =>
        d.vatBreakdown ? Object.keys(d.vatBreakdown) : []
      )
    )
  );

  const renderTooltip = ({ payload, label }: any) => {
    if (!payload || !payload.length) return null;
    const d = payload[0].payload as GraphData;
    return (
      <div className="bg-white p-2 border shadow-md text-sm">
        <strong>{label}</strong>
        <div>Cash: ${d.cash.toFixed(2)}</div>
        <div>Card: ${d.card.toFixed(2)}</div>
        <div>Total: ${d.total.toFixed(2)}</div>
        {d.vatBreakdown && (
          <div className="mt-1">
            <strong>VAT Breakdown:</strong>
            {Object.entries(d.vatBreakdown).map(([name, value]) => (
              <div key={name}>
                {name}: ${(value as number).toFixed(2)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-2">
        <button
          className={`flex-1 p-2 font-semibold ${
            activeTab === "line" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("line")}
        >
          Line Graph
        </button>
        <button
          className={`flex-1 p-2 font-semibold ${
            activeTab === "bar" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("bar")}
        >
          Bar Graph
        </button>
      </div>

      {/* Graph */}
      <div className="p-4 border rounded bg-gray-50 w-full overflow-x-auto">
        <div className="min-w-[700px] h-72">
          {activeTab === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Line type="monotone" dataKey="cash" stroke="#4ade80" name="Cash" />
                <Line type="monotone" dataKey="card" stroke="#3b82f6" name="Card" />
                <Line type="monotone" dataKey="total" stroke="#facc15" name="Total" />
                {showVat &&
                  vatCategories.map((vatName, idx) => (
                    <Line
                      key={vatName}
                      type="monotone"
                      dataKey={(d: any) =>
                        d.vatBreakdown?.[vatName] ?? 0
                      }
                      stroke={["#f87171", "#fb923c", "#a855f7", "#22d3ee"][idx % 4]}
                      name={vatName}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Bar dataKey="cash" fill="#4ade80" name="Cash" />
                <Bar dataKey="card" fill="#3b82f6" name="Card" />
                <Bar dataKey="total" fill="#facc15" name="Total" />
                {showVat &&
                  vatCategories.map((vatName, idx) => (
                    <Bar
                      key={vatName}
                      dataKey={(d: any) =>
                        d.vatBreakdown?.[vatName] ?? 0
                      }
                      fill={["#f87171", "#fb923c", "#a855f7", "#22d3ee"][idx % 4]}
                      name={vatName}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
