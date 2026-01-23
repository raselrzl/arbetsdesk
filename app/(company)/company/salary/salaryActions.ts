"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { SalaryStatus } from "@prisma/client";
import { SalaryRow } from "./salarypagecomponent";

export async function getCompanyMonthlySalary(
  month: string,
): Promise<SalaryRow[]> {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59); // last day of month

  // 1️⃣ Fetch employees hired on or before end of month
  const employees = await prisma.employee.findMany({
    where: {
      companyId,
      createdAt: { lte: endOfMonth }, // only include employees hired before month ends
    },
    select: {
      id: true,
      contractType: true,
      hourlyRate: true,
      monthlySalary: true,
      person: {
        select: {
          name: true,
        },
      },
    },
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      loginTime: { gte: startOfMonth, lte: endOfMonth },
      logoutTime: { not: null },
      totalMinutes: { not: null },
    },
    select: {
      employeeId: true,
      loginTime: true,
      logoutTime: true,
      totalMinutes: true,
    },
  });

  // 3️⃣ Aggregate total minutes
  const minutesMap: Record<string, number> = {};
  const now = new Date();

  timeLogs.forEach((log) => {
    if (!minutesMap[log.employeeId]) minutesMap[log.employeeId] = 0;

    if (log.totalMinutes != null) {
      minutesMap[log.employeeId] += log.totalMinutes;
    } else if (log.loginTime && log.logoutTime) {
      const diff = Math.floor(
        (log.logoutTime.getTime() - log.loginTime.getTime()) / 60000,
      );
      minutesMap[log.employeeId] += diff;
    } else if (log.loginTime && !log.logoutTime) {
      const diff = Math.floor(
        (now.getTime() - log.loginTime.getTime()) / 60000,
      );
      minutesMap[log.employeeId] += diff;
    }
  });

  // 4️⃣ Fetch salary slips for this month
  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, month: monthNum, year },
    select: { employeeId: true, status: true },
  });

  const statusMap: Record<string, SalaryStatus> = {};
  salarySlips.forEach((s) => {
    statusMap[s.employeeId] = s.status;
  });

  // 5️⃣ Build final rows
  const rows: SalaryRow[] = employees.map((e) => {
    const totalMinutes = minutesMap[e.id] || 0;
    let salary = 0;

    if (e.contractType === "HOURLY")
      salary = (totalMinutes / 60) * (e.hourlyRate || 0);
    else salary = e.monthlySalary || 0;

    return {
      employeeId: e.id,
      name: e.person.name,
      contractType: e.contractType,
      totalMinutes,
      hourlyRate: e.hourlyRate,
      monthlySalary: e.monthlySalary,
      salary: Math.round(salary),
      status: statusMap[e.id] || "PENDING",
    };
  });

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------------- Available Months ---------------- */
export async function getAvailableSalaryMonths(): Promise<string[]> {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const timeLogMonths = await prisma.timeLog.findMany({
    where: { companyId },
    select: { loginTime: true },
  });

  const tipMonths = await prisma.dailyTip.findMany({
    where: { companyId },
    select: { date: true },
  });

  const salaryMonths = await prisma.salarySlip.findMany({
    where: { companyId },
    select: { year: true, month: true },
  });

  const monthsSet = new Set<string>();

  timeLogMonths.forEach((t) => {
    if (t.loginTime)
      monthsSet.add(
        `${t.loginTime.getFullYear()}-${String(t.loginTime.getMonth() + 1).padStart(2, "0")}`,
      );
  });

  tipMonths.forEach((t) => {
    if (t.date)
      monthsSet.add(
        `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`,
      );
  });

  salaryMonths.forEach((s) =>
    monthsSet.add(`${s.year}-${String(s.month).padStart(2, "0")}`),
  );

  return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
}
