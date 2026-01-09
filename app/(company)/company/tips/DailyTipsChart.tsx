"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function DailyTipsChart({
  dailyTips,
}: {
  dailyTips: { date: string; totalTip: number }[];
}) {
  const data = dailyTips.map((d) => ({
    day: d.date.slice(-2),
    tip: d.totalTip,
  }));

  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xs shadow p-4 border border-teal-100">
      <h2 className="text-lg md:text-xl font-semibold mb-3">
        Daily Tips Trend
      </h2>

      {/* horizontal scroll on very small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] md:min-w-full">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tip"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
