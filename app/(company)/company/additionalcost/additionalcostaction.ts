"use server"
import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import { startOfMonth, endOfMonth } from "date-fns";


async function getCompanyId() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");
  return companyId;
}


export async function addCompanyCostType(name: string) {
  const companyId =await getCompanyId();

  return prisma.costType.create({
    data: {
      companyId,
      name: name.trim().toLowerCase(),
    },
  });
}

export async function getCompanyCostTypes() {
  const companyId =await getCompanyId();

  return prisma.costType.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
  });
}

export async function addDailyCost({
  date,
  amount,
  costTypeId,
}: {
  date: string;
  amount: number;
  costTypeId: string;
}) {
  const companyId =await getCompanyId();

  return prisma.cost.create({
    data: {
      companyId,
      costTypeId,
      date: new Date(date),
      amount,
    },
  });
}


export async function getMonthlyCosts(month: string) {
  const companyId =await getCompanyId();
  const [year, m] = month.split("-").map(Number);

  return prisma.cost.findMany({
    where: {
      companyId,
      date: {
        gte: new Date(year, m - 1, 1),
        lt: new Date(year, m, 1),
      },
    },
    include: {
      costType: true,
    },
    orderBy: { date: "asc" },
  });
}

export async function getAvailableCostMonths() {
  const companyId =await getCompanyId();

  const dates = await prisma.cost.findMany({
    where: { companyId },
    select: { date: true },
  });

  const set = new Set(
    dates.map((d) => d.date.toISOString().slice(0, 7))
  );

  return Array.from(set).sort().reverse();
}




export async function getCompanyCostAnalysis({
  companyId,
  month,
}: {
  companyId: string;
  month: string; // "2026-01"
}) {
  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, monthNum - 1));
  const monthEnd = endOfMonth(monthStart);

  const costs = await prisma.cost.findMany({
    where: {
      companyId,
      date: { gte: monthStart, lte: monthEnd },
    },
    include: {
      costType: true,
    },
  });

  /* -------- Daily total cost -------- */
  const dailyMap: Record<number, number> = {};
  costs.forEach((c) => {
    const day = c.date.getDate();
    dailyMap[day] = (dailyMap[day] || 0) + c.amount;
  });

  const daysInMonth = monthEnd.getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: dailyMap[i + 1] || 0,
  }));

  /* -------- Cost by category -------- */
  const categoryMap: Record<string, number> = {};
  costs.forEach((c) => {
    categoryMap[c.costType.name] =
      (categoryMap[c.costType.name] || 0) + c.amount;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, amount]) => ({
      name,
      amount,
    })
  );

  return { dailyData, categoryData };
}