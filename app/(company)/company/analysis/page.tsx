import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyAnalysisClient from "./CompanyAnalysisClient";
import Link from "next/link";

export default async function CompanyAnalysisPage() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  return (
    <>
      {/* Company Analysis Section */}
      <CompanyAnalysisClient companyId={companyId} />

      {/* Cards Wrapper */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
        {/* Cost Card */}
        <div className="bg-white p-4 md:p-6 rounded-xs shadow border border-teal-300 space-y-2 flex flex-col justify-between">
          <div>
            <p className="text-teal-700 text-lg md:text-xl font-semibold">
              Monitor your company’s spending and see how your costs are distributed.
            </p>
            <p className="text-teal-500 text-sm md:text-base mt-1">
              Based on your monthly expenses, you can optimize the cost and reduce unnecessary spending.
            </p>
          </div>
          <Link
            href="/company/additionalcost"
              className="mt-4 bg-teal-200 text-teal-900 px-4 py-2 rounded-xs hover:bg-teal-100 transition w-full text-center"
          >
            Go to Cost  <span>➠</span>
          </Link>
        </div>

        {/* Sales Card */}
        <div className="bg-white p-4 md:p-6 rounded shadow border border-teal-300 space-y-2 flex flex-col justify-between">
          <div>
            <p className="text-teal-700 text-lg md:text-xl font-semibold">
              Monitor your company’s daily sales and see how your revenue is distributed between cash and card payments.
            </p>
            <p className="text-teal-500 text-sm md:text-base mt-1">
              Based on your daily sales, you can optimize your cash flow and better understand your payment methods.
            </p>
          </div>
          <Link
            href="/company/sales"
            className="mt-4 bg-teal-200 text-teal-900 px-4 py-2 rounded-xs hover:bg-teal-100 transition w-full text-center"
          >
            Go to Sales <span>➠</span>
          </Link>
        </div>
      </div>
    </>
  );
}
