import React from "react";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
import EmployeeScheduleTable from "../EmployeeScheduleTable";

async function getEmployeeData(
  personalNumber: string,
  month: number,
  year: number
) {
  const startOfMonth = new Date(year, month - 1, 1);
  const startOfNextMonth = new Date(year, month, 1);

  const employee = await prisma.employee.findFirst({
    where: { person: { personalNumber } },
    select: {
      id: true,
      person: { select: { name: true, personalNumber: true } },

      schedules: {
        where: {
          date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        select: {
          date: true,
          startTime: true,
          endTime: true,
        },
      },

      timeLogs: {
        where: {
          logDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        select: {
          id: true,
          logDate: true,
          loginTime: true,
          logoutTime: true,
          status: true,
          updatedAt: true,
        },
        orderBy: {
          logDate: "asc",
        },
      },
    },
  });

  if (!employee || !employee.person) notFound();

  return employee;
}

export default async function EmployeeSchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  // ✅ MUST await params in your Next version
  const { id } = await params;
  const { month, year } = await searchParams;

  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (!monthNumber || !yearNumber) {
    notFound();
  }

  const employee = await getEmployeeData(id, monthNumber, yearNumber);

  const schedulesFormatted = employee.schedules.map((s) => ({
    date: new Date(s.date),
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
  }));

  const timeLogsFormatted = employee.timeLogs.map((t) => ({
    id: t.id,
    logDate: new Date(t.logDate),
    loginTime: t.loginTime ? new Date(t.loginTime) : undefined,
    logoutTime: t.logoutTime ? new Date(t.logoutTime) : undefined,
    status: t.status as "PENDING" | "APPROVED" | "REJECTED",
    updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
  }));

  return (
    <EmployeeScheduleTable
      name={employee.person!.name}
      personalNumber={employee.person!.personalNumber!}
      schedules={schedulesFormatted}
      timeLogs={timeLogsFormatted}
      employeeId={employee.id}
      month={monthNumber}
      year={yearNumber}
    />
  );
}
