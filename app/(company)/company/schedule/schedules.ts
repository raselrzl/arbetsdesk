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

// Server Actions
export async function createSchedule({
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
