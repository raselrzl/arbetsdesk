// app/company/employee/[id]/logout/route.ts
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // find the latest open log (logoutTime = null)
  const log = await prisma.timeLog.findFirst({
    where: { employeeId: id, logoutTime: null },
    orderBy: { loginTime: "desc" },
  });

  if (!log) {
    return NextResponse.json(
      { error: "Employee is not logged in" },
      { status: 400 }
    );
  }

  const logoutTime = new Date();
  const loginTime = log.loginTime!;
  const totalMinutes = Math.floor(
    (logoutTime.getTime() - loginTime.getTime()) / 60000
  );

  await prisma.timeLog.update({
    where: { id: log.id },
    data: { logoutTime, totalMinutes },
  });
  return NextResponse.redirect("/company");
}
