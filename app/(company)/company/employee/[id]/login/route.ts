// app/company/employee/[id]/login/route.ts
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  // Find the employee first to get companyId
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
  }

  const log = await prisma.timeLog.create({
    data: {
      employeeId: id,
      companyId: employee.companyId, // ✅ required
      loginTime: new Date(),
      logDate: new Date(), // store full date
    },
  });

  return NextResponse.json({ success: true, log });
}
