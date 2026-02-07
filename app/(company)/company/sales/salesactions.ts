"use server";

import { prisma } from "@/app/utils/db";

/* -------- Add daily sale -------- */
/* export async function addDailySale(
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
} */

export async function addDailySale(
  companyId: string,
  {
    date,
    amount,
    method,
    vatRate,
    vatTypeId,
  }: {
    date: string;
    amount: number;
    method: "CASH" | "CARD";
    vatRate: number;
    vatTypeId?: string;
  },
) {
  const netAmount = vatRate === 0 ? amount : amount / (1 + vatRate);

  const vatAmount = amount - netAmount;

  return prisma.sale.create({
    data: {
      companyId,
      date: new Date(date),
      amount, // gross
      method,
      vatRate,
      vatAmount,
      netAmount,
      vatTypeId,
    },
  });
}

/* -------- Get monthly sales -------- */
export async function getMonthlySalesByCompany(
  companyId: string,
  month: string,
) {
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
    include: { 
      vatType: true, // <-- include VAT type relation
    },
  });
}

export async function getYearlySalesByCompany(companyId: string, year: number) {
  const sales = await prisma.sale.findMany({
    where: {
      companyId,
      date: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
    orderBy: { date: "asc" },
    include: { 
      vatType: true, // <-- include VAT type relation
    },
  });

  return sales;
}
