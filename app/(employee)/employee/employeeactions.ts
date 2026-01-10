// app/actions/getEmployeeSchedule.ts
"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getEmployeeSchedule() {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;

  if (!employeeId) {
    throw new Error("Unauthorized");
  }

  const schedules = await prisma.schedule.findMany({
    where: { employeeId },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      isAccepted: true,
    },
  });

  return schedules.map((s) => ({
    id: s.id,
    date: s.date.toISOString().slice(0, 10),
    time: `${s.startTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${s.endTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    topic: "Work Shift",
    status: s.isAccepted ? "Scheduled by Company" : "Scheduled",
  }));
}

export async function getEmployeeMonthlyHours() {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;

  if (!employeeId) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const logs = await prisma.timeLog.findMany({
    where: {
      employeeId,
      logDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      loginTime: { not: null },
      logoutTime: { not: null },
    },
    orderBy: { logDate: "asc" },
  });

  let totalMinutes = 0;

  const daily = logs.map((log) => {
    const minutes =
      Math.floor(
        (log.logoutTime!.getTime() - log.loginTime!.getTime()) / 60000
      ) || 0;

    totalMinutes += minutes;

    return {
      date: log.logDate.toISOString(),
      start: log.loginTime!.toISOString(),
      end: log.logoutTime!.toISOString(),
      minutes,
    };
  });

  return {
    totalMinutes,
    daily,
  };
}

export async function getEmployeeMonthlySchedule(month: string) {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;

  if (!employeeId) throw new Error("Unauthorized");

  const [year, m] = month.split("-").map(Number);

  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 0, 23, 59, 59);

  const schedules = await prisma.schedule.findMany({
    where: {
      employeeId,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "asc" },
  });

  return schedules.map((s) => {
    const minutes = (s.endTime.getTime() - s.startTime.getTime()) / 60000;

    return {
      date: s.date.toISOString().slice(0, 10),
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      hours: minutes / 60,
    };
  });
}

export type DailyWork = {
  date: string;
  loginTime: Date | null;
  logoutTime: Date | null;
  totalMinutes: number;
};

export type Employee = {
  id: string;
  name: string;
  contractType: "HOURLY" | "MONTHLY";
  hourlyRate?: number | null;
  monthlySalary?: number | null;
};

export async function getEmployeeMonthlyData(
  month: string
): Promise<{ employee: Employee; dailyWork: DailyWork[] }> {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;
  if (!employeeId) throw new Error("Unauthorized");

  const emp = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      name: true,
      contractType: true,
      hourlyRate: true,
      monthlySalary: true,
    },
  });
  if (!emp) throw new Error("Employee not found");

  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1);

  const logs = await prisma.timeLog.findMany({
    where: { employeeId: emp.id, logDate: { gte: start, lt: end } },
  });

  const daily: DailyWork[] = logs.map((log) => ({
    date: log.logDate.toISOString().slice(0, 10),
    loginTime: log.loginTime,
    logoutTime: log.logoutTime,
    totalMinutes:
      log.totalMinutes ??
      (log.loginTime && log.logoutTime
        ? Math.floor(
            (log.logoutTime.getTime() - log.loginTime.getTime()) / 60000
          )
        : 0),
  }));

  return { employee: emp, dailyWork: daily };
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("employee_session");
  redirect("/");
}

export async function getEmployeeProfile() {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;

  if (!employeeId) throw new Error("Unauthorized");

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      personalNumber: true,
      contractType: true,
      pinCode: true,
      hourlyRate: true,
      monthlySalary: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!employee) throw new Error("Employee not found");

  return employee;
}

async function getEmployeeId() {
  const jar = await cookies();
  const id = jar.get("employee_session")?.value;
  if (!id) throw new Error("Unauthorized");
  return id;
}

/* -------- UPDATE NAME -------- */
export async function updateName(oldValue: string, newValue: string) {
  const id = await getEmployeeId();

  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp || emp.name !== oldValue) throw new Error("Invalid current name");

  await prisma.employee.update({
    where: { id },
    data: { name: newValue },
  });
}

/* -------- UPDATE EMAIL -------- */
export async function updateEmail(oldValue: string, newValue: string) {
  const id = await getEmployeeId();

  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp || emp.email !== oldValue) throw new Error("Invalid current email");

  await prisma.employee.update({
    where: { id },
    data: { email: newValue },
  });
}

/* -------- UPDATE PHONE -------- */
export async function updatePhone(oldValue: string, newValue: string) {
  const id = await getEmployeeId();

  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp || emp.phone !== oldValue) throw new Error("Invalid current phone");

  await prisma.employee.update({
    where: { id },
    data: { phone: newValue },
  });
}

/* -------- UPDATE PIN -------- */
export async function updatePin(oldPin: string, newPin: string) {
  const id = await getEmployeeId();

  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp || emp.pinCode !== oldPin) throw new Error("Invalid PIN");

  await prisma.employee.update({
    where: { id },
    data: { pinCode: newPin },
  });
}

export async function getEmployeeAvailableMonths(): Promise<string[]> {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;
  if (!employeeId) throw new Error("Unauthorized");

  // Get distinct months from TimeLog
  const logs = await prisma.timeLog.findMany({
    where: { employeeId },
    select: { logDate: true },
    orderBy: { logDate: "asc" },
  });

  const monthsSet = new Set(
    logs.map((log) => {
      const d = log.logDate;
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      return `${year}-${month}`;
    })
  );

  return Array.from(monthsSet).sort();
}





export async function getEmployeeMessages(limit?: number) {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;
  if (!employeeId) throw new Error("Unauthorized");

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });

  if (!employee) throw new Error("Employee not found");

  const messages = await prisma.message.findMany({
    where: {
      companyId: employee.companyId,
      OR: [{ employeeId }, { isBroadcast: true }],
    },
    include: {
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // ✅ SERIALIZE DATES
  return messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));
}


export async function markMessageRead(messageId: string) {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;
  if (!employeeId) throw new Error("Unauthorized");

  await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
}



function getWeekRange(weekOffset = 0) {
  const now = new Date();
  const day = now.getDay() || 7; // Sunday = 7
  now.setDate(now.getDate() - day + 1 + weekOffset * 7); // Monday

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}


export async function getEmployeeWeeklyMessages(weekOffset = 0) {
  const jar = await cookies();
  const employeeId = jar.get("employee_session")?.value;
  if (!employeeId) throw new Error("Unauthorized");

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });
  if (!employee) throw new Error("Employee not found");

  const { start, end } = getWeekRange(weekOffset);

  const messages = await prisma.message.findMany({
    where: {
      companyId: employee.companyId,
      createdAt: { gte: start, lt: end },
      OR: [{ employeeId }, { isBroadcast: true }],
    },
    include: {
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));
}
