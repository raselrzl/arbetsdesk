"use server"
import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";

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
