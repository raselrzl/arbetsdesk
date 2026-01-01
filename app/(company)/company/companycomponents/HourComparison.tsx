// WeekComparisonCard.tsx (SERVER COMPONENT)

import { prisma } from "@/app/utils/db";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cookies } from "next/headers";

// ---------------- HELPERS ----------------

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSunday(monday: Date) {
  const d = new Date(monday);
  d.setDate(monday.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/*
//this is count anyone even if they are not logged out
async function getWorkedMinutesBetween(
  companyId: string,
  start: Date,
  end: Date
) {
  const now = new Date();

  const logs = await prisma.timeLog.findMany({
    where: {
      companyId,
      loginTime: { lt: end }, 
      OR: [
        { logoutTime: { gte: start } },
        { logoutTime: null },
      ],
    },
    select: {
      loginTime: true,
      logoutTime: true,
    },
  });

  let totalMinutes = 0;

  for (const log of logs) {
    if (!log.loginTime) continue;

    const realStart =
      log.loginTime > start ? log.loginTime : start;

    const realEnd =
      log.logoutTime && log.logoutTime < end
        ? log.logoutTime
        : log.logoutTime
        ? log.logoutTime
        : now < end
        ? now
        : end;

    if (realEnd > realStart) {
      totalMinutes += Math.floor(
        (realEnd.getTime() - realStart.getTime()) / 60000
      );
    }
  }

  return totalMinutes;
} */
async function getWorkedMinutesBetween(
  companyId: string,
  start: Date,
  end: Date
) {
  // 🔹 Only fetch logs that have both login and logout
  const logs = await prisma.timeLog.findMany({
    where: {
      companyId,
      loginTime: { lt: end },        // started before range ends
      logoutTime: { not: null, lte: end }, // must have logout
    },
    select: {
      loginTime: true,
      logoutTime: true,
    },
  });

  let totalMinutes = 0;

  for (const log of logs) {
    if (!log.loginTime || !log.logoutTime) continue;

    // Clip log times to the range
    const realStart = log.loginTime > start ? log.loginTime : start;
    const realEnd = log.logoutTime < end ? log.logoutTime : end;

    if (realEnd > realStart) {
      totalMinutes += Math.floor(
        (realEnd.getTime() - realStart.getTime()) / 60000
      );
    }
  }

  return totalMinutes;
}

// ---------------- COMPONENT ----------------

export default async function WeekComparisonCard() {
  const jar =await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const today = new Date();

  // This week
  const thisWeekStart = getMonday(today);
  const thisWeekEnd = getSunday(thisWeekStart);

  // Last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = getSunday(lastWeekStart);

  const thisWeekMinutes = await getWorkedMinutesBetween(
    companyId,
    thisWeekStart,
    thisWeekEnd
  );

  const lastWeekMinutes = await getWorkedMinutesBetween(
    companyId,
    lastWeekStart,
    lastWeekEnd
  );

  const diff = thisWeekMinutes - lastWeekMinutes;

  const comparison =
    diff > 0 ? "more" : diff < 0 ? "less" : "equal";

  const Icon =
    comparison === "more"
      ? ArrowUp
      : comparison === "less"
      ? ArrowDown
      : Clock;

  const color =
    comparison === "more"
      ? "text-red-600"
      : comparison === "less"
      ? "text-green-600"
      : "text-gray-500";

  return (
    <div className="bg-white p-4 mx-2 py-3 rounded-xs shadow border border-teal-100 max-w-md">
      <div className="flex items-center gap-4">
        <div className="bg-teal-50 p-4 rounded-full">
          <Clock className="w-10 h-10 text-teal-900" />
        </div>

        <div>
          <p className="text-sm text-gray-400 font-semibold">
            Worked hours (this week)
          </p>
          <p className="text-2xl font-extrabold">
            {formatMinutes(thisWeekMinutes)}
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>Last week: {formatMinutes(lastWeekMinutes)}</p>
        <p>
          Difference:{" "}
          {diff > 0 ? "+" : diff < 0 ? "-" : ""}
          {formatMinutes(Math.abs(diff))}
        </p>
      </div>

      <div className={`mt-4 flex items-center text-lg font-bold ${color}`}>
        <Icon className="w-5 h-5 mr-2" />
        {comparison === "equal"
          ? "Same as last week"
          : `This week is ${comparison}`}
      </div>
    </div>
  );
}
