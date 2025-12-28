// app/(company)/company/page.tsx
import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CompanyPageClient from "./companycomponents/CompanyPageClient";
import WorkComparisonCard from "./companycomponents/HourComparison";
import { ChartNoAxesCombined } from "lucide-react";

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
      <div className="col-span-2 p-2">
        <div className="col-span-2 mb-10">
          <CompanyPageClient companyData={company} />
        </div>
        <div className="flex flex-row text-xl font-semibold mb-4 items-center place-items-center">
          <ChartNoAxesCombined className="h-8 w-8" />{" "}
          <h2>Current Week vs Last Week</h2>
        </div>
        <WorkComparisonCard />{" "}
      </div>
    </div>
  );
}
