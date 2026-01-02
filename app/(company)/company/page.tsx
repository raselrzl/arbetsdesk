// app/(company)/company/page.tsx
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CompanyPageClient from "./companycomponents/CompanyPageClient";
import WorkComparisonCard from "./companycomponents/HourComparison";
import { ChartNoAxesCombined } from "lucide-react";
import CostComparisonCard from "./companycomponents/CostComparisonCard";
import WeeklySalesComparisonCard from "./companycomponents/WeeklySalesComparisonCard";

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
    <div className="grid grid-cols-2 max-w-7xl mx-auto">
      <div className="col-span-2 p-2 mb-20">
        <div className="col-span-2 mb-10">
          <CompanyPageClient companyData={company} />
        </div>
        <div className="flex flex-row mb-4 items-center justify-center text-2xl font-bold uppercase text-teal-900 border-t border-teal-100 pt-4">
          <ChartNoAxesCombined className="h-8 w-8" />{" "}
          <h2>Current Week vs Last Week</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 gap-y-6">
          <WorkComparisonCard /> <CostComparisonCard /> <WeeklySalesComparisonCard />
        </div>
      </div>
    </div>
  );
}
