"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";

/* ----------------------------------------
   HELPERS
---------------------------------------- */
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/* ----------------------------------------
   CORE LOGIN (creates timelog)
---------------------------------------- */
async function createLogin(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const { start, end } = getTodayRange();

  // 🔒 Prevent double login TODAY only
  const activeToday = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
      logDate: {
        gte: start,
        lte: end,
      },
    },
  });

  if (activeToday) {
    return {
      status: "ALREADY_LOGGED_IN",
    };
  }

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId: employee.companyId,
      loginTime: new Date(),
      logDate: new Date(),
    },
  });

  return { status: "LOGGED_IN" };
}

/* ----------------------------------------
   LOGIN WITH PERSONAL NUMBER
---------------------------------------- */
export async function loginEmployeeWithPin(
  employeeId: string,
  personalNumber: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee || employee.personalNumber !== personalNumber) {
    throw new Error("Employee not registered or wrong personal number");
  }

  return await createLogin(employee.id);
}

/* ----------------------------------------
   LOGIN BY PERSONAL NUMBER + COMPANY
---------------------------------------- */
export async function loginEmployeeWithPinByNumber(
  personalNumber: string,
  companyId: string
) {
  const employee = await prisma.employee.findFirst({
    where: { personalNumber, companyId },
  });

  if (!employee) {
    throw new Error("Not authorized for this company");
  }

  const { start, end } = getTodayRange();

  // 🔒 Already logged in today?
  const activeToday = await prisma.timeLog.findFirst({
    where: {
      employeeId: employee.id,
      logoutTime: null,
      logDate: {
        gte: start,
        lte: end,
      },
    },
  });

  if (activeToday) {
    return {
      status: "ALREADY_LOGGED_IN",
      employeeName: employee.name,
    };
  }

  // 🔹 Fetch today's schedule
  const schedule = await prisma.schedule.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: start,
        lte: end,
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // 🔹 Create login
  await prisma.timeLog.create({
    data: {
      employeeId: employee.id,
      companyId,
      loginTime: new Date(),
      logDate: new Date(),
    },
  });

  if (!schedule) {
    return {
      status: "LOGGED_IN_NO_SCHEDULE",
      employeeName: employee.name,
    };
  }

  return {
    status: "LOGGED_IN_WITH_SCHEDULE",
    employeeName: employee.name,
    schedule,
  };
}

/* ----------------------------------------
   LOGOUT WITH PERSONAL NUMBER
---------------------------------------- */
export async function logoutEmployeeWithPin(
  employeeId: string,
  personalNumber: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee || employee.personalNumber !== personalNumber) {
    throw new Error("Invalid personal number");
  }

  const { start, end } = getTodayRange();

  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
      logDate: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      loginTime: "desc",
    },
  });

  if (!activeLog || !activeLog.loginTime) {
    throw new Error("No active session found");
  }

  const logoutTime = new Date();
  const totalMinutes = Math.floor(
    (logoutTime.getTime() - activeLog.loginTime.getTime()) / 60000
  );

  await prisma.timeLog.update({
    where: { id: activeLog.id },
    data: {
      logoutTime,
      totalMinutes,
    },
  });

  return { status: "LOGGED_OUT" };
}

/* ----------------------------------------
   ADMIN FORCE LOGOUT (optional)
---------------------------------------- */
export async function forceLogoutEmployee(employeeId: string) {
  const { start, end } = getTodayRange();

  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
      logDate: {
        gte: start,
        lte: end,
      },
    },
  });

  if (!activeLog) return;

  const logoutTime = new Date();

  await prisma.timeLog.update({
    where: { id: activeLog.id },
    data: {
      logoutTime,
      totalMinutes: Math.floor(
        (logoutTime.getTime() -
          (activeLog.loginTime?.getTime() ?? logoutTime.getTime())) /
          60000
      ),
    },
  });
}



export async function deleteEmployee(employeeId: string) {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, companyId },
  });

  if (!employee) {
    throw new Error("Employee not found or unauthorized");
  }

  // Delete dependent records
  await prisma.timeLog.deleteMany({
    where: { employeeId },
  });

  await prisma.schedule.deleteMany({
    where: { employeeId },
  });

  await prisma.salarySlip.deleteMany({
    where: { employeeId },
  });

  // Finally, delete the employee
  await prisma.employee.delete({
    where: { id: employeeId },
  });

  return { success: true };
}