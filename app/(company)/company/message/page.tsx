"use server";
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import CompanyMessageForm from "./CompanyMessageForm";
import CompanyMessagesList from "./CompanyMessagesList";
import AllMessages from "./AllMessages";

export default async function CompanyMessagePage() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-teal-900 uppercase">Send private message/ Notification </h1>
      <p className="mb-10">Note: For Notification Select All employee</p>
      <CompanyMessageForm employees={employees} />
      {/* <CompanyMessagesList /> */}
      <AllMessages />
    </div>
  );
}
