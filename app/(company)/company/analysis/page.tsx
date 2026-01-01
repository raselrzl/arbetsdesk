import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyAnalysisClient from "./CompanyAnalysisClient";
import Link from "next/link";

export default async function CompanyAnalysisPage() {
  const jar = await cookies();
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

  return (
    <>
      {/* Company Analysis Section */}
      <CompanyAnalysisClient companyId={companyId} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 mb-50">
        {/* Explanatory text */}
        <div className="bg-white p-4 md:p-6 rounded shadow border space-y-2">
          <p className="text-gray-700 text-lg md:text-xl">
            Monitor your company’s spending and see how your costs are
            distributed.
          </p>
          <p className="text-gray-500 text-sm md:text-base">
            Based on your monthly expenses, you can optimize the cost and reduce
            unnecessary spending.
          </p>

          {/* Responsive button link */}
          <Link
            href="/company/additionalcost"
            className="inline-block mt-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto text-center"
          >
            Go to Cost Optimizer
          </Link>
        </div>
      </div>
    </>
  );
}
