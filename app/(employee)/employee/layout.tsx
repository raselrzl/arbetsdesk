"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
import EmployeeNavbar from "../employeecomponents/EmployeeNavbar";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // ✅ NEW: read personal number, NOT employee id
  const personalNumber = cookieStore.get("employee_personal")?.value;

  if (!personalNumber) redirect("/login");

  // 1️⃣ Get ALL employee records for this person
  const employeeRecords = await prisma.employee.findMany({
    where: { person: { personalNumber } },
    select: {
      id: true,
      person: {
        select: {
          name: true,
          email: true,
        },
      },
      company: {
        select: { id: true, name: true },
      },
    },
  });

  if (employeeRecords.length === 0) redirect("/login");

  // 2️⃣ Base info (same person, any row is fine)
  const baseEmployee = employeeRecords[0];

  // 3️⃣ Collect companies
  const companies = employeeRecords.map((e) => ({
    id: e.company.id,
    name: e.company.name,
  }));

  return (
    <div className="min-h-screen">
      <EmployeeNavbar
        employee={{
          personalNumber,
          name: baseEmployee.person.name,
          email: baseEmployee.person.email ?? null,
          companies,
        }}
      />
      <div className="px-2 pt-4 sm:pt-10">{children}</div>
    </div>
  );
}
