"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";

function getWeekLabel(offset: number) {
  if (offset === 0) return "This week";
  if (offset === -1) return "Last week";
  if (offset === 1) return "Next week";
  return offset > 0 ? `${offset} weeks ahead` : `${Math.abs(offset)} weeks ago`;
}

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
  const [isPending, startTransition] = useTransition();

  const setWeek = (week: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", String(week));

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-8 px-2 my-12 py-4 bg-teal-100">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Notice</h1>
        </div>
        <p className="text-sm text-gray-500">{getWeekLabel(weekOffset)}</p>
        {/* Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setWeek(weekOffset - 1)}
            disabled={isPending}
            className="h-8 px-4 text-sm flex items-center justify-center rounded-xs border border-teal-200 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ← Prev
          </button>

          <button
            onClick={() => setWeek(0)}
            disabled={isPending || weekOffset === 0}
            className="h-8 px-4 text-sm flex items-center justify-center rounded-xs border border-teal-200 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            Curr
          </button>

          <button
            onClick={() => setWeek(weekOffset + 1)}
            disabled={isPending || weekOffset >= 0}
            className="h-8 px-4 text-sm flex items-center justify-center rounded-xs border border-teal-200 bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
          Loading messages…
        </div>
      )}

      {/* Employee messages */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">From Employees</h2>

        {isPending ? (
          <SkeletonList />
        ) : (
          <EmployeeMessagesList messages={employeeMessages} />
        )}
      </section>

      {/* Company messages */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">From Company</h2>

        {isPending ? (
          <SkeletonList />
        ) : (
          <CompanyMessagesList messages={companyMessages} />
        )}
      </section>
    </div>
  );
}

/* ---------------- Skeleton UI ---------------- */

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 rounded-md bg-gray-100 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
