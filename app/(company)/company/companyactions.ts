"use server";

import { prisma } from "@/app/utils/db";

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
  personalNumber: string,
 /*  pin: string */
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error("Innovators not found");
  }

  if (employee.personalNumber !== personalNumber) {
    throw new Error("Incorrect personal ID");
  }

 /*  if (employee.pinCode !== pin) {
    throw new Error("Incorrect PIN code");
  } */

  // ✅ credentials valid → start time
  return await loginEmployee(employeeId);
}


export async function loginEmployeeWithPinByNumber(personalNumber: string) {
  const employee = await prisma.employee.findFirst({
    where: { personalNumber },
  });

  if (!employee) throw new Error("Employee not found");
  return await loginEmployee(employee.id);
}