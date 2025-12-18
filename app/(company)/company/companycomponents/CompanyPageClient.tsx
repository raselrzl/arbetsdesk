"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RealTimeClock from "./RealTimeClock";
import { loginEmployee, logoutEmployee } from "@/app/actions";
import Link from "next/link";

/* ---------------- helpers ---------------- */

function safeTime(value?: string | Date | null, mounted?: boolean) {
  if (!mounted || !value) return "--:--";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-GB");
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

/* ---------------- component ---------------- */

export default function CompanyPageClient({ companyData }: any) {
  const router = useRouter();
  const [company, setCompany] = useState(companyData);
  const [mounted, setMounted] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [personalNumber, setPersonalNumber] = useState("");
  const [pinCode, setPinCode] = useState("");

  const todayTime = startOfToday();

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- login ---------------- */

  const openLogin = (emp: any) => {
    setSelectedEmployee(emp);
    setShowLoginModal(true);
  };

  const submitLogin = async () => {
    if (!selectedEmployee) return;

    try {
      const log = await loginEmployee(selectedEmployee.id);

      setCompany((prev: any) => {
        const updated = { ...prev };
        const idx = updated.employees.findIndex(
          (e: any) => e.id === selectedEmployee.id
        );

        if (idx !== -1) {
          updated.employees[idx] = {
            ...updated.employees[idx],
            timeLogs: [...(updated.employees[idx].timeLogs || []), log],
          };
        }

        return updated;
      });

      setShowLoginModal(false);
      setPersonalNumber("");
      setPinCode("");
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  /* ---------------- logout ---------------- */

  const submitLogout = async (emp: any) => {
    try {
      const log = await logoutEmployee(emp.id);

      setCompany((prev: any) => {
        const updated = { ...prev };
        const idx = updated.employees.findIndex((e: any) => e.id === emp.id);

        if (idx !== -1) {
          const logs = updated.employees[idx].timeLogs || [];
          for (let i = logs.length - 1; i >= 0; i--) {
            if (!logs[i].logoutTime) {
              logs[i] = log;
              break;
            }
          }
        }

        return updated;
      });

      router.push("/company");
    } catch (err: any) {
      alert(err.message || "Logout failed");
    }
  };

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-10 mt-14">
      {/* Header */}
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {company.user.name}
        </h1>
        <p className="text-gray-600 mb-3">
          Owner: {company.user.name} ({company.user.email})
        </p>
        <RealTimeClock />
      </div>
      <div className="mb-4">
        <Link href="/company/createemployee" className="p-2 bg-teal-400 rounded mb-10">Add an Employee</Link>
      </div>

      {/* Employees */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Today's Employees</h2>

        <table className="w-full border text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Logs</th>
              <th className="px-4 py-2">Worked Time</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {company.employees.map((emp: any) => {
              const todayLogs =
                emp.timeLogs?.filter((log: any) => {
                  if (!log.logDate) return false;
                  return (
                    new Date(log.logDate).setHours(0, 0, 0, 0) === todayTime
                  );
                }) || [];

              let status = "Not Logged In";
              if (todayLogs.length) {
                const last = todayLogs[todayLogs.length - 1];
                status = last.logoutTime ? "Logged Out" : "Logged In";
              }

              const workedToday = calculateWorkedTime(todayLogs);

              return (
                <tr key={emp.id} className="border-b">
                  <td className="px-4 py-2 font-medium">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email || "-"}</td>
                  <td className="px-4 py-2">{status}</td>

                  <td className="px-4 py-2 text-sm">
                    {todayLogs.length === 0 && (
                      <span className="text-gray-400">—</span>
                    )}
                    {todayLogs.map((log: any, idx: number) => (
                      <div key={idx} suppressHydrationWarning>
                        In: {safeTime(log.loginTime, mounted)}
                        {log.logoutTime && (
                          <> | Out: {safeTime(log.logoutTime, mounted)}</>
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    {workedToday}
                  </td>

                  <td className="px-4 py-2">
                    {todayLogs.length === 0 ||
                    todayLogs[todayLogs.length - 1]?.logoutTime ? (
                      <button
                        onClick={() => openLogin(emp)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Login
                      </button>
                    ) : (
                      <button
                        onClick={() => submitLogout(emp)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

      {/* Login Modal */}
      {showLoginModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h3 className="text-xl font-bold mb-4">
              Login – {selectedEmployee.name}
            </h3>

            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              placeholder="Personal Number"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
            />

            <input
              type="password"
              className="w-full mb-4 border px-3 py-2 rounded"
              placeholder="PIN"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitLogin}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
