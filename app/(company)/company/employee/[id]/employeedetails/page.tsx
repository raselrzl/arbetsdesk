import { User } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";

interface EmployeeDetailsPageProps {
  params: Promise<{ id: string }>; // ✅ mark as Promise
}

async function getEmployeeById(employeeId: string) {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized");

  return prisma.employee.findFirst({
    where: { id: employeeId, companyId },
    include: { company: true, schedules: true },
  });
}

export default async function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
  // ✅ unwrap the promise
  const { id } = await params;

  if (!id) return <div className="p-6 mt-20">Invalid employee ID</div>;

  let employee;
  try {
    employee = await getEmployeeById(id);
  } catch (err) {
    console.error(err);
    return <div className="p-6 mt-20">Unauthorized or error fetching employee.</div>;
  }

  if (!employee) return <div className="p-6 mt-20">Employee not found.</div>;

  return (
    <div className="p-6 mt-20 max-w-3xl mx-auto space-y-6">
      <Link href="/company/employee" className="text-teal-600 hover:underline">
        &larr; Back to Employee List
      </Link>

      <div className="bg-white border border-teal-100 rounded-xs shadow shadow-teal-100 p-6 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" /> {employee.name}
        </h1>

        <div className="space-y-2">
          <p><span className="font-semibold">Email:</span> {employee.email ?? "-"}</p>
          <p><span className="font-semibold">Phone:</span> {employee.phone ?? "-"}</p>
          <p><span className="font-semibold">Contract Type:</span> {employee.contractType ?? "-"}</p>
          <p><span className="font-semibold">Hourly Rate:</span> {employee.hourlyRate ?? "-"}</p>
          <p><span className="font-semibold">Monthly Salary:</span> {employee.monthlySalary ?? "-"}</p>
          <p><span className="font-semibold">Company:</span> {employee.company?.name ?? "-"}</p>
          <p>
            <span className="font-semibold">Schedules:</span>{" "}
            {employee.schedules.length > 0
              ? employee.schedules.map((s) => new Date(s.date).toLocaleDateString()).join(", ")
              : "No schedules"}
          </p>
        </div>

        <div className="pt-4 border-t border-teal-100 flex gap-4">
          <Link
            href={`/company/employee/${employee.id}/editemployee`}
            className="px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-xs hover:bg-teal-100 transition"
          >
            Edit Employee
          </Link>
        </div>
      </div>
    </div>
  );
}
