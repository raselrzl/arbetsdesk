"use server";

import { prisma } from "@/app/utils/db";
function getTodayRange() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * CONFIG
 */
const MAX_SHIFT_HOURS = 24;

/**
 * Utils
 */
function minutesBetween(a: Date, b: Date) {
  return Math.max(Math.floor((b.getTime() - a.getTime()) / 60000), 0);
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

/**
 * Get active (not logged out) timelog
 */
async function getActiveTimeLog(employeeId: string, companyId?: string) {
  return prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
      ...(companyId ? { companyId } : {}),
    },
    orderBy: { loginTime: "desc" },
  });
}

/**
 * Close active timelog safely (ONLY way to close shifts)
 */
async function closeActiveTimeLog(
  employeeId: string,
  companyId?: string,
  autoClosed = false
) {
  const active = await getActiveTimeLog(employeeId, companyId);
  if (!active || !active.loginTime) return null;

  const logoutTime = new Date();
  const totalMinutes = minutesBetween(active.loginTime, logoutTime);

  return prisma.timeLog.update({
    where: { id: active.id },
    data: {
      logoutTime,
      totalMinutes,
      ...(autoClosed ? { autoClosed: true } : {}),
    },
  });
}

/**
 * LOGIN
 */
export async function loginEmployeeWithPinByNumber(
  personalNumber: string,
  companyId: string
) {
  const employee = await prisma.employee.findFirst({
    where: {
      companyId,
      person: { personalNumber },
    },
    include: {
      person: { select: { name: true, personalNumber: true } },
    },
  });

  if (!employee) {
    throw new Error("Not authorized");
  }

  /**
   * 1️⃣ HANDLE ACTIVE SESSION (ANY DAY)
   */
  const active = await getActiveTimeLog(employee.id, companyId);

  if (active?.loginTime) {
    const now = new Date();

    // Auto-close insane shifts (crash, forgot logout, etc.)
    const hoursOpen =
      (now.getTime() - active.loginTime.getTime()) / 3600000;

    if (hoursOpen > MAX_SHIFT_HOURS) {
      await closeActiveTimeLog(employee.id, companyId, true);
    } else {
      return {
        status: "ALREADY_LOGGED_IN",
        employeeName: employee.person.name,
        personalNumber: employee.person.personalNumber,
        employeeId: employee.id,
        isSameDay: isSameDay(active.loginTime, now),
      };
    }
  }

  /**
   * 2️⃣ GET TODAY SCHEDULE
   */
  const { start, end } = getTodayRange();

  const schedule = await prisma.schedule.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: start, lte: end },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  /**
   * 3️⃣ EARLY LOGIN WINDOW (≤ 4 HOURS)
   */
  if (schedule) {
    const now = new Date();
    const startTime = new Date(schedule.startTime);
    const diffMinutes = (startTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes > 0 && diffMinutes <= 240) {
      return {
        status: "EARLY_LOGIN_CHOICE_REQUIRED",
        employeeId: employee.id,
        employeeName: employee.person.name,
        schedule,
      };
    }
  }

  /**
   * 4️⃣ NO SCHEDULE
   */
  if (!schedule) {
    return {
      status: "LOGGED_IN_NO_SCHEDULE",
      employeeId: employee.id,
      employeeName: employee.person.name,
    };
  }

  /**
   * 5️⃣ NORMAL LOGIN
   */
  const now = new Date();

  await prisma.timeLog.create({
    data: {
      employeeId: employee.id,
      companyId,
      loginTime: now,
      logDate: now,
      isScheduled: true,
      status: "PENDING",
    },
  });

  return {
    status: "LOGGED_IN_WITH_SCHEDULE",
    employeeName: employee.person.name,
    schedule,
  };
}

/**
 * LOGOUT
 */
export async function logoutEmployeeWithPin(
  employeeId: string,
  personalNumber: string,
  companyId: string
) {
  await closeActiveTimeLog(employeeId, companyId);
  return { status: "LOGGED_OUT" };
}

/**
 * CONFIRM LOGIN WITHOUT SCHEDULE
 */
export async function confirmLoginWithoutSchedule(
  employeeId: string,
  companyId: string
) {
  await closeActiveTimeLog(employeeId, companyId);

  const now = new Date();

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: now,
      logDate: now,
      isScheduled: false,
      status: "PENDING",
    },
  });

  return { status: "LOGGED_IN_NO_SCHEDULE" };
}

/**
 * EARLY START → NOW
 */
export async function confirmEarlyStartNow(
  employeeId: string,
  companyId: string
) {
  await closeActiveTimeLog(employeeId, companyId);

  const now = new Date();

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: now,
      logDate: now,
      activatedAt: now,
      isScheduled: false,
      status: "PENDING",
    },
  });

  return { status: "LOGGED_IN_WITH_SCHEDULE" };
}

/**
 * EARLY START → AT SCHEDULE
 */
export async function confirmEarlyStartAtSchedule(
  employeeId: string,
  companyId: string,
  startTime: Date
) {
  await closeActiveTimeLog(employeeId, companyId);

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: startTime,
      logDate: startTime,
      isScheduled: true,
      status: "PENDING",
    },
  });

  return { status: "LOGGED_IN_WITH_SCHEDULE" };
}
