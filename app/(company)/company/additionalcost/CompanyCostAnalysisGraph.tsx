"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type DailyTotalBarChartProps = {
  title: string;
  data: {
    date: string;
    total: number;
  }[];
  height?: number;
  color?: string;
};

export default function DailyTotalBarChart({
  title,
  data,
  height = 300,
  color = "#0d9488",
}: DailyTotalBarChartProps) {
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
            <Bar dataKey="total" fill={color}>
              <LabelList
                dataKey="total"
                position="top"
                formatter={(v) =>
                  typeof v === "number" ? v.toFixed(0) : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
