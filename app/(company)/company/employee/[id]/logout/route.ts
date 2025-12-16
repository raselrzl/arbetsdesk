// app/company/employee/[id]/logout/route.ts
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await prisma.timeLog.findFirst({
    where: {
      employeeId: id,
      logDate: today,
      logoutTime: null, // ✅ only open session
    },
    orderBy: { loginTime: "desc" },
  });

  if (!log) {
    return NextResponse.json(
      { error: "Employee is not logged in" },
      { status: 400 }
    );
  }

  await prisma.timeLog.update({
    where: { id: log.id },
    data: {
      logoutTime: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
