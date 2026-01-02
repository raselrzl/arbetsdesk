import { cookies } from "next/headers";
import CompanySalaryPageComponent from "./salarypagecomponent";
import { getAvailableSalaryMonths } from "./salaryActions";

export default async function SalaryPage() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  // ✅ Call without arguments
  const availableMonths = await getAvailableSalaryMonths();

  const defaultMonth = availableMonths[0] || new Date().toISOString().slice(0, 7);

  return (
    <CompanySalaryPageComponent
      availableMonths={availableMonths}
      defaultMonth={defaultMonth}
    />
  );
}

