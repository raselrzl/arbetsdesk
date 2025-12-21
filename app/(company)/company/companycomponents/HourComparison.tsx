// WeekComparisonCard.tsx
import { prisma } from "@/app/utils/db";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cookies } from "next/headers";

// ------------------- HELPERS -------------------

// ✅ NEW: format minutes into real hours + minutes (NO decimals)
function formatMinutesToHours(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} h`;
  return `${hrs} h ${mins} min`;
}

async function getTotalMinutesBetween(
  companyId: string,
  startDate: Date,
  endDate: Date
) {
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

  const thisWeekMinutes = await getTotalMinutesBetween(
    companyId,
    startOfThisWeek,
    endOfThisWeek
  );

  const lastWeekMinutes = await getTotalMinutesBetween(
    companyId,
    startOfLastWeek,
    endOfLastWeek
  );

  const comparison = compareValues(thisWeekMinutes, lastWeekMinutes);

  // ✅ FIXED COLORS (as you wanted)
  const comparisonColor =
    comparison === "more"
      ? "text-red-600"
      : comparison === "less"
      ? "text-green-600"
      : "text-gray-500";

  const ComparisonIcon =
    comparison === "more"
      ? ArrowUp
      : comparison === "less"
      ? ArrowDown
      : Clock;

  // ✅ FIXED: difference calculated in MINUTES, not decimals
  const diffMinutes = thisWeekMinutes - lastWeekMinutes;
  const diffLabel = formatMinutesToHours(Math.abs(diffMinutes));
  const diffSign = diffMinutes > 0 ? "+" : diffMinutes < 0 ? "-" : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border shadow-teal-100 border-teal-200 w-full max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-teal-50 p-4 rounded-full flex items-center justify-center mr-4">
            <Clock className="w-10 h-10 text-teal-900" />
          </div>

          {/* ✅ CHANGED: real hours + minutes */}
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
            <span className="text-gray-400 font-semibold text-lg">
              Worked Hours
            </span>
            <br />
            {formatMinutesToHours(thisWeekMinutes)}
          </h2>
        </div>

        <div className="flex flex-col text-gray-600 dark:text-gray-300 mb-4">
          {/* ✅ CHANGED: real hours + minutes */}
          <p className="text-xs">
            Last Week: {formatMinutesToHours(lastWeekMinutes)}
          </p>

          {/* ✅ CHANGED: real diff with + / - */}
          <p className="text-xs">
            Difference: {diffSign}
            {diffLabel}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center text-xl font-bold ${comparisonColor}`}>
            <ComparisonIcon className="w-6 h-6 mr-2" />
            {comparison === "equal"
              ? "Equal to last week"
              : `This week is ${comparison}`}
          </div>
        </div>
      </div>
    </div>
  );
}
