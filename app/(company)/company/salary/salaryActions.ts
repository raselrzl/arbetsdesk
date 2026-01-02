"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { SalaryRow } from "./page";
import { SalaryStatus } from "@prisma/client";

/* ---------------- Monthly Salary ---------------- */
export async function getCompanyMonthlySalary(month: string): Promise<SalaryRow[]> {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

  const employees = await prisma.employee.findMany({
    where: { companyId, createdAt: { lte: endOfMonth } },
    select: { id: true, name: true, contractType: true, hourlyRate: true, monthlySalary: true },
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      loginTime: { gte: startOfMonth, lte: endOfMonth },
      logoutTime: { not: null },
      totalMinutes: { not: null },
    },
    select: { employeeId: true, loginTime: true, logoutTime: true, totalMinutes: true },
  });

  const minutesMap: Record<string, number> = {};
  employees.forEach((e) => (minutesMap[e.id] = 0));
  timeLogs.forEach((log) => (minutesMap[log.employeeId] += log.totalMinutes!));

  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, month: monthNum, year },
    select: { employeeId: true, status: true },
  });

  const statusMap: Record<string, SalaryStatus> = {};
  salarySlips.forEach((s) => (statusMap[s.employeeId] = s.status));

  return employees.map((e) => {
    const totalMinutes = minutesMap[e.id] || 0;
    const salary =
      e.contractType === "HOURLY"
        ? (totalMinutes / 60) * (e.hourlyRate || 0)
        : e.monthlySalary || 0;

    return {
      employeeId: e.id,
      name: e.name,
      contractType: e.contractType,
      totalMinutes,
      hourlyRate: e.hourlyRate,
      monthlySalary: e.monthlySalary,
      salary: Math.round(salary),
      status: statusMap[e.id] || "PENDING",
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
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
        `${t.loginTime.getFullYear()}-${String(t.loginTime.getMonth() + 1).padStart(2, "0")}`
      );
  });

  tipMonths.forEach((t) => {
    if (t.date)
      monthsSet.add(
        `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`
      );
  });

  salaryMonths.forEach((s) =>
    monthsSet.add(`${s.year}-${String(s.month).padStart(2, "0")}`)
  );

  return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
}
