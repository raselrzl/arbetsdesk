import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyAnalysisClient from "./CompanyAnalysisClient";

export default async function CompanyAnalysisPage() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) {
    // Redirect to login if no session
    throw new Error("Unauthorized: No company session");
  }

  // Optional: fetch company name or verify it exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) throw new Error("Company not found");

  return <CompanyAnalysisClient companyId={companyId} />;
}
