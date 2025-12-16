// app/company/employee/[id]/login/route.ts
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX
  const body = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // optional: validate PIN here

  await prisma.timeLog.create({
    data: {
      employeeId: id,
      loginTime: new Date(),
      logDate: today,
    },
  });

  return NextResponse.json({ success: true });
}
