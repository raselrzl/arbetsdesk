import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyNavbarClient from "./CompanyNavbarClient";

type CompanySession = {
  name: string;
  email: string;
  organizationNo: string;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  adminName: string;
  employeesCount: number;
};

export default async function CompanyNavbar() {
  const cookieStore = await cookies();
  const companyId = cookieStore.get("company_session")?.value;

  if (!companyId) {
    return <CompanyNavbarClient company={null} />;
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      name: true,
      email: true,
      organizationNo: true,
      paymentStatus: true,
      user: { select: { name: true } },
      employees: { select: { id: true } },
    },
  });

  if (!company) {
    return <CompanyNavbarClient company={null} />;
  }

  const companySession: CompanySession = {
    name: company.name,
    email: company.email,
    organizationNo: company.organizationNo,
    paymentStatus: company.paymentStatus,
    adminName: company.user.name,
    employeesCount: company.employees.length,
  };

  return <CompanyNavbarClient company={companySession} />;
}
