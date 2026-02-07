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
  date: string;
  cash: number;
  card: number;
  total: number;
  vat?: number;
};

type Props = {
  data: GraphData[];
  showVat?: boolean; // toggle VAT display
};

type TooltipData = {
  cash: number;
  card: number;
  total: number;
  vat?: number;
  vatBreakdown?: Record<string, number>;
};

const renderTooltip = ({ payload, label }: any) => {
  if (!payload || !payload.length) return null;
  const data = payload[0].payload as TooltipData;
  return (
    <div className="bg-white p-2 border shadow-md text-sm">
      <strong>{label}</strong>
      <div>Cash: {data.cash.toFixed(2)}</div>
      <div>Card: {data.card.toFixed(2)}</div>
      <div>Total: {data.total.toFixed(2)}</div>
      {data.vatBreakdown && (
        <div className="mt-1">
          <strong>VAT Breakdown:</strong>
          {Object.entries(data.vatBreakdown).map(([name, value]) => (
            <div key={name}>
              {name}: {(value as number).toFixed(2)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MonthlySalesGraph({ data, showVat = true }: Props) {
  const [activeTab, setActiveTab] = useState<"line" | "bar">("line");

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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={renderTooltip} />

                <Legend />
                <Line
                  type="monotone"
                  dataKey="cash"
                  stroke="#4ade80"
                  name="Cash"
                />
                <Line
                  type="monotone"
                  dataKey="card"
                  stroke="#3b82f6"
                  name="Card"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#facc15"
                  name="Total"
                />
                {showVat && (
                  <Line
                    type="monotone"
                    dataKey="vat"
                    stroke="#f87171"
                    name="VAT"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={renderTooltip} />

                <Legend />
                <Bar dataKey="cash" fill="#4ade80" name="Cash" />
                <Bar dataKey="card" fill="#3b82f6" name="Card" />
                <Bar dataKey="total" fill="#facc15" name="Total" />
                {showVat && <Bar dataKey="vat" fill="#f87171" name="VAT" />}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
