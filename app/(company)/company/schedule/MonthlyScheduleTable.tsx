"use client";

import { useState, useEffect } from "react";
import { swapSchedules, getSchedulesForCompany } from "./schedules";
import { ArrowLeftRight } from "lucide-react";

type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
  onScheduleUpdated: () => Promise<void>;
};

export default function MonthlyScheduleTable({ schedules, employees, onScheduleUpdated }: Props) {
  // ---------------- State ----------------
  const [schedulesState, setSchedulesState] = useState(schedules); // local reactive schedules
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedSchedules, setSelectedSchedules] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // ---------------- Sync props ----------------
  useEffect(() => {
    setSchedulesState(schedules);
  }, [schedules]);

  // ---------------- Month calculations ----------------
  const getMonthRange = (offset = 0) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const { start, end } = getMonthRange(monthOffset);
  const daysInMonth = Array.from(
    { length: end.getDate() },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1),
  );

  // ---------------- Helpers ----------------
  const diffHours = (start: string, end: string) =>
    (new Date(end).getTime() - new Date(start).getTime()) / 36e5;

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

  const getEmployeeColor = (employeeId: string) => {
    let hash = 0;
    for (let i = 0; i < employeeId.length; i++) {
      hash = employeeId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return EMPLOYEE_COLORS[Math.abs(hash) % EMPLOYEE_COLORS.length];
  };

  const getEmployeeColorClasses = (employeeId: string) => {
    const full = getEmployeeColor(employeeId);
    const bg = full.match(/bg-\S+/)?.[0] ?? "bg-gray-100";
    const border = full.match(/border-\S+/)?.[0] ?? "border-gray-400";
    return { bg, border };
  };

  // ---------------- Filter schedules for this month ----------------
  const monthSchedules = schedulesState.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  const schedulesByDay: Record<string, any[]> = {};
  daysInMonth.forEach((d) => (schedulesByDay[d.toDateString()] = []));
  monthSchedules.forEach((sch) => {
    const key = new Date(sch.date).toDateString();
    if (schedulesByDay[key]) schedulesByDay[key].push(sch);
  });

  // ---------------- Selection ----------------
  const toggleScheduleSelection = (sch: any) => {
    setSelectedSchedules((prev) => {
      if (prev.find((s) => s.id === sch.id))
        return prev.filter((s) => s.id !== sch.id);
      if (prev.length >= 2) return prev;
      return [...prev, sch];
    });
  };

  useEffect(() => {
    setShowPopup(selectedSchedules.length === 2);
  }, [selectedSchedules]);

  const handleClosePopup = () => {
    setSelectedSchedules([]);
    setShowPopup(false);
  };

  // ---------------- Swap handler ----------------
  /*  const handleSwap = async () => {
    if (selectedSchedules.length !== 2) return;

    try {
      await swapSchedules(selectedSchedules[0].id, selectedSchedules[1].id);

      // Fetch updated schedules from server
      const updatedSchedules = await getSchedulesForCompany();
      setSchedulesState(updatedSchedules);

      handleClosePopup();
      alert("Shifts swapped successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to swap shifts");
    }
  }; */

  const handleSwap = async () => {
    if (selectedSchedules.length !== 2 || isSwapping) return;

    setIsSwapping(true);

    try {
      await swapSchedules(selectedSchedules[0].id, selectedSchedules[1].id);

      const updatedSchedules = await getSchedulesForCompany();
      setSchedulesState(updatedSchedules);

      handleClosePopup();
      await onScheduleUpdated();
      alert("Shifts swapped successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to swap shifts");
    } finally {
      setIsSwapping(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="space-y-3 mt-10">
      {/* Month Filter */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-100 bg-[#02505e] px-2 py-1 uppercase">
          {start.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </div>
        <div className="mb-3 rounded-xs mt-2 border uppercase border-yellow-400 bg-yellow-100 px-4 py-1 text-sm text-yellow-800">
          Select any <span className="font-semibold">two schedules</span> to
          swap.
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            ← Prev
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            Current
          </button>
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="px-2 py-0.5 border border-[#02505e] hover:bg-gray-100 text-xs"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border-collapse text-xs">
          <thead>
            <tr className="bg-[#02505e] text-gray-100">
              <th className="p-2 border text-left sticky left-0 bg-[#02505e] z-10 w-52">
                Employee
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day.toDateString()}
                  className="p-2 border text-center min-w-[60px]"
                >
                  {day.getDate()}
                  <p className="text-[10px] text-gray-400">
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </p>
                </th>
              ))}
              <th className="p-2 border border-[#02505e] text-center text-gray-100 bg-[#02505e] w-20">
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
                    className={`p-2 border border-teal-100 font-medium sticky left-0 z-10 w-52 ${getEmployeeColor(emp.id).split(" ")[0]} ${getEmployeeColor(emp.id).split(" ")[1]} text-black`}
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
                                className={`mb-1 w-20 rounded px-2 py-1 border-l-4 cursor-pointer ${isSelected ? "bg-teal-200" : bg} ${border} text-left`}
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
                  <td className="p-2 border border-teal-300 text-center font-semibold bg-[#02505e] text-gray-100 w-20">
                    {totalHours.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleClosePopup}
            >
              ✕
            </button>
            <h3 className="font-semibold text-lg mb-2 uppercase text-center">
              Selected Shift
            </h3>
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
                  <p className="text-[10px] text-gray-800 text-right">
                    {new Date(sch.date).toLocaleDateString()}
                  </p>
                </div>
              );
            })}

            {/*  <button onClick={handleSwap} className="mt-2 w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Swap Shifts</button>
             */}
            {/* <button
              onClick={handleSwap}
              disabled={selectedSchedules.length !== 2 || isSwapping}
              className={`
    mt-2 w-full px-4 py-2 rounded transition
    ${
      selectedSchedules.length !== 2 || isSwapping
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#02505e] text-gray-100 uppercase text-sm hover:bg-teal-700"
    }
  `}
            >
              {isSwapping ? "Swapping..." : "Swap Shifts"}
            </button> */}
            <button
  onClick={handleSwap}
  disabled={selectedSchedules.length !== 2 || isSwapping}
  className={`
    mt-2 w-full px-4 py-2 rounded transition
    flex items-center justify-center gap-2
    ${
      selectedSchedules.length !== 2 || isSwapping
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#02505e] text-gray-100 uppercase text-sm hover:bg-teal-700"
    }
  `}
>
  {isSwapping ? (
    <>
      <ArrowLeftRight className="w-4 h-4 animate-pulse" />
      Swapping...
    </>
  ) : (
    <>
      <ArrowLeftRight className="w-4 h-4" />
      Swap Shifts
    </>
  )}
</button>

          </div>
        </div>
      )}
    </div>
  );
}
