"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardClock,
  TimerOff,
  User2,
  UsersIcon,
  UserSquare,
} from "lucide-react";

import { loginEmployeeWithPin, logoutEmployeeWithPin } from "../companyactions";
import Link from "next/link";

// ---------------- HELPERS ----------------

function safeTime(value?: string | Date | null, mounted?: boolean) {
  if (!mounted || !value) return "--:--";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// ---------------- COMPONENT ----------------

export default function CompanyPageClient({ companyData }: any) {
  const router = useRouter();
  const company = companyData;

  const [mounted, setMounted] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "logout">("login");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [personalNumber, setPersonalNumber] = useState("");

  const todayTime = startOfToday();

  useEffect(() => setMounted(true), []);

  // ---------- OPEN MODAL ----------
  const openAuth = (emp: any, mode: "login" | "logout") => {
    setSelectedEmployee(emp);
    setAuthMode(mode);
    setPersonalNumber("");
    setShowAuthModal(true);
  };

  // ---------- SUBMIT ----------
  const submitAuth = async () => {
    if (!selectedEmployee) return;

    try {
      if (authMode === "login") {
        await loginEmployeeWithPin(selectedEmployee.id, personalNumber);
      } else {
        await logoutEmployeeWithPin(selectedEmployee.id, personalNumber);
      }

      router.refresh();
      setShowAuthModal(false);
      setPersonalNumber("");
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-2 py-10 mt-12">
        <div className="overflow-x-auto">
          <div className="bg-teal-100 flex justify-between items-center">
            <h1 className="px-4 py-2 uppercase text-xl md:text-2xl flex items-center bg-teal-100 text-teal-800 font-bold">
            <UsersIcon className="mr-2" />
            today’s team
          </h1>
          <Link href="/company/schedule" className="border mx-2 px-2 py-1 text-xs md:text-sm hover:bg-teal-200">Check Schedule →</Link>
          </div>

          <table className="min-w-full border-collapse text-left">
            {/* <thead className="bg-teal-100 text-teal-800">
              <tr>
                <th className="px-4 py-2 uppercase text-2xl flex items-center"><UsersIcon className="mr-2"/>today’s team</th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead> */}

            <tbody>
              {company.employees.map((emp: any, idx: number) => {
                const todayLogs =
                  emp.timeLogs?.filter((log: any) => {
                    if (!log.logDate) return false;
                    return (
                      new Date(log.logDate).setHours(0, 0, 0, 0) === todayTime
                    );
                  }) || [];

                const isLoggedIn =
                  todayLogs.length > 0 &&
                  !todayLogs[todayLogs.length - 1]?.logoutTime;

                const todaysSchedule = emp.schedules?.length
                  ? emp.schedules.map((s: any, i: number) => (
                      <div key={i} className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-teal-800" />
                        <span>
                          {new Date(s.startTime).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(s.endTime).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  : "—";

                const rowBg = idx % 2 === 0 ? "bg-white" : "bg-teal-50";

                return (
                  <tr
                    key={emp.id}
                    className={`${rowBg} border border-teal-100`}
                  >
                    <td className="px-4 py-2 font-medium text-teal-900">
                      {emp.name}
                    </td>

                    <td className="px-4 py-2 text-teal-800">
                      <div className="flex flex-col gap-1 text-sm">
                        {todaysSchedule}

                        <div className="mt-2 text-xs flex flex-col gap-1">
                          {todayLogs.length === 0 && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <ClipboardClock className="w-4 h-4" />
                              --:--
                            </div>
                          )}

                          {todayLogs.map((log: any, i: number) => (
                            <div key={i} className="flex gap-3">
                              {log.loginTime && (
                                <div className="flex items-center gap-1 text-green-700">
                                  <ClipboardClock className="w-4 h-4" />
                                  {safeTime(log.loginTime, mounted)}
                                </div>
                              )}
                              {log.logoutTime && (
                                <div className="flex items-center gap-1 text-amber-700">
                                  <TimerOff className="w-4 h-4" />
                                  {safeTime(log.logoutTime, mounted)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      {isLoggedIn ? (
                        <button
                          onClick={() => openAuth(emp, "logout")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Logout
                        </button>
                      ) : (
                        <button
                          onClick={() => openAuth(emp, "login")}
                          className="px-3 py-1 text-teal-700/60 hover:underline text-xs md:text-sm"
                        >
                          Not logged in
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- AUTH MODAL ---------- */}
      {showAuthModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-24">
          <div className="bg-white w-full max-w-xs p-4 shadow-xl relative h-[450px]">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>

            <h3
              className={`text-lg font-bold mb-3 text-center ${
                authMode === "login" ? "text-teal-600" : "text-red-600"
              }`}
            >
              {authMode === "login" ? "Login" : "Logout"} –{" "}
              {selectedEmployee.name}
            </h3>

            <input
              className="w-full mb-3 border px-2 py-1 h-12 text-center font-mono tracking-widest"
              placeholder="YYYYMMDDXXXX"
              value={personalNumber}
              readOnly
            />

            <div className="grid grid-cols-3 gap-2 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    personalNumber.length < 12 &&
                    setPersonalNumber(personalNumber + n)
                  }
                  className="p-4 bg-gray-100 font-semibold"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPersonalNumber("")}
                className="p-4 bg-red-400 text-white"
              >
                C
              </button>
              <button
                onClick={() =>
                  personalNumber.length < 12 &&
                  setPersonalNumber(personalNumber + "0")
                }
                className="p-4 bg-gray-100"
              >
                0
              </button>
              <button
                onClick={() => setPersonalNumber(personalNumber.slice(0, -1))}
                className="p-4 bg-yellow-400"
              >
                x
              </button>
            </div>

            <button
              onClick={submitAuth}
              className={`mt-3 w-full py-3 text-white font-bold ${
                authMode === "login"
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {authMode === "login" ? "Login" : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
