// app/(company)/companycomponents/EmployeeRow.tsx
"use client";
import { useState } from "react";
import Clock from "./Clock";

export default function EmployeeRow({ emp, today }: any) {
  const timeLogs = emp.timeLogs || []; // default empty array
  const [status, setStatus] = useState(
    timeLogs[0]?.loginTime
      ? timeLogs[0]?.logoutTime
        ? "Logged Out"
        : "Logged In"
      : "Not Scheduled"
  );
  const [loginTime, setLoginTime] = useState(timeLogs[0]?.loginTime);
  const [logoutTime, setLogoutTime] = useState(timeLogs[0]?.logoutTime);
  const [personalNumber, setPersonalNumber] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`/company/employee/${emp.id}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalNumber, pinCode }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Employee logged in successfully!");
      setStatus("Logged In");
      setLoginTime(data.loginTime);
    } else {
      alert(data.error);
    }
  };

  const handleLogout = async () => {
    const res = await fetch(`/company/employee/${emp.id}/logout`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setStatus("Logged Out");
      setLogoutTime(data.logoutTime);
    } else {
      alert(data.message);
    }
  };

  return (
    <tr key={emp.id} className="border-b">
      <td className="px-4 py-2">{emp.name}</td>
      <td className="px-4 py-2">{emp.email || "-"}</td>
      <td className="px-4 py-2">{status}</td>
      <td className="px-4 py-2">
        {loginTime && <Clock startTime={loginTime} />}
        {logoutTime && <p>Logged out at: {new Date(logoutTime).toLocaleTimeString()}</p>}
      </td>
      <td className="px-4 py-2 space-y-2">
        {!loginTime && (
          <div className="flex gap-2">
            <input
              placeholder="Personal #"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="PIN"
              type="password"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={handleLogin}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Login
            </button>
          </div>
        )}
        {loginTime && !logoutTime && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        )}
      </td>
    </tr>
  );
}
