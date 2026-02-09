"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import CompanyTimePage from "./CompanyTimePageClient";

export default async function Page() {
  const cookieStore =await cookies();
  const companyId = cookieStore.get("company_session")?.value;

  let company = null;

  if (companyId) {
    company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        email: true,
        organizationNo: true,
      },
    });
  }

  return <CompanyTimePage company={company} />;
}
