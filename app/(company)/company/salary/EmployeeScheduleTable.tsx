"use client";

import React, { useState, startTransition } from "react";
import { User2, Clock, MoreVertical } from "lucide-react";
import {
  createSalarySlipForEmployee,
  updateTimeLogStatus,
} from "./salaryActions";

type Row = {
  id: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  loginTime?: Date;
  logoutTime?: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  lastUpdated?: Date;
};

interface Props {
  name: string;
  personalNumber: string;
  schedules?: { date: Date; startTime: Date; endTime: Date }[];
  timeLogs?: {
    id: string;
    logDate: Date;
    loginTime?: Date;
    logoutTime?: Date;
    status: "PENDING" | "APPROVED" | "REJECTED";
    updatedAt?: Date;
  }[];
  employeeId: string;
  month: number;
  year: number;
}

// ---------------- Helper Functions ----------------
const formatDate = (d: Date) => d.toISOString().split("T")[0];
const formatTime = (d?: Date) => (d ? d.toTimeString().slice(0, 5) : "-");

export default function EmployeeScheduleTable({
  name,
  personalNumber,
  schedules = [],
  timeLogs = [],
  employeeId,
  month,
  year,
}: Props) {
  // ---------------- State ----------------
  const rows: Row[] = timeLogs.map((log) => {
    const schedule = schedules.find(
      (s) => s.date.toDateString() === log.logDate.toDateString(),
    );

    return {
      id: log.id,
      date: log.logDate,
      startTime: schedule?.startTime,
      endTime: schedule?.endTime,
      loginTime: log.loginTime,
      logoutTime: log.logoutTime,
      status: log.status,
      lastUpdated: log.updatedAt,
    };
  });

  const [localRows, setLocalRows] = useState(rows);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [salaryCreated, setSalaryCreated] = useState(false);

  const allApproved =
    localRows.length > 0 && localRows.every((r) => r.status === "APPROVED");

  // ---------------- Overall Status ----------------
  let overallStatus = "";
  const hasPending = localRows.some((r) => r.status === "PENDING");
  const hasRejected = localRows.some((r) => r.status === "REJECTED");
  const hasApproved = localRows.every((r) => r.status === "APPROVED");

  if (hasPending && hasRejected) overallStatus = "Pending / Rejected";
  else if (hasPending) overallStatus = "Pending Approval";
  else if (hasRejected) overallStatus = "Rejected";
  else if (hasApproved) overallStatus = "All Approved";
  else overallStatus = "Unknown";

  const overallStatusColor =
    overallStatus === "All Approved"
      ? "bg-emerald-600 text-white"
      : overallStatus === "Rejected"
        ? "bg-rose-600 text-white"
        : overallStatus === "Pending Approval"
          ? "bg-amber-500 text-white"
          : overallStatus === "Pending / Rejected"
            ? "bg-orange-600 text-white"
            : "bg-gray-400 text-white";

  // ---------------- Handlers ----------------
  const handleStatusChange = (index: number, status: Row["status"]) => {
    const row = localRows[index];

    const next = [...localRows];
    next[index] = {
      ...row,
      status,
      lastUpdated: new Date(),
    };

    setLocalRows(next);
    setOpenMenuIndex(null);

    startTransition(() => {
      updateTimeLogStatus(row.id, status);
    });
  };

  const handleCreateSalary = async () => {
    try {
      const slip = await createSalarySlipForEmployee(employeeId, month, year);
      console.log("Salary Slip Created:", slip);
      setSalaryCreated(true); // Update UI
      alert(
        `Salary Slip created for ${formatDate(new Date())}. Total Pay: ${slip.totalPay}`,
      );
    } catch (error: any) {
      console.error("Error creating salary slip:", error.message || error);
      alert("Failed to create salary slip. Check console.");
    }
  };

  const statusColors: Record<"PENDING" | "APPROVED" | "REJECTED", string> = {
    PENDING: "bg-amber-500 hover:bg-amber-600",
    APPROVED: "bg-emerald-600 hover:bg-emerald-700",
    REJECTED: "bg-rose-600 hover:bg-rose-700",
  };

  // ---------------- Render ----------------
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 mt-20">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <User2 className="w-6 h-6 text-teal-600" />
        {name}
      </div>

      <p>Personal Number: {personalNumber}</p>

      <h2 className="text-xl font-semibold mt-4 flex items-center gap-2">
        <Clock /> Time Logs
      </h2>

      {localRows.length === 0 ? (
        <p>No time logs available</p>
      ) : (
        <table className="w-full border border-teal-200">
          <thead className="bg-teal-100">
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Login</th>
              <th>Logout</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {localRows.map((row, i) => (
              <tr key={row.id} className="border-t text-center">
                <td>{formatDate(row.date)}</td>
                <td>
                  {formatTime(row.startTime)} → {formatTime(row.endTime)}
                </td>
                <td>{formatTime(row.loginTime)}</td>
                <td>{formatTime(row.logoutTime)}</td>

                <td className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === i ? null : i)
                    }
                    className={`px-2 py-1 rounded text-white flex gap-1 items-center ${
                      statusColors[row.status]
                    }`}
                  >
                    {row.status}
                    <MoreVertical size={14} />
                  </button>

                  {openMenuIndex === i && (
                    <div className="absolute right-0 bg-white border rounded shadow z-50">
                      {(["PENDING", "APPROVED", "REJECTED"] as const).map(
                        (s) => (
                          <div
                            key={s}
                            onClick={() => handleStatusChange(i, s)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {s}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </td>

                <td>{row.lastUpdated ? formatDate(row.lastUpdated) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div
        className={`inline-block px-3 py-1 rounded ${overallStatusColor} mt-2 font-semibold`}
      >
        {overallStatus}
      </div>

      {allApproved && !salaryCreated && (
        <div className="mt-4">
          <button
            onClick={handleCreateSalary}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            All Time Logs Approved - Create Salary Slip
          </button>
        </div>
      )}

      {salaryCreated && (
        <div className="mt-4 bg-emerald-100 text-emerald-800 px-3 py-2 rounded">
          Salary Slip Successfully Created ✅
        </div>
      )}
    </div>
  );
}
