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

type EmployeeWeeklyMessagesProps = {
  companyId?: string;
};

export default function EmployeeWeeklyMessages({ companyId }: EmployeeWeeklyMessagesProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return; // don't fetch if no company selected
    setLoading(true);
    getEmployeeWeeklyMessages(weekOffset, companyId)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [weekOffset, companyId]);

  const getWeekRangeLabel = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return `${monday.toLocaleDateString("en-GB", options)} - ${sunday.toLocaleDateString(
      "en-GB",
      options
    )}`;
  };

  if (!companyId) return null; // hide component if no company selected

  return (
    <div className="bg-teal-50 p-4 shadow rounded space-y-3">
      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {!loading && messages.length === 0 && (
        <p className="text-sm text-gray-400">No messages this week.</p>
      )}

      <ul className="space-y-2">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`border border-amber-300 p-2 rounded-xs ${
              m.isRead ? "bg-white" : "bg-amber-50"
            }`}
          >
            <div className="flex justify-between text-xs text-gray-500">
              <p className="text-sm mt-1">{m.content}</p>
              <span className="text-[8px] px-2 h-4 flex items-center justify-center bg-amber-900 text-white">
                {new Date(m.createdAt).toLocaleString("en-GB", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <span className="text-[10px] bg-amber-200 px-1 py-0.5">{m.company.name}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-teal-900">
          Week: {getWeekRangeLabel()}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="px-2 h-8 py-0.5 border border-amber-200 rounded-xs hover:bg-teal-50"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className="px-2 h-8 py-0.5 border border-amber-200 rounded-xs hover:bg-teal-50"
          >
            Today
          </button>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="px-2 h-8 py-0.5 border border-amber-200 rounded-xs hover:bg-teal-50"
            disabled={weekOffset >= 0}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
