// app/actions/employeeActions.ts
"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ------------------- HELPERS -------------------

async function getEmployeeByContext(companyId?: string) {
  const jar = await cookies();
  const personalNumber = jar.get("employee_personal")?.value;
  if (!personalNumber) throw new Error("Unauthorized");

  const employee = await prisma.employee.findFirst({
    where: {
      companyId: companyId ?? undefined,
      person: { personalNumber },
    },
    include: {
      person: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          personalNumber: true,
          pinCode: true,
        },
      },
      company: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!employee) throw new Error("Employee not found");
  return employee;
}

async function getEmployeeIdByPersonalNumber(companyId?: string) {
  const jar = await cookies();
  const personalNumber = jar.get("employee_personal")?.value;
  if (!personalNumber) throw new Error("Unauthorized");

  const employee = await prisma.employee.findFirst({
    where: {
      companyId: companyId ?? undefined,
      person: {
        personalNumber, // ✅ query via relation
      },
    },
    select: { id: true },
  });

  if (!employee) throw new Error("Employee not found");
  return employee.id;
}


async function getEmployeeId() {
  const jar = await cookies();
  const id = jar.get("employee_session")?.value;
  if (!id) throw new Error("Unauthorized");
  return id;
}

// ------------------- SCHEDULES -------------------

export async function getEmployeeSchedule(companyId?: string) {
  const employeeId = await getEmployeeIdByPersonalNumber(companyId);

  const schedules = await prisma.schedule.findMany({
    where: { employeeId, ...(companyId ? { companyId } : {}) },
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

export async function getEmployeeMonthlyHours(companyId?: string) {
  const employeeId = await getEmployeeIdByPersonalNumber(companyId);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const logs = await prisma.timeLog.findMany({
    where: {
      employeeId,
      ...(companyId ? { companyId } : {}),
      logDate: { gte: startOfMonth, lte: endOfMonth },
      loginTime: { not: null },
      logoutTime: { not: null },
    },
    orderBy: { logDate: "asc" },
  });

  let totalMinutes = 0;
  const daily = logs.map((log) => {
    const minutes = Math.floor(
      (log.logoutTime!.getTime() - log.loginTime!.getTime()) / 60000
    );
    totalMinutes += minutes;
    return {
      date: log.logDate.toISOString(),
      start: log.loginTime!.toISOString(),
      end: log.logoutTime!.toISOString(),
      minutes,
    };
  });

  return { totalMinutes, daily };
}

export async function getEmployeeMonthlySchedule(
  month: string,
  companyId?: string
) {
  const employeeId = await getEmployeeIdByPersonalNumber(companyId);
  const [year, m] = month.split("-").map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 0, 23, 59, 59);

  const schedules = await prisma.schedule.findMany({
    where: { employeeId, ...(companyId ? { companyId } : {}), date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  return schedules.map((s) => ({
    date: s.date.toISOString().slice(0, 10),
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    hours: (s.endTime.getTime() - s.startTime.getTime()) / 3600000,
    companyId: s.companyId,
  }));
}

// ------------------- EMPLOYEE PROFILE -------------------

export async function getEmployeeProfile(companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  return {
    id: employee.id,
    name: employee.person.name,
    email: employee.person.email ?? null,
    phone: employee.person.phone ?? null,
    personalNumber: employee.person.personalNumber,
    contractType: employee.contractType,
    pinCode: employee.person.pinCode ?? null,
    hourlyRate: employee.hourlyRate ?? null,
    monthlySalary: employee.monthlySalary ?? null,
    createdAt: employee.createdAt,
    company: employee.company,
  };
}

// ------------------- UPDATE FIELDS -------------------

export async function updateName(oldValue: string, newValue: string, companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  if (employee.person.name !== oldValue) throw new Error("Invalid current name");

  await prisma.person.update({
    where: { id: employee.person.id },
    data: { name: newValue },
  });
}

export async function updateEmail(oldValue: string, newValue: string, companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  if (employee.person.email !== oldValue) throw new Error("Invalid current email");

  await prisma.person.update({
    where: { id: employee.person.id },
    data: { email: newValue },
  });
}

export async function updatePhone(oldValue: string, newValue: string, companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  if (employee.person.phone !== oldValue) throw new Error("Invalid current phone");

  await prisma.person.update({
    where: { id: employee.person.id },
    data: { phone: newValue },
  });
}

export async function updatePin(oldPin: string, newPin: string, companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  if (employee.person.pinCode !== oldPin) throw new Error("Invalid PIN");

  await prisma.person.update({
    where: { id: employee.person.id },
    data: { pinCode: newPin },
  });
}

// ------------------- MESSAGES -------------------

export async function getEmployeeMessages(limit?: number, companyId?: string) {
  const employee = await getEmployeeByContext(companyId);

  const messages = await prisma.message.findMany({
    where: {
      companyId: employee.companyId,
      OR: [{ employeeId: employee.id }, { isBroadcast: true }],
    },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
}

export async function markMessageRead(messageId: string) {
  const employeeId = await getEmployeeIdByPersonalNumber();
  await prisma.message.update({ where: { id: messageId }, data: { isRead: true } });
}

export async function sendEmployeeMessage({
  title,
  content,
  companyId,
}: {
  title?: string;
  content: string;
  companyId: string;
}) {
  const jar = await cookies();
const personalNumber = jar.get("employee_personal")?.value;
if (!personalNumber) throw new Error("Unauthorized");

// Find employee by personalNumber
const employee = await prisma.employee.findFirst({
  where: { person: { personalNumber } },
  select: { id: true },
});

if (!employee) throw new Error("Unauthorized");

const message = await prisma.employeeMessage.create({
  data: {
    employeeId: employee.id,
    companyId,
    title,
    content,
  },
});

return { ...message, createdAt: message.createdAt.toISOString() };

}

// ------------------- LOGOUT -------------------

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("employee_session");
  redirect("/");
}

// ------------------- COMPANIES -------------------

export async function getEmployeeCompanies() {
  const jar = await cookies();
  const personalNumber = jar.get("employee_personal")?.value;
  if (!personalNumber) throw new Error("Unauthorized");

  const employees = await prisma.employee.findMany({
    where: { person: { personalNumber } },
    select: { companyId: true, company: { select: { id: true, name: true } } },
  });

  return employees.map((e) => ({ companyId: e.companyId, companyName: e.company.name }));
}


// ------------------- WEEKLY MESSAGES -------------------
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

export async function getEmployeeWeeklyMessages(
  weekOffset = 0,
  companyId?: string
) {
  const employee = await getEmployeeByContext(companyId);

  const { start, end } = getWeekRange(weekOffset);

  const messages = await prisma.message.findMany({
    where: {
      companyId: employee.companyId,
      createdAt: { gte: start, lt: end },
      OR: [{ employeeId: employee.id }, { isBroadcast: true }],
    },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
}

// ------------------- MONTHLY DATA -------------------
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
  month: string,
  companyId?: string
): Promise<{ employee: Employee; dailyWork: DailyWork[] }> {
  const employee = await getEmployeeByContext(companyId);

  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1);

  const logs = await prisma.timeLog.findMany({
    where: { employeeId: employee.id, logDate: { gte: start, lt: end } },
  });

  const daily: DailyWork[] = logs.map((log) => ({
    date: log.logDate.toISOString().slice(0, 10),
    loginTime: log.loginTime,
    logoutTime: log.logoutTime,
    totalMinutes:
      log.totalMinutes ??
      (log.loginTime && log.logoutTime
        ? Math.floor((log.logoutTime.getTime() - log.loginTime.getTime()) / 60000)
        : 0),
  }));

  return {
    employee: {
      id: employee.id,
      name: employee.person.name,
      contractType: employee.contractType,
      hourlyRate: employee.hourlyRate ?? null,
      monthlySalary: employee.monthlySalary ?? null,
    },
    dailyWork: daily,
  };
}

// ------------------- AVAILABLE MONTHS -------------------
export async function getEmployeeAvailableMonths(companyId?: string): Promise<string[]> {
  const employee = await getEmployeeByContext(companyId);

  const logs = await prisma.timeLog.findMany({
    where: { employeeId: employee.id },
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
