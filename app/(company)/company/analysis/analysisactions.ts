"use server";

import { prisma } from "@/app/utils/db";
import { startOfMonth, endOfMonth } from "date-fns";

type CompanyAnalysisParams = {
  companyId: string;
  month: string; // "2025-12"
};

export async function getCompanyAnalysis({
  companyId,
  month,
}: CompanyAnalysisParams) {
  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, monthNum - 1));
  const monthEnd = endOfMonth(monthStart);

  // 1️⃣ Daily Time Logs
  /*   const timeLogs = await prisma.timeLog.findMany({
    where: { companyId, logDate: { gte: monthStart, lte: monthEnd } },
  }); */

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      logDate: { gte: monthStart, lte: monthEnd },
      logoutTime: { not: null },
      totalMinutes: { not: null },
    },
  });

  const dailyHoursMap: Record<number, number> = {};
  timeLogs.forEach((log) => {
    if (!log.logoutTime || log.totalMinutes == null) return;

    const day = log.logDate.getDate();
    const hours = log.totalMinutes / 60;

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
  /*  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: {
      timeLogs: {
        where: { logDate: { gte: monthStart, lte: monthEnd } },
      },
    },
  }); */

  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: {
      timeLogs: {
        where: {
          logDate: { gte: monthStart, lte: monthEnd },
          logoutTime: { not: null },
          totalMinutes: { not: null },
        },
      },
    },
  });

  const salaryData = employees.map((emp) => {
    const hoursWorked = emp.timeLogs.reduce((sum, log) => {
      if (!log.logoutTime || log.totalMinutes == null) return sum;
      return sum + log.totalMinutes / 60;
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
  /* const timeLogMonths = await prisma.timeLog.findMany({
    where: { companyId },
    select: { logDate: true },
  }); */

  const timeLogMonths = await prisma.timeLog.findMany({
    where: {
      companyId,
      logoutTime: { not: null },
      totalMinutes: { not: null },
    },
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
  timeLogMonths.forEach((t) =>
    monthsSet.add(
      `${t.logDate.getFullYear()}-${String(t.logDate.getMonth() + 1).padStart(
        2,
        "0"
      )}`
    )
  );
  tipMonths.forEach((t) =>
    monthsSet.add(
      `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(
        2,
        "0"
      )}`
    )
  );
  salaryMonths.forEach((s) =>
    monthsSet.add(`${s.year}-${String(s.month).padStart(2, "0")}`)
  );

  return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
}



export async function getMonthlyProfitability(companyId: string, month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, monthNum - 1));
  const monthEnd = endOfMonth(monthStart);

  // 1️⃣ Fetch daily sales
  const salesRecords = await prisma.sale.findMany({
    where: { companyId, date: { gte: monthStart, lte: monthEnd } },
  });
  const salesMap: Record<number, number> = {};
  salesRecords.forEach(s => {
    const day = s.date.getDate();
    salesMap[day] = (salesMap[day] || 0) + s.amount;
  });

  // 2️⃣ Fetch costs
  const costRecords = await prisma.cost.findMany({
    where: { companyId, date: { gte: monthStart, lte: monthEnd } },
  });
  const costMap: Record<number, number> = {};
  costRecords.forEach(c => {
    const day = c.date.getDate();
    costMap[day] = (costMap[day] || 0) + c.amount;
  });

  // 3️⃣ Fetch salaries (from time logs & employee hourly/monthly rate)
  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: {
      timeLogs: {
        where: { logDate: { gte: monthStart, lte: monthEnd }, logoutTime: { not: null }, totalMinutes: { not: null } },
      },
    },
  });

  const salaryMap: Record<number, number> = {};
  employees.forEach(emp => {
    emp.timeLogs.forEach(log => {
      const day = log.logDate.getDate();
      const hours = log.totalMinutes! / 60;
      let salary = 0;

      if (emp.contractType === "MONTHLY" && emp.monthlySalary) {
        const monthlyHours = 160;
        salary = (hours / monthlyHours) * emp.monthlySalary;
      } else if (emp.contractType === "HOURLY" && emp.hourlyRate) {
        salary = hours * emp.hourlyRate;
      }

      salaryMap[day] = (salaryMap[day] || 0) + salary;
    });
  });

  // 4️⃣ Merge all available days
  const availableDays = new Set<number>([
    ...Object.keys(salesMap).map(Number),
    ...Object.keys(costMap).map(Number),
    ...Object.keys(salaryMap).map(Number),
  ]);

  const rows = Array.from(availableDays)
    .sort((a, b) => a - b)
    .map(day => {
      const sales = salesMap[day] || 0;
      const cost = (costMap[day] || 0) + (salaryMap[day] || 0);
      const result = sales - cost;
      const margin = sales > 0 ? (result / sales) * 100 : 0;

      return {
        date: `${year}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        sales,
        cost,
        result,
        margin,
      };
    });

  // 5️⃣ Totals
  const totalSales = rows.reduce((s, r) => s + r.sales, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalResult = totalSales - totalCost;
  const totalMargin = totalSales > 0 ? (totalResult / totalSales) * 100 : 0;

  const totals = { sales: totalSales, cost: totalCost, result: totalResult, margin: totalMargin };

  return { rows, totals };
}

