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

export async function getCompanyEmployees() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) {
    throw new Error("Unauthorized");
  }

  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      contractType: true,
      companyId: true, // ✅ include companyId
      person: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      timeLogs: {
        orderBy: { logDate: "desc" },
        take: 1,
      },
    },
  });

  return employees.map((emp) => {
    const log = emp.timeLogs[0];
    let status: "Working" | "Off" | "On Break" = "Off";

    if (log?.loginTime && !log.logoutTime) status = "Working";
    if (log?.loginTime && log.logoutTime) status = "Off";

    return {
      id: emp.id,
      name: emp.person.name,
      email: emp.person.email,
      phone: emp.person.phone,
      role: emp.contractType,
      companyId: emp.companyId, // ✅ include companyId here too
      status,
    };
  });
}


export async function getMonthlyTipPayments(month: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized");

  const payments = await prisma.employeeMonthlyTipPayment.findMany({
    where: { companyId, month },
    include: {
      employee: {
        include: {
          person: { select: { name: true, email: true, phone: true } },
        },
      },
    },
  });

  return payments;
}


/**
 * Toggle employee monthly tip payment
 */
export async function toggleEmployeeTipPayment({
  employeeId,
  month,
  paid,
}: {
  employeeId: string;
  month: string;
  paid: boolean;
}) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized");

  const now = new Date();

  return prisma.employeeMonthlyTipPayment.upsert({
    where: { employeeId_month: { employeeId, month } },
    update: { paid, paidAt: paid ? now : null },
    create: { employeeId, companyId, month, amount: 0, paid, paidAt: paid ? now : null },
  });
}

