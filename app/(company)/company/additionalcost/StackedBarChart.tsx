"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StackedBarChartProps = {
  title: string;
  data: Record<string, any>[]; // [{ date: '2026-01-01', Rent: 100, Food: 50 }]
  categories: string[]; // ["Rent", "Food", "Salary"]
  height?: number;
};

const COLORS = [
  "#0d9488",
  "#f97316",
  "#8b5cf6",
  "#ef4444",
  "#3b82f6",
  "#14b8a6",
  "#facc15",
  "#10b981",
  "#ec4899",
  "#6366f1",
];

export default function StackedBarChart({
  title,
  data,
  categories,
  height = 300,
}: StackedBarChartProps) {
  return (
    <div className="bg-white border shadow p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {categories.map((cat, idx) => (
              <Bar
                key={cat}
                dataKey={cat}
                stackId="a"
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
