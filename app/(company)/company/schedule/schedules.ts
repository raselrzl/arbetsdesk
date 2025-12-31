"use server";

import { prisma } from "@/app/utils/db";
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
  startTime: string;
  endTime: string;
  replace: boolean;
}) {
  const companyId = await getCompanyId();
  const { startTime: start, endTime: end } =
    buildDateTimes(date, startTime, endTime);

  for (const employeeId of employeeIds) {
    // 🔍 find overlaps
    const overlaps = await prisma.schedule.findMany({
      where: {
        companyId,
        employeeId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    // ❌ overlap exists and not allowed
    if (overlaps.length > 0 && !replace) {
      throw new Error("OVERLAP_EXISTS");
    }

    // 🔁 replace overlapping schedules
    if (overlaps.length > 0 && replace) {
      await prisma.schedule.deleteMany({
        where: { id: { in: overlaps.map((s) => s.id) } },
      });
    }

    // ✅ create new schedule
    await prisma.schedule.create({
      data: {
        companyId,
        employeeId,
        date: new Date(date),
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
    select: { id: true, name: true },
  });

  return employees;
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
export async function updateSchedule(
  scheduleId: string,
  {
    date,
    startTime,
    endTime,
  }: { date?: string; startTime?: string; endTime?: string }
) {
  const updateData: any = {};

  if (date) updateData.date = new Date(date);
  if (startTime) updateData.startTime = new Date(`${date ?? new Date().toISOString().slice(0,10)}T${startTime}`);
  if (endTime) updateData.endTime = new Date(`${date ?? new Date().toISOString().slice(0,10)}T${endTime}`);

  return prisma.schedule.update({
    where: { id: scheduleId },
    data: updateData,
  });
}
