"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MonthlyStackedBarChartProps = {
  title: string;
  data: Record<string, any>[]; // { month: "YYYY-MM", Category1: number, Category2: number, ... }
  categories: string[];
  height?: number;
};

const colors = [
  "#0d9488", "#f97316", "#6366f1", "#ef4444", "#facc15", "#3b82f6",
  "#10b981", "#8b5cf6", "#f43f5e", "#14b8a6",
];

export default function MonthlyStackedBarChart({
  title,
  data,
  categories,
  height = 400,
}: MonthlyStackedBarChartProps) {
  return (
    <div className="bg-white border shadow p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {categories.map((cat, idx) => (
              <Bar key={cat} dataKey={cat} stackId="a" fill={colors[idx % colors.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
