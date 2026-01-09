"use server";

import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import SalesClient from "./SalesClient";

export default async function SalesPage() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  // Fetch all sales dates
  const salesDates = await prisma.sale.findMany({
    where: { companyId },
    select: { date: true },
  });

  // Available months (YYYY-MM)
  const monthsSet = new Set(
    salesDates.map((d) => d.date.toISOString().slice(0, 7))
  );
  const initialMonths = Array.from(monthsSet).sort().reverse();

  // Available years
  const yearsSet = new Set(salesDates.map((d) => d.date.getFullYear()));
  const initialYears = Array.from(yearsSet).sort((a, b) => b - a); // newest first

  return (
    <SalesClient
      companyId={companyId}
      initialMonths={initialMonths}
      initialYears={initialYears}
    />
  );
}
