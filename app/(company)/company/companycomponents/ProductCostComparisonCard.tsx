import { prisma } from "@/app/utils/db";
import { Package } from "lucide-react";
import { cookies } from "next/headers";

/* ---------------- Helpers ---------------- */

function formatNumber(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStartOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getYesterdayRange() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    start: getStartOfDay(yesterday),
    end: getEndOfDay(yesterday),
  };
}

/* ---------------- Queries ---------------- */

async function getYesterdaySalesByMethod(companyId: string) {
  const { start, end } = getYesterdayRange();

  const sales = await prisma.sale.groupBy({
    by: ["method"],
    where: {
      companyId,
      date: { gte: start, lte: end },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    CASH: sales.find((s) => s.method === "CASH")?._sum.amount ?? 0,
    CARD: sales.find((s) => s.method === "CARD")?._sum.amount ?? 0,
  };
}

/* ---------------- Component ---------------- */

export default async function YesterdaySalesCard() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { CASH, CARD } = await getYesterdaySalesByMethod(companyId);
  const total = CASH + CARD;

  return (
    <div className="bg-white p-4 mx-2 py-3 rounded-xs shadow border border-teal-100 max-w-md">
      <div className="flex items-center gap-4">
        <div className="bg-teal-50 p-4 rounded-full">
          <Package className="w-10 h-10 text-teal-900" />
        </div>

        <div>
          <p className="text-sm text-gray-400 font-semibold">
            Yesterday Sales
          </p>
          <p className="text-2xl font-extrabold">
            {formatNumber(total)}
          </p>

          {CASH > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Cash:{" "}
              <span className="font-semibold text-gray-700">
                {formatNumber(CASH)}
              </span>
            </p>
          )}

          {CARD > 0 && (
            <p className="text-xs text-gray-500">
              Card:{" "}
              <span className="font-semibold text-gray-700">
                {formatNumber(CARD)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
