// app/sales/page.tsx
"use server";

import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import SalesClient from "./SalesClient";

export default async function SalesPage() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  // Fetch months and years available for this company
  const [months, salesDates] = await Promise.all([
    prisma.sale.findMany({
      where: { companyId },
      select: { date: true },
    }).then((dates) => {
      const set = new Set(dates.map((d) => d.date.toISOString().slice(0, 7)));
      return Array.from(set).sort().reverse();
    }),

    prisma.sale.findMany({
      where: { companyId },
      select: { date: true },
    }),
  ]);

  const yearsSet = new Set(salesDates.map((d) => d.date.getFullYear()));
  const years = Array.from(yearsSet).sort((a, b) => b - a);

  return (
    <SalesClient
      companyId={companyId}
      initialMonths={months}
      initialYears={years}
    />
  );
}
