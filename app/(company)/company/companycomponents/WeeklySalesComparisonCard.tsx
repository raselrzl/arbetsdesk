// WeeklySalesComparisonCard.tsx (SERVER COMPONENT)

import { prisma } from "@/app/utils/db";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cookies } from "next/headers";

// ---------------- HELPERS ----------------

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

async function getSalesBetween(companyId: string, start: Date, end: Date) {
  const sales = await prisma.sale.findMany({
    where: {
      companyId,
      date: { gte: start, lte: end },
    },
    select: {
      amount: true,
      method: true,
    },
  });

  const totals: { cash: number; card: number } = { cash: 0, card: 0 };

  for (const s of sales) {
    if (s.method === "CASH") totals.cash += s.amount;
    else totals.card += s.amount;
  }

  totals.cash = Math.round(totals.cash * 100) / 100;
  totals.card = Math.round(totals.card * 100) / 100;

  return totals;
}

// ---------------- COMPONENT ----------------

export default async function WeeklySalesComparisonCard() {
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

  // Fetch totals
  const thisWeekSales = await getSalesBetween(
    companyId,
    thisWeekStart,
    thisWeekEnd
  );
  const lastWeekSales = await getSalesBetween(
    companyId,
    lastWeekStart,
    lastWeekEnd
  );

  // Total sales difference
  const thisTotal = thisWeekSales.cash + thisWeekSales.card;
  const lastTotal = lastWeekSales.cash + lastWeekSales.card;
  const diff = thisTotal - lastTotal;

  const comparison = diff > 0 ? "more" : diff < 0 ? "less" : "equal";
  const Icon =
    comparison === "more" ? ArrowUp : comparison === "less" ? ArrowDown : Clock;
  const color =
    comparison === "more"
      ? "text-green-600"
      : comparison === "less"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="bg-white p-4 mx-2 py-3 rounded-xs shadow border border-teal-100 max-w-md">
      <div className="flex items-center gap-4">
        <div className="bg-teal-50 p-4 rounded-full">
          <Clock className="w-10 h-10 text-teal-900" />
        </div>

        <div>
          <p className="text-sm text-gray-400 font-semibold">
            Sales (this week)
          </p>
          <p className="text-2xl font-extrabold">
            {thisTotal} <br />{" "}
            <span className="text-xs text-gray-500">
              Cash: {thisWeekSales.cash} / Card: {thisWeekSales.card}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>
          Last week: Total: {lastTotal} | Cash: {lastWeekSales.cash} | Card:{" "}
          {lastWeekSales.card}
        </p>
        <p>
          Difference: {diff > 0 ? "+" : diff < 0 ? "-" : ""}
          {Math.abs(diff)}
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
