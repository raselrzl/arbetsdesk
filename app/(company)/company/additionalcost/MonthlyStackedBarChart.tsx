"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyStackedBarChartProps = {
  title: string;
  data: Record<string, any>[]; // { month: "YYYY-MM", Category1: number, Category2: number, ... }
  categories: string[];
  height?: number;
};

/* -------- Dynamic color generator -------- */
const generateColorMap = (categories: string[]) => {
  const map: Record<string, string> = {};
  const total = categories.length || 1;

  categories.forEach((cat: string, index: number) => {
    const hue = Math.round((index * 360) / total); // evenly spaced hues
    map[cat] = `hsl(${hue}, 65%, 55%)`;
  });

  return map;
};

/* -------- Custom Tooltip to show total with category colors -------- */
const CustomTooltip = ({
  active,
  payload,
  label,
  categories,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  categories: string[];
}) => {
  if (active && payload && payload.length) {
    const total: number = categories.reduce(
      (sum: number, c: string) =>
        sum + (payload.find((p: any) => p.dataKey === c)?.value || 0),
      0
    );

    return (
      <div className="bg-white border p-2 shadow-lg text-sm">
        <div className="font-semibold mb-1">{label}</div>
        {categories.map((c: string) => {
          const barData = payload.find((p: any) => p.dataKey === c);
          const val = barData?.value || 0;
          const color = barData?.fill || "#000";
          return (
            <div key={c} className="flex justify-between">
              <span style={{ color }}>{c}</span>
              <span>{val}</span>
            </div>
          );
        })}
        <div className="border-t mt-1 pt-1 font-bold flex justify-between">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
    );
  }

  return null;
};

export default function MonthlyStackedBarChart({
  title,
  data,
  categories,
  height = 400,
}: MonthlyStackedBarChartProps) {
  const colorMap = useMemo(() => generateColorMap(categories), [categories]);

  return (
    <div className="bg-white  p-4">
      <h3 className="text-lg font-semibold mb-5 text-teal-900">{title}</h3>

      <div style={{ height }} className="py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            {/* Custom tooltip with category colors */}
            <Tooltip content={<CustomTooltip categories={categories} />} />

            {/* Stacked bars */}
            {categories.map((cat: string) => (
              <Bar key={cat} dataKey={cat} stackId="a" fill={colorMap[cat]} />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Legend below chart */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {categories.map((cat: string) => (
            <div key={cat} className="flex items-center gap-2 text-sm">
              <span
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colorMap[cat] }}
              />
              <span className="text-teal-900 font-medium">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
