"use server"

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";

export async function addDailyTip({
  date,
  amount,
}: {
  date: string | Date;
  amount: number;
}) {
  // ✅ Get company id from cookie
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  const parsedDate = new Date(date);

  return prisma.dailyTip.upsert({
    where: {
      companyId_date: {
        companyId,
        date: parsedDate,
      },
    },
    update: { amount },
    create: { companyId, date: parsedDate, amount },
  });
}

export async function getAvailableTipMonths() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const tips = await prisma.dailyTip.findMany({
    where: { companyId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  // Convert to YYYY-MM and remove duplicates
  const months = Array.from(
    new Set(
      tips.map(
        (t) =>
          `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`,
      ),
    ),
  );

  return months;
}

export async function getMonthlyTips(companyId: string, month: string) {
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const tips = await prisma.dailyTip.findMany({
    where: {
      companyId,
      date: { gte: start, lt: end },
    },
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      employee: { companyId },
      logDate: { gte: start, lt: end },
    },
    include: {
      employee: {
        include: {
          person: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return { tips, timeLogs };
}


