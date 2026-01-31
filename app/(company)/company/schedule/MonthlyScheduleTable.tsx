"use client";

import { useState, useEffect } from "react";
import { swapSchedules } from "./schedules";

type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
};

function diffHours(start: string, end: string) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 36e5;
}

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

const EMPLOYEE_COLORS = [
  "bg-red-100 border-red-400",
  "bg-blue-100 border-blue-400",
  "bg-green-100 border-green-400",
  "bg-yellow-100 border-yellow-400",
  "bg-purple-100 border-purple-400",
  "bg-pink-100 border-pink-400",
  "bg-indigo-100 border-indigo-400",
  "bg-teal-100 border-teal-400",
  "bg-orange-100 border-orange-400",
];

function getEmployeeColor(employeeId: string) {
  let hash = 0;
  for (let i = 0; i < employeeId.length; i++) {
    hash = employeeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EMPLOYEE_COLORS.length;
  return EMPLOYEE_COLORS[index];
}

function getEmployeeColorClasses(employeeId: string) {
  const full = getEmployeeColor(employeeId);
  const bg = full.match(/bg-\S+/)?.[0] ?? "bg-gray-100";
  const border = full.match(/border-\S+/)?.[0] ?? "border-gray-400";
  const text = border.replace("border", "text");
  return { bg, border, text };
}

export default function MonthlyScheduleTable({ schedules, employees }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedSchedules, setSelectedSchedules] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const { start, end } = getMonthRange(monthOffset);
  const daysInMonth = Array.from(
    { length: end.getDate() },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1),
  );

  const monthSchedules = schedules.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  const schedulesByDay: Record<string, any[]> = {};
  daysInMonth.forEach((d) => (schedulesByDay[d.toDateString()] = []));
  monthSchedules.forEach((sch) => {
    const key = new Date(sch.date).toDateString();
    if (schedulesByDay[key]) schedulesByDay[key].push(sch);
  });

  // Toggle selection of a schedule
  const toggleScheduleSelection = (sch: any) => {
    setSelectedSchedules((prev) => {
      if (prev.find((s) => s.id === sch.id)) {
        return prev.filter((s) => s.id !== sch.id);
      }
      // Max 2 schedules
      if (prev.length >= 2) return prev;
      return [...prev, sch];
    });
  };

  // Automatically open popup when 2 schedules are selected
  useEffect(() => {
    if (selectedSchedules.length === 2) {
      setShowPopup(true);
    } else if (selectedSchedules.length < 2) {
      setShowPopup(false);
    }
  }, [selectedSchedules]);

  const handleClosePopup = () => {
    setSelectedSchedules([]);
    setShowPopup(false);
  };

  return (
    <div className="space-y-3 mt-10">
      {/* MONTH FILTER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-teal-500 px-2 py-1 uppercase">
          {start.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Current
          </button>
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-2 py-0.5 border border-teal-200 hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border-collapse text-xs">
          <thead>
            <tr className="bg-teal-300">
              <th className="p-2 border text-left sticky left-0 bg-teal-300 z-10 w-52">
                Employee
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day.toDateString()}
                  className="p-2 border text-center min-w-[60px]"
                >
                  {day.getDate()}
                  <p className="text-[10px] text-gray-600">
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </p>
                </th>
              ))}
              <th className="p-2 border border-teal-300 text-center text-gray-100 bg-teal-800 w-20">
                Total (h)
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const totalHours = monthSchedules
                .filter((s) => s.employee.id === emp.id)
                .reduce((sum, s) => sum + diffHours(s.startTime, s.endTime), 0);

              return (
                <tr key={emp.id} className="border-t border-teal-100">
                  <td
                    className={`p-2 border border-teal-100 font-medium sticky left-0 z-10 w-52 ${
                      getEmployeeColor(emp.id).split(" ")[0]
                    } ${getEmployeeColor(emp.id).split(" ")[1]} text-black`}
                  >
                    {emp.name}
                  </td>

                  {daysInMonth.map((day) => {
                    const dayKey = day.toDateString();
                    const empSchedules =
                      schedulesByDay[dayKey]?.filter(
                        (s) => s.employee.id === emp.id,
                      ) || [];
                    return (
                      <td
                        key={dayKey}
                        className="p-2 border border-teal-100 text-center min-w-[60px]"
                      >
                        {empSchedules.length === 0 ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          empSchedules.map((sch) => {
                            const { bg, border } = getEmployeeColorClasses(
                              emp.id,
                            );
                            const isSelected = selectedSchedules.find(
                              (s) => s.id === sch.id,
                            );
                            return (
                              <div
                                key={sch.id}
                                className={`mb-1 w-20 rounded px-2 py-1 border-l-4 cursor-pointer ${
                                  isSelected ? "bg-teal-200" : bg
                                } ${border} text-left`}
                                onClick={() => toggleScheduleSelection(sch)}
                              >
                                <div className="font-semibold text-[12px] truncate">
                                  {emp.name}
                                </div>
                                <div className="text-[10px]">
                                  {new Date(sch.startTime).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    },
                                  )}
                                  –
                                  {new Date(sch.endTime).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    },
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </td>
                    );
                  })}

                  <td className="p-2 border border-teal-300 text-center font-semibold bg-teal-800 text-gray-100 w-20">
                    {totalHours.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL */}
      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleClosePopup}
            >
              ✕
            </button>
            <h3 className="font-semibold text-lg mb-2">Selected Schedules</h3>

            {selectedSchedules.map((sch) => {
              const { border } = getEmployeeColorClasses(sch.employeeId);
              return (
                <div
                  key={sch.id}
                  className={`mb-2 p-2 rounded border-l-4 bg-teal-200 ${border}`}
                >
                  <p className="font-medium">
                    {employees.find((e) => e.id === sch.employeeId)?.name ||
                      "Unknown"}
                  </p>
                  <p>
                    {new Date(sch.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                    –
                    {new Date(sch.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(sch.date).toLocaleDateString()}
                  </p>
                </div>
              );
            })}

            {/* SWAP BUTTON */}
            <button
              onClick={async () => {
                if (selectedSchedules.length !== 2) return;

                try {
                  await swapSchedules(
                    selectedSchedules[0].id,
                    selectedSchedules[1].id,
                  );
                  alert("Shifts swapped successfully!");
                  handleClosePopup();
                  // Optionally, trigger a re-fetch of schedules from the server here
                } catch (err) {
                  console.error(err);
                  alert("Failed to swap shifts");
                }
              }}
              className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Swap Shifts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
