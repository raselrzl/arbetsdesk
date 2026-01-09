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
};

type Props = {
  data: GraphData[];
};

export default function YearlySalesGraph({ data }: Props) {
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
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="cash" stroke="#4ade80" name="Cash" />
                <Line type="monotone" dataKey="card" stroke="#3b82f6" name="Card" />
                <Line type="monotone" dataKey="total" stroke="#facc15" name="Total" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="cash" fill="#4ade80" name="Cash" />
                <Bar dataKey="card" fill="#3b82f6" name="Card" />
                <Bar dataKey="total" fill="#facc15" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
