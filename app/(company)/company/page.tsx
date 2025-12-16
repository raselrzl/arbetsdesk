// app/(company)/company/page.tsx
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CompanyPageClient from "./companycomponents/CompanyPageClient";

export default async function CompanyPageServer() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: { select: { name: true, email: true } },
      employees: { include: { timeLogs: { orderBy: { createdAt: "desc" }, take: 1 } } },
    },
  });

  if (!company) redirect("/login");

  return <CompanyPageClient companyData={company} />;
}
