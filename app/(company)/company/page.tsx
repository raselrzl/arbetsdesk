import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CompanyPage() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;

  // ❌ Not logged in as company
  if (!companyId) {
    redirect("/login");
  }

  // ✅ Fetch company
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // ❌ Cookie exists but company deleted / invalid
  if (!company) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-10 mt-14">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {company.name}
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Company Email:</strong> {company.email}</p>
          <p><strong>Organization No:</strong> {company.organizationNo}</p>
          <p><strong>Owner:</strong> {company.user.name}</p>
          <p><strong>Owner Email:</strong> {company.user.email}</p>
          <p><strong>Payment Status:</strong> {company.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
}
