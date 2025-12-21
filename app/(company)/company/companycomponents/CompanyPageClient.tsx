"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RealTimeClock from "./RealTimeClock";
import { loginEmployee, logoutEmployee } from "@/app/actions";
import { ClipboardClock, TimerOff } from "lucide-react";
import { loginEmployeeWithPin } from "../companyactions";

function safeTime(value?: string | Date | null, mounted?: boolean) {
  if (!mounted || !value) return "--:--";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;

  return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
}

function calculateWorkedTime(logs: any[]) {
  let totalMs = 0;
  const now = new Date();

  logs.forEach((log) => {
    if (!log.loginTime) return;
    const login = new Date(log.loginTime);
    const logout = log.logoutTime ? new Date(log.logoutTime) : now;
    if (!isNaN(login.getTime()) && !isNaN(logout.getTime())) {
      totalMs += logout.getTime() - login.getTime();
    }
  });

  return totalMs > 0 ? formatDuration(totalMs) : "—";
}

export default function CompanyPageClient({ companyData }: any) {
  const router = useRouter();
  const company = companyData;
  const [mounted, setMounted] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [personalNumber, setPersonalNumber] = useState("");

  const todayTime = startOfToday();

  useEffect(() => setMounted(true), []);

  const openLogin = (emp: any) => {
    setSelectedEmployee(emp);
    setShowLoginModal(true);
  };

  const submitLogin = async () => {
    if (!selectedEmployee) return;
    try {
      await loginEmployeeWithPin(selectedEmployee.id, personalNumber);
      router.refresh();
      setShowLoginModal(false);
      setPersonalNumber("");
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  const submitLogout = async (emp: any) => {
    try {
      await logoutEmployee(emp.id);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Logout failed");
    }
  };

  return (
    <div className="">
      <div className="min-h-screen max-w-7xl mx-auto px-2 py-10 mt-12 orve">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Today's Schedule</th>
                <th className="px-4 py-2 text-left">Time Logs</th>
                <th className="px-4 py-2 text-left">Worked Today</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {company.employees.map((emp: any, idx: number) => {
                const todayLogs =
                  emp.timeLogs?.filter((log: any) => {
                    if (!log.logDate) return false;
                    return (
                      new Date(log.logDate).setHours(0, 0, 0, 0) === todayTime
                    );
                  }) || [];

                const workedToday = calculateWorkedTime(todayLogs);

                const todaysSchedule = emp.schedules?.length
                  ? emp.schedules
                      .map(
                        (s: any) =>
                          `${new Date(s.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(s.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                      )
                      .join(", ")
                  : "—";

                const rowBg = idx % 2 === 0 ? "bg-teal-100" : "bg-teal-200";

                return (
                  <tr
                    key={emp.id}
                    className={`${rowBg} border-b border-teal-300`}
                  >
                    <td className="px-4 py-2 font-medium text-teal-900 whitespace-nowrap">
                      {emp.name}
                    </td>
                    <td className="px-4 py-2 text-teal-800 whitespace-nowrap">
                      {todaysSchedule}
                    </td>

                    <td className="px-4 py-2 text-sm flex flex-col gap-1">
                      {todayLogs.length === 0 && (
                        <span className="text-gray-500">—</span>
                      )}
                      {todayLogs.map((log: any, idx: number) => (
                        <div
                          key={idx}
                          suppressHydrationWarning
                          className="flex flex-col gap-1"
                        >
                          <div className="bg-green-600 text-white p-1 rounded flex justify-center items-center gap-1 text-xs">
                            <ClipboardClock className="h-4 w-4" />
                            {safeTime(log.loginTime, mounted)}
                          </div>
                          {log.logoutTime && (
                            <div className="bg-amber-300 text-black p-1 rounded flex justify-center items-center gap-1 text-xs">
                              <TimerOff className="h-4 w-4" />
                              {safeTime(log.logoutTime, mounted)}
                            </div>
                          )}
                        </div>
                      ))}
                    </td>

                    <td className="px-4 py-2 font-medium text-teal-900 whitespace-nowrap">
                      {workedToday}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {todayLogs.length === 0 ||
                      todayLogs[todayLogs.length - 1]?.logoutTime ? (
                        <button
                          onClick={() => openLogin(emp)}
                          className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                        >
                          Login
                        </button>
                      ) : (
                        <button
                          onClick={() => submitLogout(emp)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Logout
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

      {showLoginModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-30 p-2">
          <div className="bg-white w-full max-w-xs p-4 rounded-xs shadow-xl flex flex-col items-center relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-3 text-center text-teal-600">
              Welcome – {selectedEmployee.name}
            </h3>
            <input
              className="w-full mb-3 border border-teal-100 px-2 py-1 rounded-xs h-12 text-center text-base font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="YYYYMMDDXXXX"
              value={personalNumber}
              readOnly
            />
            <div className="grid grid-cols-3 gap-2 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (personalNumber.length < 12)
                      setPersonalNumber(personalNumber + num);
                  }}
                  className="p-4 w-full bg-gray-100 rounded-md text-md font-semibold hover:bg-gray-200 transition flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPersonalNumber("")}
                className="p-4 w-full bg-red-400 rounded-md text-lg font-semibold text-white hover:bg-red-500 transition flex items-center justify-center"
              >
                C
              </button>
              <button
                onClick={() => {
                  if (personalNumber.length < 12)
                    setPersonalNumber(personalNumber + "0");
                }}
                className="p-4 w-full bg-gray-100 rounded-md text-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={() => setPersonalNumber(personalNumber.slice(0, -1))}
                className="p-4 w-full bg-yellow-400 rounded-md text-lg font-semibold hover:bg-yellow-500 transition flex items-center justify-center"
              >
                x
              </button>
            </div>
            <button
              onClick={submitLogin}
              className="mt-3 bg-teal-600 py-3 rounded-sm text-white text-lg font-bold hover:bg-teal-700 transition w-full max-w-[250px] cursor-pointer"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
