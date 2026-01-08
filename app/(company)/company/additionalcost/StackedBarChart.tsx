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
  LabelList,
} from "recharts";

type StackedBarChartProps = {
  title: string;
  data: Record<string, any>[]; // [{ date: '2026-01-01', Rent: 100, Food: 50 }]
  categories: string[]; // ["Rent", "Food", "Salary"]
  height?: number;
};

/* -------- Dynamic color generator -------- */
const generateColorMap = (categories: string[]) => {
  const map: Record<string, string> = {};
  const total = categories.length || 1;

  categories.forEach((cat, index) => {
    const hue = Math.round((index * 360) / total); // evenly spaced hues
    map[cat] = `hsl(${hue}, 65%, 55%)`;
  });

  return map;
};

export default function StackedBarChart({
  title,
  data,
  categories,
  height = 300,
}: StackedBarChartProps) {
  const colorMap = useMemo(() => generateColorMap(categories), [categories]);

  // Compute total for each entry
  const totals = useMemo(
    () => data.map((entry) => categories.reduce((sum, c) => sum + (entry[c] || 0), 0)),
    [data, categories]
  );

  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-semibold mb-5 text-teal-900">{title}</h3>

      <div style={{ height }} className="py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            {/* Stacked bars */}
            {categories.map((cat, idx) => (
              <Bar
                key={cat}
                dataKey={cat}
                stackId="a"
                fill={colorMap[cat]}
              >
                {/* Show total on top of the last bar in the stack */}
                {idx === categories.length - 1 && (
                  <LabelList
                    dataKey={(entry) =>
                      categories.reduce((sum, c) => sum + (entry[c] || 0), 0)
                    }
                    position="top"
                    fontWeight="bold"
                    fill="#0f172a"
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Legend below chart */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {categories.map((cat) => (
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
