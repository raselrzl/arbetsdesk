"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";

/* ----------------------------------------
   LOGIN (start time)
---------------------------------------- */
export async function loginEmployee(employeeId: string) {
  const now = new Date();

  // get employee to access companyId
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // prevent double login
  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
    },
  });

  if (activeLog) {
    throw new Error("Employee is already logged in");
  }

  const log = await prisma.timeLog.create({
    data: {
      employeeId,
      companyId: employee.companyId, // ✅ REQUIRED
      loginTime: now,
      logDate: now,
    },
  });

  return log;
}

/* ----------------------------------------
   LOGOUT (stop time)
---------------------------------------- */
export async function logoutEmployee(employeeId: string) {
  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
    },
    orderBy: {
      loginTime: "desc",
    },
  });

  if (!activeLog) {
    throw new Error("No active session found");
  }

  const updated = await prisma.timeLog.update({
    where: { id: activeLog.id },
    data: {
      logoutTime: new Date(),
    },
  });

  return updated;
}

/* ----------------------------------------
   LOGIN WITH PERSONAL NUMBER + PIN
---------------------------------------- */

export async function loginEmployeeWithPin(
  employeeId: string,
  personalNumber: string
  /*  pin: string */
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.personalNumber !== personalNumber) {
      throw new Error("Employee not registered or wrong personnummer");
    }

    /*  if (employee.pinCode !== pin) {
    throw new Error("Incorrect PIN code");
  } */

    return await loginEmployee(employeeId);
  } catch {
    // ✅ Always send a safe, readable message to client
    throw new Error("Employee not registered or wrong personnummer");
  }
}

/* export async function loginEmployeeWithPinByNumber(
  personalNumber: string,
  companyId: string
) {
  const employee = await prisma.employee.findFirst({
    where: {
      personalNumber,
      companyId,
    },
  });

  if (!employee) {
    throw new Error("Not authorized for this company");
  }

  return await loginEmployee(employee.id);
} */

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

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.personalNumber !== personalNumber) {
    throw new Error("Incorrect personal ID");
  }

  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
    },
    orderBy: { loginTime: "desc" },
  });

  if (!activeLog || !activeLog.loginTime) {
    throw new Error("No active session found");
  }

  const logoutTime = new Date();

  const totalMinutes = Math.floor(
    (logoutTime.getTime() - activeLog.loginTime.getTime()) / 60000
  );

  return await prisma.timeLog.update({
    where: { id: activeLog.id },
    data: {
      logoutTime,
      totalMinutes,
    },
  });
}

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

  // 🔹 Already logged in?
  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId: employee.id,
      logoutTime: null,
    },
  });

  if (activeLog) {
    return {
      status: "ALREADY_LOGGED_IN",
      employeeName: employee.name,
    };
  }

  // 🔹 Today range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  // 🔹 Fetch today's schedule
  const schedule = await prisma.schedule.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // 🔹 Login always allowed
  await loginEmployee(employee.id);

  if (!schedule) {
    return {
      status: "LOGGED_IN_NO_SCHEDULE",
      employeeName: employee.name,
    };
  }

  return {
    status: "LOGGED_IN_WITH_SCHEDULE",
    employeeName: employee.name,
    schedule: {
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    },
  };
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

