"use server";

import { getWeekRange } from "@/app/utils/date";
import { prisma } from "@/app/utils/db";
import { createEmployeeSchema } from "@/app/utils/schemas";
import { ContractType, EmploymentType, WorkingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
/* export async function loginEmployeeWithPin(
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
} */

//latest

export async function loginEmployeeWithPin(
  employeeId: string,
  personalNumber: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      person: {
        select: {
          personalNumber: true,
        },
      },
    },
  });

  if (!employee || employee.person.personalNumber !== personalNumber) {
    throw new Error("Employee not registered or wrong personal number");
  }

  return await createLogin(employee.id);
}


/* ----------------------------------------
   LOGIN BY PERSONAL NUMBER + COMPANY
---------------------------------------- */
/* export async function loginEmployeeWithPinByNumber(
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
      personalNumber: employee.personalNumber,
      employeeId: employee.id,
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

  // ⏰ EARLY LOGIN CHECK (10 minutes before schedule)
  if (schedule) {
    const now = new Date();
    const startTime = new Date(schedule.startTime);
    const diffMinutes = (startTime.getTime() - now.getTime()) / 60000;

    // Only prompt for early login without creating a timelog yet
    if (diffMinutes > 0 && diffMinutes <= 240) {
      return {
        status: "EARLY_LOGIN_CHOICE_REQUIRED",
        employeeId: employee.id,
        employeeName: employee.name,
        schedule,
      };
    }
  }

  // ❗ NO schedule → ASK frontend, DO NOT LOGIN YET
  if (!schedule) {
    return {
      status: "LOGGED_IN_NO_SCHEDULE",
      employeeId: employee.id,
      employeeName: employee.name,
    };
  }

  await prisma.timeLog.create({
    data: {
      employeeId: employee.id,
      companyId,
      loginTime: new Date(),
      logDate: new Date(),
    },
  });
  revalidatePath("/company");
  return {
    status: "LOGGED_IN_WITH_SCHEDULE",
    employeeName: employee.name,
    schedule,
  };
} */
//latest

export async function loginEmployeeWithPinByNumber(
  personalNumber: string,
  companyId: string
) {
  // 1️⃣ Find employee THROUGH Person
  const employee = await prisma.employee.findFirst({
    where: {
      companyId,
      person: {
        personalNumber,
      },
    },
    include: {
      person: {
        select: {
          name: true,
          personalNumber: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Not authorized for this company");
  }

  const { start, end } = getTodayRange();

  // 2️⃣ Already logged in today?
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
      employeeName: employee.person.name,
      personalNumber: employee.person.personalNumber,
      employeeId: employee.id,
    };
  }

  // 3️⃣ Fetch today's schedule
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

  // 4️⃣ EARLY LOGIN CHECK
  if (schedule) {
    const now = new Date();
    const startTime = new Date(schedule.startTime);
    const diffMinutes = (startTime.getTime() - now.getTime()) / 60000;

    // Early login window (up to 4 hours before)
    if (diffMinutes > 0 && diffMinutes <= 240) {
      return {
        status: "EARLY_LOGIN_CHOICE_REQUIRED",
        employeeId: employee.id,
        employeeName: employee.person.name,
        schedule,
      };
    }
  }

  // 5️⃣ No schedule → frontend decides
  if (!schedule) {
    return {
      status: "LOGGED_IN_NO_SCHEDULE",
      employeeId: employee.id,
      employeeName: employee.person.name,
    };
  }

  // 6️⃣ Create time log
  await prisma.timeLog.create({
    data: {
      employeeId: employee.id,
      companyId,
      loginTime: new Date(),
      logDate: new Date(),
    },
  });

  revalidatePath("/company");

  return {
    status: "LOGGED_IN_WITH_SCHEDULE",
    employeeName: employee.person.name,
    schedule,
  };
}





export async function confirmEarlyStartNow(
  employeeId: string,
  companyId: string
) {
  // Safety: prevent double login
  const active = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
    },
  });

  if (active) {
    return { status: "ALREADY_LOGGED_IN" };
  }

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: new Date(),
      logDate: new Date(),
      isScheduled: false,
      activatedAt: new Date(),
    },
  });

  return { status: "LOGGED_IN" };
}

export async function confirmEarlyStartAtSchedule(
  employeeId: string,
  companyId: string,
  startTime: Date
) {
  const active = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
    },
  });

  if (active) {
    return { status: "ALREADY_LOGGED_IN" };
  }

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: startTime,
      logDate: startTime,
      isScheduled: true,
    },
  });

  return { status: "SCHEDULED" };
}

export async function activateScheduledLogins() {
  await prisma.timeLog.updateMany({
    where: {
      isScheduled: true,
      activatedAt: null,
      loginTime: { lte: new Date() },
    },
    data: {
      isScheduled: false,
      activatedAt: new Date(),
    },
  });
}

export async function confirmLoginWithoutSchedule(
  employeeId: string,
  companyId: string
) {
  const active = await prisma.timeLog.findFirst({
    where: { employeeId, logoutTime: null },
  });

  if (active) {
    return { status: "ALREADY_LOGGED_IN" };
  }

  await prisma.timeLog.create({
    data: {
      employeeId,
      companyId,
      loginTime: new Date(),
      logDate: new Date(),
    },
  });

  revalidatePath("/company");
  return { status: "LOGGED_IN_NO_SCHEDULE" };
}


/* export async function logoutEmployeeWithPin(
  employeeId: string,
  personalNumber: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee || employee.personalNumber !== personalNumber) {
    throw new Error("Invalid personal number");
  }

  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
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

  revalidatePath("/company");

  return { status: "LOGGED_OUT" };
} */

//latest

export async function logoutEmployeeWithPin(
  employeeId: string,
  personalNumber: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      person: {
        select: {
          personalNumber: true,
        },
      },
    },
  });

  if (!employee || employee.person.personalNumber !== personalNumber) {
    throw new Error("Invalid personal number");
  }

  const activeLog = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logoutTime: null,
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

  revalidatePath("/company");

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
  const jar = await cookies();
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

/* export async function getEmployeeMessages() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const messages = await prisma.employeeMessage.findMany({
    where: { companyId },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // normalize null email
  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: {
      id: m.employee.id,
      name: m.employee.name,
      email: m.employee.email ?? undefined,
    },
    isRead: m.isRead,
  }));
} */

//latest
export async function getEmployeeMessages() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const messages = await prisma.employeeMessage.findMany({
    where: { companyId },
    include: {
      employee: {
        include: {
          person: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: {
      id: m.employee.person.id,
      name: m.employee.person.name,
      email: m.employee.person.email ?? undefined,
    },
    isRead: m.isRead,
  }));
}



// Fetch messages sent by the company
export async function getCompanyMessages() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: { companyId, isBroadcast: true },
    include: {
      company: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }));
}

function getDateRangeFromDate(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/* export async function getEmployeeMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.employeeMessage.findMany({
    where: {
      companyId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: { employee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: {
      id: m.employee.id,
      name: m.employee.name,
      email: m.employee.email ?? undefined,
    },
    isRead: m.isRead,
  }));
} */

//latest
export async function getEmployeeMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.employeeMessage.findMany({
    where: {
      companyId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: {
      employee: {
        include: {
          person: true, // fetch all person fields
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages
    .filter((m) => m.employee?.person) // ensure the relation exists
    .map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      employee: {
        id: m.employee.person.id,
        name: m.employee.person.name,
        email: m.employee.person.email ?? undefined,
      },
      isRead: m.isRead,
    }));
}



/* export async function getCompanyMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.message.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: {
      company: { select: { name: true } },
      employee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: m.isBroadcast,
    companyName: m.company.name,
    employeeName: m.employee?.name,
  }));
} */
//latest

export async function getCompanyMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.message.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: {
      company: { select: { name: true } },
      employee: {
        include: {
          person: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: m.isBroadcast,
    companyName: m.company.name,
    employeeName: m.employee?.person?.name,
  }));
}



/* export async function fetchMessagesForDate(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  // Employee messages for the selected date
  const employeeMessagesRaw = await prisma.employeeMessage.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: { employee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const employeeMessages = employeeMessagesRaw.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: {
      id: m.employee.id,
      name: m.employee.name,
      email: m.employee.email ?? undefined,
    },
    isRead: m.isRead,
  }));

  // Only **broadcast** company messages (employeeId null)
  const companyMessagesRaw = await prisma.message.findMany({
    where: {
      companyId,
      employeeId: null, // broadcast only
      createdAt: { gte: start, lte: end },
    },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const companyMessages = companyMessagesRaw.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: true,
    companyName: m.company.name,
  }));

  return { employeeMessages, companyMessages };
} */

  //latest
  export async function fetchMessagesForDate(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  // Employee messages for the selected date
  const employeeMessagesRaw = await prisma.employeeMessage.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: {
      employee: {
        include: {
          person: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const employeeMessages = employeeMessagesRaw.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: {
      id: m.employee.person.id,
      name: m.employee.person.name,
      email: m.employee.person.email ?? undefined,
    },
    isRead: m.isRead,
  }));

  // Only **broadcast** company messages (employeeId null)
  const companyMessagesRaw = await prisma.message.findMany({
    where: {
      companyId,
      employeeId: null, // broadcast only
      createdAt: { gte: start, lte: end },
    },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const companyMessages = companyMessagesRaw.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: true,
    companyName: m.company.name,
  }));

  return { employeeMessages, companyMessages };
}







// ------------------- TIME LOG -------------------
export async function getEmployeeCurrentLoginTime(employeeId: string) {
  const log = await prisma.timeLog.findFirst({
    where: { employeeId, logoutTime: null }, // still logged in
    orderBy: { loginTime: "desc" },
    select: { loginTime: true },
  });

  if (!log || !log.loginTime) return null; // <-- handle null
  return log.loginTime.toISOString();
}

