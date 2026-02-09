"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export function DailyTipsChart({
  dailyTips,
}: {
  dailyTips: { date: string; totalTip: number }[];
}) {
  const data = dailyTips.map((d) => {
    const dateObj = new Date(d.date);

    return {
      day: dateObj.getDate().toString().padStart(2, "0"),
      fullDate: dateObj.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      tip: d.totalTip,
    };
  });

  if (!data.length) return null;

  return (
    <div className="bg-white shadow-lg shadow-[#00687a]/20 p-4 border border-[#00687a]/30">
      <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#00687a] uppercase">
        Daily Tips
      </h2>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[520px] md:min-w-full">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                stroke="#e6f2f4"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#5f8f99" }}
                axisLine={{ stroke: "#cfe5ea" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#5f8f99" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#00687a",
                  borderRadius: "8px",
                  border: "none",
                  color: "white",
                  fontSize: "12px",
                }}
                labelStyle={{ fontWeight: 600 }}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullDate ?? label
                }
                formatter={(value: number) => [
                  value.toFixed(2),
                  "Tips",
                ]}
              />

              <Bar dataKey="tip" fill="#00687a">
                <LabelList
                  dataKey="tip"
                  position="top"
                  formatter={(value) =>
                    typeof value === "number" ? value.toFixed(0) : ""
                  }
                  fill="#00687a"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
