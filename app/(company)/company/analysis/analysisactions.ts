"use server";

import { prisma } from "@/app/utils/db";
import { startOfMonth, endOfMonth } from "date-fns";

type CompanyAnalysisParams = {
  companyId: string;
  month: string; // "2025-12"
};

export async function getCompanyAnalysis({ companyId, month }: CompanyAnalysisParams) {
  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, monthNum - 1));
  const monthEnd = endOfMonth(monthStart);

  // 1️⃣ Daily Time Logs
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      logDate: { gte: monthStart, lte: monthEnd },
    },
  });

  const dailyHoursMap: Record<number, number> = {};

  const now = new Date();
  timeLogs.forEach((log) => {
    const day = log.logDate.getDate();

    // If logoutTime exists, use totalMinutes if available; otherwise calculate
    let hours = 0;
    if (log.logoutTime && log.totalMinutes != null) {
      hours = log.totalMinutes / 60;
    } else if (log.loginTime) {
      // Employee still logged in; calculate hours until now
      const endTime = log.logoutTime ?? now;
      hours = (endTime.getTime() - log.loginTime.getTime()) / 1000 / 3600;
    }

    dailyHoursMap[day] = (dailyHoursMap[day] || 0) + hours;
  });

  // 2️⃣ Daily Tips
  const dailyTipsRecords = await prisma.dailyTip.findMany({
    where: { companyId, date: { gte: monthStart, lte: monthEnd } },
  });

  const dailyTipsMap: Record<number, number> = {};
  dailyTipsRecords.forEach((tip) => {
    const day = tip.date.getDate();
    dailyTipsMap[day] = tip.amount;
  });

  const daysInMonth = monthEnd.getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    hours: dailyHoursMap[i + 1] || 0,
    tips: dailyTipsMap[i + 1] || 0,
  }));

  // 3️⃣ Salary per employee
  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, year, month: monthNum },
    include: { employee: true },
  });

  const salaryData = salarySlips.map((s) => ({
    name: s.employee.name,
    hours: s.totalHours,
    salary: s.totalPay,
  }));

  // 4️⃣ Employees count
  const employeesCount = await prisma.employee.count({ where: { companyId } });

  return { dailyData, salaryData, employeesCount };
}

export async function getAvailableMonths(companyId: string) {
  const timeLogMonths = await prisma.timeLog.findMany({
    where: { companyId },
    select: { logDate: true },
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

  timeLogMonths.forEach(t => {
    const m = `${t.logDate.getFullYear()}-${String(t.logDate.getMonth() + 1).padStart(2, "0")}`;
    monthsSet.add(m);
  });

  tipMonths.forEach(t => {
    const m = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`;
    monthsSet.add(m);
  });

  salaryMonths.forEach(s => {
    const m = `${s.year}-${String(s.month).padStart(2, "0")}`;
    monthsSet.add(m);
  });

  return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
}
