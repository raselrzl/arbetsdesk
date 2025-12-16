// app/company/employee/[id]/login/route.ts
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  // optional: validate PIN here

  const log = await prisma.timeLog.create({
    data: {
      employeeId: id,
      loginTime: new Date(),
      logDate: new Date(), // store full date, not just 0:00
    },
  });

  return NextResponse.json({ success: true, log });
}
