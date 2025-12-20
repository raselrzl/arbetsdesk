"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RealTimeClock from "./RealTimeClock";
import { loginEmployee, logoutEmployee } from "@/app/actions";
import { ClipboardClock, TimerOff } from "lucide-react";
import { loginEmployeeWithPin } from "../companyactions";

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
      const log = await loginEmployeeWithPin(
        selectedEmployee.id,
        personalNumber,
        pinCode
      );

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
    <div className="min-h-screen max-w-7xl mx-auto px-2 py-10 mt-12 ">
      {/* Header */}
      <div className="bg-teal-100 p-8 rounded-xs shadow mb-8">
        <h1 className="text-3xl font-bold mb-2 uppercase">{company.name} AB</h1>
        <p className="text-gray-600 mb-3 font-bold">
          Org No:{company.organizationNo} <br />
          Email: {company.email}
        </p>
      </div>
      {/*       <div className="mb-4">
        <Link href="/company/createemployee" className="p-2 bg-teal-400 rounded mb-10">Add an Employee</Link>
      </div> */}

      {/* Employees */}
      <div className="bg-teal-50 p-2 md:p-4 rounded-xs shadow">
        <div className="md:flex md:gap-4 mb-2">
          <h2 className="text-2xl font-bold mb-2">Today's Innovators</h2>{" "}
          <RealTimeClock />
        </div>

        <table className="w-full border text-left">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              {/* <th className="px-4 py-2">Email</th> */}
              {/* <th className="px-4 py-2">Status</th> */}
              <th className="px-4 py-2">Logs</th>
              <th className="px-4 py-2">Time</th>

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

              let status = "Out & About";
              if (todayLogs.length) {
                const last = todayLogs[todayLogs.length - 1];
                status = last.logoutTime ? "Away for Now" : "Active";
              }

              const workedToday = calculateWorkedTime(todayLogs);

              return (
                <tr key={emp.id} className="border-b">
                  <td className="px-2 py-2 font-medium">{emp.name}</td>
                  {/* <td className="px-4 py-2">{emp.email || "-"}</td> */}
                  {/* <td className="px-4 py-2 text-xs md:sm">{status}</td> */}

                  <td className="px-4 py-2 text-sm flex">
                    {todayLogs.length === 0 && (
                      <span className="text-gray-400">—</span>
                    )}
                    {todayLogs.map((log: any, idx: number) => (
                      <div
                        key={idx}
                        suppressHydrationWarning
                        className="text-xs font-bold"
                      >
                        <div className="bg-green-600 p-1 rounded-xs flex justify-center items-center">
                          <ClipboardClock className="h-4 w-4 mr-1" />
                          {safeTime(log.loginTime, mounted)}
                        </div>
                        {log.logoutTime && (
                          <div className="bg-amber-300 p-1 rounded-xs flex justify-center items-center">
                            <TimerOff className="h-4 w-4 mr-1" />
                            {safeTime(log.logoutTime, mounted)}
                          </div>
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2 font-medium text-xs md:text-md">
                    {workedToday}
                  </td>

                  <td className="md:px-2 py-2">
                    {todayLogs.length === 0 ||
                    todayLogs[todayLogs.length - 1]?.logoutTime ? (
                      <button
                        onClick={() => openLogin(emp)}
                        className="px-2 py-1 w-16 bg-teal-600 text-white rounded-xs hover:bg-teal-700 cursor-pointer"
                      >
                        Login
                      </button>
                    ) : (
                      <button
                        onClick={() => submitLogout(emp)}
                        className="px-2 py-1 w-16 bg-red-600 text-white rounded-xs hover:bg-red-700 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 md:px-0">
          <div className="bg-white py-2 px-4 rounded-xs shadow w-96">
            <h3 className="text-xl font-bold mb-4">
              Login – {selectedEmployee.name}
            </h3>

            <input
              className="w-full mb-3 border px-3 py-2 rounded-xs"
              placeholder="Personal Number"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
            />

            {/* PIN Code - 4 boxes */}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinCode[i] || ""}
                  placeholder="."
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // Only numbers
                    if (!val) return;
                    const newPin = pinCode.split("");
                    newPin[i] = val;
                    setPinCode(newPin.join(""));

                    // Move focus to next input safely
                    if (i < 3) {
                      const nextInput = document.getElementById(`pin-${i + 1}`);
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  className="w-12 h-12 text-center border rounded-xs text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="flex flex-col items-center mb-4">
              {/* PIN Inputs */}
              {/* <div className="flex justify-center gap-2 mb-4">
    {[0, 1, 2, 3].map((i) => (
      <input
        key={i}
        id={`pin-${i}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={pinCode[i] || ""}
        placeholder="."
        readOnly // make input readonly, we'll use keypad
        className="w-12 h-12 text-center border rounded-xs text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ))}
  </div> */}
              {/*  <div className="grid grid-cols-3 gap-2">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
      <button
        key={num}
        onClick={() => {
          if (pinCode.length < 4) setPinCode(pinCode + num);
        }}
        className="p-3 bg-gray-200 rounded hover:bg-gray-300 text-xl"
      >
        {num}
      </button>
    ))}
 
    <button
      onClick={() => setPinCode("")}
      className="p-3 bg-red-400 rounded hover:bg-red-500 text-xl text-white"
    >
      C
    </button>
   
    <button
      onClick={() => {
        if (pinCode.length < 4) setPinCode(pinCode + "0");
      }}
      className="p-3 bg-gray-200 rounded hover:bg-gray-300 text-xl"
    >
      0
    </button>
 
    <button
      onClick={() => setPinCode(pinCode.slice(0, -1))}
      className="p-3 bg-yellow-400 rounded hover:bg-yellow-500 text-xl"
    >
      ×
    </button>
  </div> */}

              {/*   <button
    onClick={submitLogin}
    className="mt-3 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
  >
    Enter
  </button> */}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-2 py-1 bg-red-400 rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitLogin}
                className="px-3 py-1 bg-teal-600 text-white rounded-xs cursor-pointer"
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
