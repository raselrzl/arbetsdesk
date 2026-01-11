"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";

export default function CompanyNotificationsClient({
  employeeMessages,
  companyMessages,
  weekOffset,
}: {
  employeeMessages: any[];
  companyMessages: any[];
  weekOffset: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setWeek = (week: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", String(week));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 mb-30 px-6">
      {/* Navigation */}
      <div className="flex gap-2">
        <button onClick={() => setWeek(weekOffset - 1)}>
          ← Previous
        </button>
        <button onClick={() => setWeek(0)}>
          Current
        </button>
        <button onClick={() => setWeek(weekOffset + 1)}>
          Next →
        </button>
      </div>

      {/* Employee messages */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Messages Sent by Employees
        </h2>
        <EmployeeMessagesList messages={employeeMessages} />
      </div>

      {/* Company messages */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Messages Sent by Company
        </h2>
        <CompanyMessagesList messages={companyMessages} />
      </div>
    </div>
  );
}
