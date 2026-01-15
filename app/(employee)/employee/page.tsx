"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import {
  getEmployeeSchedule,
  getEmployeeMonthlyHours,
  getEmployeeProfile,
} from "./employeeactions";
import EmployeeWeeklyMessages from "./EmployeeMessages";
import SendMessageForm from "./SendMessageForm";
import Link from "next/link";

/* ---------------- TYPES ---------------- */

type Session = {
  id: string;
  date: string;
  time: string;
  topic: string;
  status: string;
};

type DayLog = {
  date: string;
  start: string;
  end: string;
  minutes: number;
};

export default function EmployeeDashboard() {
  const [showHoursModal, setShowHoursModal] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [dailyLogs, setDailyLogs] = useState<DayLog[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingHours, setLoadingHours] = useState(true);

  const [companyId, setCompanyId] = useState<string>(""); // ✅ NEW: store companyId

  /* ---------------- FETCH SCHEDULE ---------------- */
  useEffect(() => {
    getEmployeeSchedule()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoadingSessions(false));
  }, []);

  /* ---------------- FETCH MONTHLY HOURS ---------------- */
  useEffect(() => {
    getEmployeeMonthlyHours()
      .then((res) => {
        setDailyLogs(res.daily);
        setTotalMinutes(res.totalMinutes);
      })
      .catch(console.error)
      .finally(() => setLoadingHours(false));
  }, []);

  /* ---------------- FETCH COMPANY ID ---------------- */
  useEffect(() => {
    getEmployeeProfile()
      .then((emp) => setCompanyId(emp.company?.id || ""))
      .catch(console.error);
  }, []);

  /* ---------------- HELPERS ---------------- */
  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  /* ---------------- UI ---------------- */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-20 max-w-7xl mx-auto mb-20">
      {/* LEFT COLUMN */}
      <div className="">
        <div className="md:col-span-2 bg-white p-4 shadow-lg border border-teal-600 shadow-teal-600 rounded flex flex-col gap-y-6">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/icons/bellicon3.gif"
              alt="Notification"
              className="h-10 w-10 border-2 rounded-full border-amber-300 bg-white"
            />
            <span className="text-lg font-medium text-teal-950">
              Notification
            </span>
          </div>
          <EmployeeWeeklyMessages />
          {/* ✅ Pass companyId only when available */}
          <div className="flex items-center justify-center mt-20">
            {companyId && <SendMessageForm companyId={companyId} />}
          </div>
        </div>

        {/* Uncomment these if needed */}
        {/* {loadingSessions && (
          <p className="text-sm text-gray-400">Loading schedule...</p>
        )}

        {!loadingSessions && sessions.length === 0 && (
          <p className="text-sm text-gray-400">No upcoming sessions.</p>
        )}

        <ul className="space-y-3">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="grid grid-cols-2 p-3 rounded-md hover:bg-teal-50 shadow"
            >
              <div>
                <p className="text-sm text-gray-500">{session.date}</p>
                <p className="font-medium">{session.topic}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-teal-600 font-semibold">
                  {session.status}
                </p>
                <p className="text-sm text-gray-500">{session.time}</p>
              </div>
            </li>
          ))}
        </ul> */}
      </div>

      {/* RIGHT COLUMN */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex justify-end sm:justify-start">
          <Link
            href="/employee/schedule"
            className="text-teal-100 bg-teal-900 hover:bg-teal-700 px-4 py-2 text-[12px] font-semibold uppercase rounded-xs border border-teal-200 transition flex items-center gap-2 w-40 h-8 mt-4"
          >
            Show Schedule <span>➠</span>
          </Link>
        </div>

        <button
          onClick={() => setShowHoursModal(true)}
          className="relative h-16 grid grid-cols-2 items-center bg-teal-300 rounded-md hover:bg-teal-200 shadow px-2"
        >
          <span className="text-xs font-medium text-gray-700">
            Hours Worked This Month
          </span>

          <span className="flex justify-end gap-1 text-teal-800 font-semibold">
            {loadingHours ? "…" : formatMinutes(totalMinutes)}
          </span>

          {/* Chevron pinned to top-right */}
          <Info className="absolute top-2 right-2 w-4 h-4 text-teal-700" />
        </button>
      </div>

      {/* HOURS MODAL */}
      {showHoursModal && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 border border-teal-100">
          <div className="bg-white p-6 rounded-md w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="bg-teal-800 p-4 rounded-md mb-4">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Hours Worked
              </h2>

              <p className="text-teal-100">
                Total so far: {formatMinutes(totalMinutes)}
              </p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="border-b border-teal-100 bg-teal-400 px-2">
                <tr >
                  <th className="py-2 pl-2">Date</th>
                  <th className="py-2">Start – End</th>
                  <th className="py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogs.map((log, idx) => (
                  <tr key={idx} className="border-b border-teal-100 hover:bg-teal-50">
                    <td className="py-2">{formatDate(log.date)}</td>
                    <td className="py-2">
                      {formatTime(log.start)} – {formatTime(log.end)}
                    </td>
                    <td className="py-2">{formatMinutes(log.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setShowHoursModal(false)}
              className="mt-4 ml-auto block bg-teal-800 text-white px-4 py-1 rounded-md hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
