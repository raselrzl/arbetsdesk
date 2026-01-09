"use server";

import { prisma } from "@/app/utils/db";

/* -------- Add daily sale -------- */
export async function addDailySale(
  companyId: string,
  {
    date,
    amount,
    method,
  }: { date: string; amount: number; method: "CASH" | "CARD" }
) {
  return prisma.sale.create({
    data: {
      companyId,
      date: new Date(date),
      amount,
      method,
    },
  });
}

/* -------- Get monthly sales -------- */
export async function getMonthlySalesByCompany(companyId: string, month: string) {
  const [year, m] = month.split("-").map(Number);

  return prisma.sale.findMany({
    where: {
      companyId,
      date: {
        gte: new Date(year, m - 1, 1),
        lt: new Date(year, m, 1),
      },
    },
    orderBy: { date: "asc" },
  });
}
