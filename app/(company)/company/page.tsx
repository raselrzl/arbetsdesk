// app/(company)/company/page.tsx
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CompanyPageClient from "./companycomponents/CompanyPageClient";
import WorkComparisonCard from "./companycomponents/HourComparison";
import CostComparisonCard from "./companycomponents/CostComparisonCard";
import WeeklySalesComparisonCard from "./companycomponents/WeeklySalesComparisonCard";
import CompanyNotifications from "./companycomponents/CompanyNotifications";

export default async function CompanyPageServer() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) redirect("/");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: { select: { name: true, email: true } },
      employees: {
        include: {
          timeLogs: { orderBy: { createdAt: "desc" }, take: 1 },
          schedules: {
            where: {
              date: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          },
        },
      },
    },
  });

  if (!company) redirect("/login");

  

  return (
    <div className="max-w-7xl mx-auto px-2 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right column (2/3) – appears FIRST on mobile */}
        <div className="order-1 lg:order-2 lg:col-span-2 space-y-10">
          <div>
            <CompanyPageClient companyData={company} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 gap-y-6">
            <WorkComparisonCard />
            <CostComparisonCard />
            <WeeklySalesComparisonCard />
          </div>
        </div>

        {/* Left column (1/3) – appears LAST on mobile, FIRST on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-1 my-18">
          <CompanyNotifications />
        </div>
      </div>
    </div>
  );
}
