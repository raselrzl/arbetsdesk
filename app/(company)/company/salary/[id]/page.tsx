import React from "react";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
import { Clock, User2 } from "lucide-react";

type Params = { id: string };

async function getEmployeeData(personalNumber: string) {
  const employee = await prisma.employee.findFirst({
    where: { person: { personalNumber } },
    select: {
      person: { select: { name: true, personalNumber: true } },
      schedules: { select: { date: true, startTime: true, endTime: true } },
      timeLogs: { select: { logDate: true, loginTime: true, logoutTime: true } },
    },
  });

  if (!employee || !employee.person) notFound();

  return {
    name: employee.person.name,
    personalNumber: employee.person.personalNumber!,
    schedules: employee.schedules,
    timeLogs: employee.timeLogs,
  };
}

export default async function EmployeeSchedulePage({ params }: { params: Promise<Params> }) {
  const { id: personalNumber } = await params;
  const employeeData = await getEmployeeData(personalNumber);

  if (!employeeData) return <p>No data available</p>;

  // Combine schedules and timeLogs by date for the table
  const rows = employeeData.schedules.map((s) => {
    const log = employeeData.timeLogs.find(
      (t) => new Date(t.logDate).toDateString() === new Date(s.date).toDateString()
    );

    return {
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      loginTime: log?.loginTime,
      logoutTime: log?.logoutTime,
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 mt-20">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <User2 className="w-6 h-6 text-teal-600" />
        {employeeData.name}
      </div>
      <p>Personal Number: {employeeData.personalNumber}</p>

      <h2 className="text-xl font-semibold mt-4 flex items-center gap-2">
        <Clock /> Schedule & Time Log
      </h2>

      {rows.length > 0 ? (
        <table className="w-full table-auto border border-teal-200">
          <thead className="bg-teal-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Shift Start</th>
              <th className="p-2">Shift End</th>
              <th className="p-2">Login</th>
              <th className="p-2">Logout</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-teal-100 text-center">
                <td className="p-2">{new Date(row.date).toLocaleDateString()}</td>
                <td className="p-2">{new Date(row.startTime).toLocaleTimeString()}</td>
                <td className="p-2">{new Date(row.endTime).toLocaleTimeString()}</td>
                <td className="p-2">{row.loginTime ? new Date(row.loginTime).toLocaleTimeString() : "-"}</td>
                <td className="p-2">{row.logoutTime ? new Date(row.logoutTime).toLocaleTimeString() : "-"}</td>
             
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedule/time log data available</p>
      )}
    </div>
  );
}
