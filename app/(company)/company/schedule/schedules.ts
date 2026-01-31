"use server";

import { prisma } from "@/app/utils/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Fetch companyId from cookies
async function getCompanyId() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("companyId is required");
  return companyId;
}



function buildDateTimes(date: string, start: string, end: string) {
  const startTime = new Date(`${date}T${start}`);
  let endTime = new Date(`${date}T${end}`);

  // overnight shift (e.g. 16:00 → 03:00)
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  return { startTime, endTime };
}


// Server Actions
/* export async function createSchedule({
  employeeIds,
  date,
  startTime,
  endTime,
}: {
  employeeIds: string[];
  date: string;
  startTime: string;
  endTime: string;
}) {
  const companyId = await getCompanyId();

  return Promise.all(
    employeeIds.map((employeeId) =>
      prisma.schedule.create({
        data: {
          companyId,
          employeeId,
          date: new Date(date),
          startTime: new Date(`${date}T${startTime}`),
          endTime: new Date(`${date}T${endTime}`),
        },
      })
    )
  );
} */

export async function createOrReplaceSchedule({
  employeeIds,
  date,
  startTime,
  endTime,
  replace,
}: {
  employeeIds: string[];
  date: string;
  startTime: string; // "16:00"
  endTime: string;   // "23:00"
  replace: boolean;
}) {
  const companyId = await getCompanyId();

  for (const employeeId of employeeIds) {
    // Build full start/end Date objects in UTC
    const start = new Date(`${date}T${startTime}:00Z`); // Z = UTC
    let end = new Date(`${date}T${endTime}:00Z`);

    // Handle overnight shift
    if (end <= start) {
      end.setUTCDate(end.getUTCDate() + 1);
    }

    // Find overlapping schedules
    const overlaps = await prisma.schedule.findMany({
      where: {
        companyId,
        employeeId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    // If overlap exists and replace is false
    if (overlaps.length > 0 && !replace) {
      throw new Error("OVERLAP_EXISTS");
    }

    // If replace is true, delete overlaps
    if (overlaps.length > 0 && replace) {
      await prisma.schedule.deleteMany({
        where: { id: { in: overlaps.map((s) => s.id) } },
      });
    }

    // Create new schedule
    await prisma.schedule.create({
      data: {
        companyId,
        employeeId,
        date: new Date(date), // date for reference only
        startTime: start,
        endTime: end,
      },
    });
  }
}



export async function getCompanyEmployees() {
  const companyId = await getCompanyId();

  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      contractType: true,
      hourlyRate: true,
      monthlySalary: true,
      person: {
        select: {
          name: true,            // ✅ get the name from Person
          personalNumber: true,  // if needed
        },
      },
    },
  });

  // Optional: map to flatten structure
  return employees.map(emp => ({
    id: emp.id,
    contractType: emp.contractType,
    hourlyRate: emp.hourlyRate,
    monthlySalary: emp.monthlySalary,
    name: emp.person.name,              // flatten name
    personalNumber: emp.person.personalNumber,
  }));
}



export async function getSchedulesForCompany() {
  const companyId = await getCompanyId();

  return prisma.schedule.findMany({
    where: { companyId },
    include: { employee: true },
    orderBy: { date: "asc" },
  });
}


// Server Action to update an existing schedule
// Server Action to update an existing schedule
export async function updateSchedule(
  scheduleId: string,
  {
    date,
    startTime,
    endTime,
  }: { date?: string; startTime?: string; endTime?: string }
) {
  // Fetch existing schedule to get the original date if needed
  const existing = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });
  if (!existing) throw new Error("Schedule not found");

  const updateData: any = {};

  // Determine which date to use (updated or existing)
  const baseDate = date ?? existing.date.toISOString().slice(0, 10);

  // Build start/end times if provided
  if (startTime) {
    updateData.startTime = new Date(`${baseDate}T${startTime}:00Z`);
  }

  if (endTime) {
    let end = new Date(`${baseDate}T${endTime}:00Z`);

    // If startTime is also updated, use it; otherwise fallback to existing startTime
    const start = updateData.startTime ?? existing.startTime;

    // Handle overnight shift
    if (end <= start) {
      end.setUTCDate(end.getUTCDate() + 1);
    }

    updateData.endTime = end;
  }

  // Update the reference date if provided
  if (date) {
    updateData.date = new Date(date); // For reference only
  }

  return prisma.schedule.update({
    where: { id: scheduleId },
    data: updateData,
  });
}


// Get time logs for the company
export async function getTimeLogsForCompany() {
  const companyId = await getCompanyId();

  return prisma.timeLog.findMany({
    where: { companyId },
    include: { employee: true },
    orderBy: { logDate: "asc" },
  });
}


/* export async function swapSchedules(scheduleIdA: string, scheduleIdB: string) {
  const scheduleA = await prisma.schedule.findUnique({ where: { id: scheduleIdA } });
  const scheduleB = await prisma.schedule.findUnique({ where: { id: scheduleIdB } });

  if (!scheduleA || !scheduleB) throw new Error("One or both schedules not found");

  // Swap date, startTime, endTime
  await prisma.$transaction([
    prisma.schedule.update({
      where: { id: scheduleA.id },
      data: {
        date: scheduleB.date,
        startTime: scheduleB.startTime,
        endTime: scheduleB.endTime,
      },
    }),
    prisma.schedule.update({
      where: { id: scheduleB.id },
      data: {
        date: scheduleA.date,
        startTime: scheduleA.startTime,
        endTime: scheduleA.endTime,
      },
    }),
  ]);

  revalidatePath("/company/schedule");
} */

export async function swapSchedules(scheduleIdA: string, scheduleIdB: string) {
  const scheduleA = await prisma.schedule.findUnique({ where: { id: scheduleIdA } });
  const scheduleB = await prisma.schedule.findUnique({ where: { id: scheduleIdB } });

  if (!scheduleA || !scheduleB) throw new Error("One or both schedules not found");

  // Swap only startTime and endTime
  await prisma.$transaction([
    prisma.schedule.update({
      where: { id: scheduleA.id },
      data: {
        startTime: scheduleB.startTime,
        endTime: scheduleB.endTime,
      },
    }),
    prisma.schedule.update({
      where: { id: scheduleB.id },
      data: {
        startTime: scheduleA.startTime,
        endTime: scheduleA.endTime,
      },
    }),
  ]);

  // Live update the page (Next.js 13+ server actions)
  revalidatePath("/company/schedule");
}
