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

  const now = new Date();

  // 1️⃣ Daily Time Logs
  const timeLogs = await prisma.timeLog.findMany({
    where: { companyId, logDate: { gte: monthStart, lte: monthEnd } },
  });

  const dailyHoursMap: Record<number, number> = {};
  timeLogs.forEach((log) => {
    const day = log.logDate.getDate();
    let hours = 0;
    if (log.logoutTime && log.totalMinutes != null) {
      hours = log.totalMinutes / 60;
    } else if (log.loginTime) {
      const endTime = log.logoutTime ?? now;
      hours = (endTime.getTime() - log.loginTime.getTime()) / 1000 / 3600;
    }
    dailyHoursMap[day] = (dailyHoursMap[day] || 0) + hours;
  });

  const daysInMonth = monthEnd.getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    hours: dailyHoursMap[i + 1] || 0,
    tips: 0, // will populate later
  }));

  // 2️⃣ Daily Tips
  const dailyTipsRecords = await prisma.dailyTip.findMany({
    where: { companyId, date: { gte: monthStart, lte: monthEnd } },
  });

  const dailyTipsMap: Record<number, number> = {};
  dailyTipsRecords.forEach((tip) => {
    const day = tip.date.getDate();
    dailyTipsMap[day] = tip.amount;
  });

  dailyData.forEach((d) => {
    d.tips = dailyTipsMap[d.day] || 0;
  });

  // 3️⃣ Salary per employee (so far)
  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: {
      timeLogs: {
        where: { logDate: { gte: monthStart, lte: monthEnd } },
      },
    },
  });

  const salaryData = employees.map((emp) => {
    const hoursWorked = emp.timeLogs.reduce((sum, log) => {
      if (log.totalMinutes != null) return sum + log.totalMinutes / 60;
      if (log.loginTime) {
        const endTime = log.logoutTime ?? now;
        return sum + (endTime.getTime() - log.loginTime.getTime()) / 1000 / 3600;
      }
      return sum;
    }, 0);

    let salarySoFar = 0;
    if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
      const monthlyHours = 160;
      salarySoFar = (hoursWorked / monthlyHours) * emp.monthlySalary;
    } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
      salarySoFar = hoursWorked * emp.hourlyRate;
    }

    return { name: emp.name, hours: hoursWorked, salary: salarySoFar };
  });

  // 4️⃣ Employees count
  const employeesCount = employees.length;

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
  timeLogMonths.forEach(t => monthsSet.add(`${t.logDate.getFullYear()}-${String(t.logDate.getMonth()+1).padStart(2,"0")}`));
  tipMonths.forEach(t => monthsSet.add(`${t.date.getFullYear()}-${String(t.date.getMonth()+1).padStart(2,"0")}`));
  salaryMonths.forEach(s => monthsSet.add(`${s.year}-${String(s.month).padStart(2,"0")}`));

  return Array.from(monthsSet).sort((a,b) => b.localeCompare(a));
}
