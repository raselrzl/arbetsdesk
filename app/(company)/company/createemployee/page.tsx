import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
import CreateEmployeeForm from "./CreateEmployeeForm";

export default async function CreateEmployeePage() {
  const cookieStore = await cookies();
  const companyId = cookieStore.get("company_session")?.value;

  if (!companyId) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!company) redirect("/login");

  // ✅ Pass server data to client form
  return <CreateEmployeeForm company={company} />;
}
