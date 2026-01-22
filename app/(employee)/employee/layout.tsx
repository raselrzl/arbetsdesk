// app/(employee)/layout.tsx
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
  const employeeId = cookieStore.get("employee_session")?.value;

  if (!employeeId) redirect("/");

  // Step 1: Get employee by ID (personalNumber for cross-company lookup)
  const employeeRow = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { personalNumber: true, name: true, email: true },
  });

  if (!employeeRow) redirect("/login");

  const { personalNumber, name, email } = employeeRow;

  // Step 2: Find all companies for this personalNumber
  const employeeRecords = await prisma.employee.findMany({
    where: { personalNumber },
    select: {
      company: { select: { id: true, name: true } },
    },
  });

  // Step 3: Map to objects {id, name}
  const companies = employeeRecords.map((e) => ({
    id: e.company.id,
    name: e.company.name,
  }));

  // Step 4: Pass employee info with all companies to navbar
  return (
    <div className="min-h-screen">
      <EmployeeNavbar
        employee={{ id: employeeId, name, email, companies }}
      />
      <div className="px-2 pt-4 sm:pt-10">{children}</div>
    </div>
  );
}
