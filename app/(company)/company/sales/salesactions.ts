"use server";

import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";

async function getCompanyId() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");
  return companyId;
}

/* -------- Add daily sale -------- */
export async function addDailySale({
  date,
  amount,
  method,
}: {
  date: string;
  amount: number;
  method: "CASH" | "CARD";
}) {
  const companyId = await getCompanyId();

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
export async function getMonthlySales(month: string) {
  const companyId = await getCompanyId();
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

/* -------- Available months -------- */
export async function getAvailableSalesMonths() {
  const companyId = await getCompanyId();

  const dates = await prisma.sale.findMany({
    where: { companyId },
    select: { date: true },
  });

  const set = new Set(
    dates.map((d) => d.date.toISOString().slice(0, 7))
  );

  return Array.from(set).sort().reverse();
}
