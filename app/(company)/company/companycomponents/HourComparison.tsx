// WeekComparisonCard.tsx
import { prisma } from "@/app/utils/db";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cookies } from "next/headers";

// ------------------- HELPERS -------------------

async function getTotalMinutesBetween(companyId: string, startDate: Date, endDate: Date) {
  const logs = await prisma.timeLog.findMany({
    where: { companyId, logDate: { gte: startDate, lte: endDate } },
    select: { totalMinutes: true },
  });
  return logs.reduce((sum, log) => sum + (log.totalMinutes || 0), 0);
}

function compareValues(val1: number, val2: number) {
  if (val1 > val2) return "more";
  if (val1 < val2) return "less";
  return "equal";
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// ------------------- MAIN COMPONENT -------------------

export default async function WeekComparisonCard() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Current week
  const startOfThisWeek = getMonday(today);
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);

  // Last week
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);

  const thisWeekMinutes = await getTotalMinutesBetween(companyId, startOfThisWeek, endOfThisWeek);
  const lastWeekMinutes = await getTotalMinutesBetween(companyId, startOfLastWeek, endOfLastWeek);

  const comparison = compareValues(thisWeekMinutes, lastWeekMinutes);

  const comparisonColor =
    comparison === "more" ? "text-red-600" : comparison === "less" ? "text-green-600" : "text-gray-500";

  const ComparisonIcon = comparison === "more" ? ArrowUp : comparison === "less" ? ArrowDown : Clock;

  // Calculate total difference in hours
  const diffHours = ((thisWeekMinutes - lastWeekMinutes) / 60).toFixed(2);
  const diffSign = diffHours > "0" ? "+" : diffHours < "0" ? "-" : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border shadow-teal-100 border-teal-200 w-full max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-teal-50 p-4 rounded-full flex items-center justify-center mr-4">
            <Clock className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Worked Hours {(thisWeekMinutes / 60).toFixed(2)} h</h2>
        </div>

        <div className="flex flex-col text-gray-600 dark:text-gray-300 mb-4">
          <div>
            <p className="text-xs">Last Week: {(lastWeekMinutes / 60).toFixed(2)} h</p>
          </div>
          <div>
            <p className="text-xs">Difference:
            {diffSign}
            {Math.abs(Number(diffHours))} h</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center text-xl font-bold ${comparisonColor}`}>
            <ComparisonIcon className="w-6 h-6 mr-2" />
            {comparison === "equal" ? "Equal to last week" : `This week is ${comparison}`}
          </div>
        </div>
      </div>
    </div>
  );
}
