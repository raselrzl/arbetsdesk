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
  const startOfNextMonth = new Date(year, monthNum, 1);

  // 1️⃣ Employees hired before this month ends
  const employees = await prisma.employee.findMany({
    where: {
      companyId,
      createdAt: { lt: startOfNextMonth },
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

  // 2️⃣ Fetch ONLY approved logs for selected month
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      status: "APPROVED",
      logDate: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
    select: {
      employeeId: true,
      totalMinutes: true,
    },
  });

  // 3️⃣ Aggregate minutes
  const minutesMap: Record<string, number> = {};

  timeLogs.forEach((log) => {
    if (!minutesMap[log.employeeId]) {
      minutesMap[log.employeeId] = 0;
    }
    minutesMap[log.employeeId] += log.totalMinutes || 0;
  });

  // 4️⃣ Get salary slips for this month
  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, month: monthNum, year },
    select: { employeeId: true, status: true },
  });

  const statusMap: Record<string, SalaryStatus> = {};
  salarySlips.forEach((s) => {
    statusMap[s.employeeId] = s.status;
  });

  // 5️⃣ Build rows
  const rows: SalaryRow[] = employees.map((e) => {
    const totalMinutes = minutesMap[e.id] || 0;

    let salary = 0;
    if (e.contractType === "HOURLY") {
      salary = (totalMinutes / 60) * (e.hourlyRate || 0);
    } else {
      salary = e.monthlySalary || 0;
    }

    return {
      employeeId: e.id,
      name: e.person.name,
      personalNumber: e.person.personalNumber,
      contractType: e.contractType,
      jobTitle: e.jobTitle,
      totalMinutes,
      hourlyRate: e.hourlyRate,
      monthlySalary: e.monthlySalary,
      salary: parseFloat(salary.toFixed(2)),
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

type CreateSalaryResult =
  | { status: "OK"; slip: any }
  | { status: "EXISTS" }
  | { status: "ERROR"; message: string };

export async function createSalarySlipForEmployee(
  employeeId: string,
  month: number,
  year: number,
  forceUpdate = false
): Promise<CreateSalaryResult> {
  try {
    // 🔎 Check if salary slip already exists
    const existingSlip = await prisma.salarySlip.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
    });

    if (existingSlip && !forceUpdate) {
      return { status: "EXISTS" };
    }

    // 📅 Define month boundaries (SAFE & CONSISTENT)
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);

    // 👤 Fetch employee + ONLY approved logs for this month
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        timeLogs: {
          where: {
            status: "APPROVED",
            logDate: {
              gte: startOfMonth,
              lt: startOfNextMonth,
            },
          },
          select: {
            totalMinutes: true,
          },
        },
      },
    });

    if (!employee) {
      return { status: "ERROR", message: "Employee not found" };
    }

    // 🧮 Calculate total worked minutes
    const totalMinutes = employee.timeLogs.reduce(
      (acc, log) => acc + (log.totalMinutes || 0),
      0
    );

    // 💰 Calculate salary
    let totalPay = 0;

    if (employee.contractType === "HOURLY") {
      totalPay = (totalMinutes / 60) * (employee.hourlyRate || 0);
    } else if (employee.contractType === "MONTHLY") {
      totalPay = employee.monthlySalary || 0;
    }

    const salaryData = {
      employeeId: employee.id,
      companyId: employee.companyId,
      month,
      year,
      totalMinutes,
      totalHours: totalMinutes / 60,
      totalPay: parseFloat(totalPay.toFixed(2)), // round only money
      tax: 0,
      status: "DRAFT" as const,
    };

    // 🔁 Update or Create
    const slip = existingSlip
      ? await prisma.salarySlip.update({
          where: { id: existingSlip.id },
          data: salaryData,
        })
      : await prisma.salarySlip.create({
          data: salaryData,
        });

    return { status: "OK", slip };
  } catch (error) {
    console.error("CREATE SALARY FAILED:", error);
    return { status: "ERROR", message: "Internal server error" };
  }
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


// Get all salary slips for a specific employee, sorted newest first
export async function getAllSalarySlipsForEmployee(employeeId: string) {
  return prisma.salarySlip.findMany({
    where: { employeeId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: {
      employee: { include: { person: true } },
      company: { include: { user: true } },
    },
  });
}

// Get a single salary slip for a specific month/year
export async function getSalarySlipByMonth(employeeId: string, year: number, month: number) {
  return prisma.salarySlip.findFirst({
    where: { employeeId, year, month },
    include: {
      employee: { include: { person: true } },
      company: { include: { user: true } },
    },
  });
}

