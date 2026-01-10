"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEmployeeWeeklyMessages } from "./employeeactions";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  isBroadcast: boolean;
  isRead: boolean;
  company: { name: string };
};

export default function EmployeeWeeklyMessages() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch weekly messages based on weekOffset
  useEffect(() => {
    setLoading(true);
    getEmployeeWeeklyMessages(weekOffset)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [weekOffset]);

  // Calculate start and end of current week (Monday-Sunday)
  const getWeekRangeLabel = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const day = today.getDay() || 7; // Sunday = 7
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return `${monday.toLocaleDateString("en-GB", options)} - ${sunday.toLocaleDateString("en-GB", options)}`;
  };

  return (
    <div className="bg-white p-4 shadow rounded space-y-3">
      

      {/* CONTENT */}
      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {!loading && messages.length === 0 && (
        <p className="text-sm text-gray-400">No messages this week.</p>
      )}

      <ul className="space-y-2">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`border p-2 rounded ${m.isRead ? "bg-white" : "bg-amber-50"}`}
          >
            <div className="flex justify-between text-xs text-gray-500">
              <span>{m.company.name}</span>
              <span>
                {new Date(m.createdAt).toLocaleString("en-GB", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm mt-1">{m.content}</p>
          </li>
        ))}
      </ul>

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">
          Messages – Week: {getWeekRangeLabel()}
        </h2>

        <div className="flex gap-2">
          {/* Previous Week */}
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1 border rounded hover:bg-teal-50"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Today */}
          <button
            onClick={() => setWeekOffset(0)}
            className="p-1 border rounded hover:bg-teal-50"
          >
            Today
          </button>

          {/* Next Week */}
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1 border rounded hover:bg-teal-50"
            disabled={weekOffset >= 0} // Optional: disable future weeks
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
