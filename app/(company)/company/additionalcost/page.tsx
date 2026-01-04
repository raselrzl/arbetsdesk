"use server"
import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import CompanyCostsClient from "./CompanyCostsClient";
export default async function CompanyCostsPage() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  // Fetch initial data server-side
  const [costTypes, months] = await Promise.all([
    prisma.costType.findMany({
      where: { companyId },
      orderBy: { name: "asc" },
    }),
    prisma.cost.findMany({
      where: { companyId },
      select: { date: true },
    }).then((dates) => {
      const set = new Set(dates.map((d) => d.date.toISOString().slice(0, 7)));
      return Array.from(set).sort().reverse();
    }),
  ]);

  return (
    <CompanyCostsClient
      companyId={companyId}
      initialCostTypes={costTypes}
      initialMonths={months}
    />
  );
}
