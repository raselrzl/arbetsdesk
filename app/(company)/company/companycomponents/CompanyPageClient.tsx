"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardClock,
  ClockAlert,
  ClockCheck,
  UsersIcon,
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

// Start of day is 5:00 AM
function startOfToday() {
  const d = new Date();
  d.setHours(5, 0, 0, 0);
  return d.getTime();
}

// End of day is 5:00 AM next day
function endOfToday() {
  return startOfToday() + 24 * 60 * 60 * 1000;
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

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

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
          <div className="flex items-end justify-end">
            <Link
              href="/company/schedule"
              className="border px-2 py-1 text-xs md:text-sm bg-teal-200 hover:bg-teal-100"
            >
              Check Schedule →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
            {company.employees.map((emp: any) => {
              const todayLogs =
                emp.timeLogs?.filter((log: any) => {
                  if (!log.loginTime) return false;
                  const login = new Date(log.loginTime).getTime();
                  const logout = log.logoutTime
                    ? new Date(log.logoutTime).getTime()
                    : null;

                  // Include logs that are relevant to today (5 AM to next 5 AM)
                  return (
                    (login >= todayStart && login < todayEnd) ||
                    (login < todayStart && (!logout || logout >= todayStart))
                  );
                }) || [];

              const lastLog = todayLogs[todayLogs.length - 1];
              const isLoggedIn = lastLog ? !lastLog.logoutTime : false;

              const todaysSchedule = emp.schedules?.length
                ? emp.schedules.map((s: any, i: number) => (
                    <div key={i} className="flex items-center text-xs">
                      <CalendarDays className="w-3 h-3 text-teal-800" />
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

              return (
                <div
                  key={emp.id}
                  role="button"
                  tabIndex={0}
                  className={`cursor-pointer flex p-2 relative rounded-xs ${
                    isLoggedIn
                      ? "bg-teal-300"
                      : "bg-gray-200 border border-gray-300"
                  }`}
                >
                  {/* LEFT SIDE */}
                  <div className="flex flex-col gap-1">
                    {/* NAME + IMAGE */}
                    <div className="flex items-center gap-2">
                      <img
                        src="/avater.png"
                        className="w-10 h-10 rounded-full"
                      />
                      <div
                        className={`font-bold uppercase text-lg text-gray-500 ${
                          isLoggedIn ? "text-teal-900" : "text-gray-200"
                        }`}
                      >
                        {emp.name}
                      </div>
                    </div>

                    {/* SCHEDULE + LOGS */}
                    <div>
                      <div className="flex flex-col text-sm">
                        {todaysSchedule}

                        {todayLogs.length === 0 && (
                          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                            <ClipboardClock className="w-3 h-3" />
                            00:00
                          </div>
                        )}

                        {todayLogs.map((log: any, i: number) => (
                          <div key={i} className="flex gap-2 text-xs mt-1">
                            {log.loginTime && (
                              <div className="flex items-center text-xs">
                                <ClipboardClock className="w-3 h-3" />
                                {safeTime(log.loginTime, mounted)}
                              </div>
                            )}
                            {log.logoutTime && (
                              <div className="flex items-center gap-1">
                                - {safeTime(log.logoutTime, mounted)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LOGIN / LOGOUT — BOTTOM RIGHT */}
                  <div className="absolute bottom-2 right-2 text-white">
                    {isLoggedIn ? (
                      <button
                        onClick={() => openAuth(emp, "logout")}
                        className="cursor-pointer text-green-700"
                      >
                        <ClockCheck className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => openAuth(emp, "login")}
                        className="cursor-pointer text-black"
                      >
                        <ClockAlert className="h-4 w-4"/>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
