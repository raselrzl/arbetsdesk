import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyNavbarClient from "./CompanyNavbarClient";

export default async function CompanyNavbar() {
  const cookieStore = await cookies();
  const companySession = cookieStore.get("company_session")?.value;

  let company: { name: string } | null = null;

  if (companySession) {
    const dbCompany = await prisma.user.findUnique({
      where: { id: companySession },
      select: { name: true },
    });
    if (dbCompany) company = dbCompany;
  }

  return <CompanyNavbarClient company={company} />;
}
