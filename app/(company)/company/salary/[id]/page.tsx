import React from "react";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
import EmployeeScheduleTable from "../EmployeeScheduleTable";

type Params = { id: string };

async function getEmployeeData(personalNumber: string) {
  const employee = await prisma.employee.findFirst({
    where: { person: { personalNumber } },
    select: {
      person: { select: { name: true, personalNumber: true } },
      schedules: { select: { date: true, startTime: true, endTime: true } },
      timeLogs: {
        select: {
          id: true,
          logDate: true,
          loginTime: true,
          logoutTime: true,
          status: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!employee || !employee.person) notFound();

  return {
    name: employee.person.name,
    personalNumber: employee.person.personalNumber!,
    schedules: employee.schedules || [],
    timeLogs: employee.timeLogs || [],
  };
}

export default async function EmployeeSchedulePage({
  params,
}: {
  params: Promise<Params>;
}) {
  // Await params because App Router now gives a Promise
  const { id } = await params;

  const employeeData = await getEmployeeData(id);

  // Convert all dates to Date objects for client component
  const schedulesFormatted = employeeData.schedules.map((s) => ({
    date: new Date(s.date),
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
  }));

  const timeLogsFormatted = employeeData.timeLogs.map((t) => ({
    id: t.id,
    logDate: new Date(t.logDate),
    loginTime: t.loginTime ? new Date(t.loginTime) : undefined,
    logoutTime: t.logoutTime ? new Date(t.logoutTime) : undefined,
    status: t.status as "PENDING" | "APPROVED" | "REJECTED",
    updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
  }));

  return (
    <EmployeeScheduleTable
      name={employeeData.name}
      personalNumber={employeeData.personalNumber}
      schedules={schedulesFormatted}
      timeLogs={timeLogsFormatted}
    />
  );
}
