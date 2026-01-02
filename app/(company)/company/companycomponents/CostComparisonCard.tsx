// CostComparisonCard.tsx (SERVER COMPONENT)

import { prisma } from "@/app/utils/db";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cookies } from "next/headers";

// ---------------- HELPERS ----------------

function formatNumber(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSunday(monday: Date) {
  const d = new Date(monday);
  d.setDate(monday.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

async function getCostsBetween(companyId: string, start: Date, end: Date) {
  const result = await prisma.cost.aggregate({
    where: {
      companyId,
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount ?? 0;
}

// ---------------- COMPONENT ----------------

export default async function CostComparisonCard() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const today = new Date();

  // This week
  const thisWeekStart = getMonday(today);
  const thisWeekEnd = getSunday(thisWeekStart);

  // Last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = getSunday(lastWeekStart);

  const thisWeekCost = await getCostsBetween(
    companyId,
    thisWeekStart,
    thisWeekEnd
  );

  const lastWeekCost = await getCostsBetween(
    companyId,
    lastWeekStart,
    lastWeekEnd
  );

  const diff = thisWeekCost - lastWeekCost;

  const comparison = diff > 0 ? "more" : diff < 0 ? "less" : "equal";

  const Icon =
    comparison === "more" ? ArrowUp : comparison === "less" ? ArrowDown : Clock;

  const color =
    comparison === "more"
      ? "text-red-600"
      : comparison === "less"
      ? "text-green-600"
      : "text-gray-500";

  return (
    <div className="bg-white p-4 mx-2 py-3 rounded-xs shadow border border-teal-100 max-w-md">
      <div className="flex items-center gap-4">
        <div className="bg-teal-50 p-4 rounded-full">
          <Clock className="w-10 h-10 text-teal-900" />
        </div>

        <div>
          <p className="text-sm text-gray-400 font-semibold">
            Costs (this week)
          </p>
          <p className="text-2xl font-extrabold">
            {formatNumber(thisWeekCost)}
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>Last week: {formatNumber(lastWeekCost)}</p>

        <p>
          Difference: {diff > 0 ? "+" : diff < 0 ? "-" : ""}
          {formatNumber(Math.abs(diff))}
        </p>
      </div>

      <div className={`mt-4 flex items-center text-lg font-bold ${color}`}>
        <Icon className="w-5 h-5 mr-2" />
        {comparison === "equal"
          ? "Same as last week"
          : `This week is ${comparison}`}
      </div>
    </div>
  );
}
