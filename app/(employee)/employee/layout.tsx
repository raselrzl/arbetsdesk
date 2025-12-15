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

  if (!employeeId) redirect("/login");

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      name: true,
      email: true,
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!employee) redirect("/login");

  return (
    <div className="bg-teal-50 min-h-screen">
      {/* ✅ Pass employee info */}
      <EmployeeNavbar employee={employee} />
      {children}
    </div>
  );
}
