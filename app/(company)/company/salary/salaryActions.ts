"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { SalaryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { SalaryRow } from "@/app/actions";

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
      jobTitle: true,
      person: {
        select: {
          name: true,
          personalNumber: true,
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
      personalNumber: e.person.personalNumber,
      contractType: e.contractType,
      jobTitle: e.jobTitle,
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



/* export async function updateTimeLogStatus(timeLogId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") {
  return prisma.timeLog.update({
    where: { id: timeLogId },
    data: { status: newStatus },
  });
} */


export async function updateTimeLogStatus(
  timeLogId: string,
  newStatus: "PENDING" | "APPROVED" | "REJECTED"
) {
  const updated = await prisma.timeLog.update({
    where: { id: timeLogId },
    data: { status: newStatus },
  });

  // Revalidate AFTER DB update
  revalidatePath("/company/salary");

  return updated;
}

/* export async function createSalarySlipForEmployee(employeeId: string, month: number, year: number) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { timeLogs: true },
  });

  if (!employee) throw new Error("Employee not found");

  // Filter logs for given month/year and approved only
  const logs = employee.timeLogs.filter(log => 
    log.status === "APPROVED" &&
    log.logDate.getMonth() + 1 === month &&
    log.logDate.getFullYear() === year
  );

  // Calculate total time in hours
  const totalMinutes = logs.reduce((acc, log) => {
    if (log.loginTime && log.logoutTime) {
      return acc + (log.logoutTime.getTime() - log.loginTime.getTime()) / (1000 * 60);
    }
    return acc;
  }, 0);

  const totalHours = totalMinutes / 60;

  // Compute total pay
  const totalPay = employee.contractType === "HOURLY"
    ? (employee.hourlyRate || 0) * totalHours
    : employee.monthlySalary || 0;

  return prisma.salarySlip.create({
    data: {
      employeeId: employee.id,
      companyId: employee.companyId,
      month,
      year,
      totalHours,
      totalPay,
      tax: 0, // optional, can be updated later
      status: "DRAFT",
    },
  });
} */


/*   export async function createSalarySlipForEmployee(
  employeeId: string,
  month: number,
  year: number
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { timeLogs: true },
  });

  if (!employee) throw new Error("Employee not found");

  // ---------------- HERE ----------------
  // Currently you are recalculating totalMinutes from loginTime/logoutTime
  // Instead, use the stored shift totalMinutes and shift salary
  const logs = employee.timeLogs.filter(
    log =>
      log.status === "APPROVED" &&
      log.logDate.getMonth() + 1 === month &&
      log.logDate.getFullYear() === year
  );

  // ✅ Update this part:
  // Instead of recalculating from timestamps, sum shift totalMinutes
  const totalMinutes = logs.reduce((acc, log) => acc + (log.totalMinutes || 0), 0);

  // For HOURLY, calculate totalPay exactly as frontend does:
  let totalPay = 0;
  if (employee.contractType === "HOURLY") {
    const hourlyRate = employee.hourlyRate || 0;
    const totalHours = totalMinutes / 60; // e.g., 1h37m → 1.616667
    totalPay = hourlyRate * totalHours; // same as frontend
  } else if (employee.contractType === "MONTHLY") {
    totalPay = employee.monthlySalary || 0;
  }

  return prisma.salarySlip.create({
    data: {
      employeeId: employee.id,
      companyId: employee.companyId,
      month,
      year,
      totalMinutes,                    // exact minutes from shifts
      totalHours: totalMinutes / 60,   // exact hours
      totalPay: parseFloat(totalPay.toFixed(2)), // round only for money
      tax: 0,
      status: "DRAFT",
    },
  });
} */

//latest with yes and no
export async function createSalarySlipForEmployee(
  employeeId: string,
  month: number,
  year: number,
  forceUpdate = false // 👈 NEW
) {
  const existingSlip = await prisma.salarySlip.findUnique({
    where: {
      employeeId_month_year: {
        employeeId,
        month,
        year,
      },
    },
  });

  // 🚫 Salary already exists
  if (existingSlip && !forceUpdate) {
    throw new Error("SALARY_EXISTS");
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { timeLogs: true },
  }); 

  if (!employee) throw new Error("Employee not found");

  const logs = employee.timeLogs.filter(
    (log) =>
      log.status === "APPROVED" &&
      log.logDate.getMonth() + 1 === month &&
      log.logDate.getFullYear() === year
  );

  const totalMinutes = logs.reduce(
    (acc, log) => acc + (log.totalMinutes || 0),
    0
  );

  let totalPay = 0;
  if (employee.contractType === "HOURLY") {
    const hourlyRate = employee.hourlyRate || 0;
    totalPay = (totalMinutes / 60) * hourlyRate;
  } else if (employee.contractType === "MONTHLY") {
    totalPay = employee.monthlySalary || 0;
  }

  const data = {
    employeeId: employee.id,
    companyId: employee.companyId,
    month,
    year,
    totalMinutes,
    totalHours: totalMinutes / 60,
    totalPay: parseFloat(totalPay.toFixed(2)),
    tax: 0,
    status: "DRAFT" as const,
  };

  // 🔁 UPDATE
  if (existingSlip) {
    return prisma.salarySlip.update({
      where: { id: existingSlip.id },
      data,
    });
  }

  // 🆕 CREATE
  return prisma.salarySlip.create({ data });
}


export async function getLatestSalarySlipForEmployee(employeeId: string) {
  return prisma.salarySlip.findFirst({
    where: { employeeId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: {
      employee: { include: { person: true } },
      company: {
        include: {
          user: true, // <-- Include admin info
        },
      },
    },
  });
}


