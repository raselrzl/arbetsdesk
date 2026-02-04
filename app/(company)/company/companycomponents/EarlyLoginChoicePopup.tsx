"use client";
import { useState } from "react";

export default function EarlyLoginChoicePopup({
  employeeName,
  schedule,
  onStartNow,
  loginTime,
  onStartAtSchedule,
}: {
  employeeName: string;
  loginTime?: string;
  schedule: {
    startTime: string | Date;
    endTime: string | Date;
  };
  onStartNow: () => void;
  onStartAtSchedule: () => void;
}) {
  const [loading, setLoading] = useState<"now" | "scheduled" | null>(null);
  const [visible, setVisible] = useState(true);

  const formatTime = (v: string | Date) =>
    new Date(v).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleStartNow = async () => {
    setLoading("now");
    await onStartNow();
  };

  const handleStartAtSchedule = async () => {
    setLoading("scheduled");
    await onStartAtSchedule();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center rounded-xl">
      <div className="relative w-[260px] h-80 text-center flex flex-col justify-between rounded-2xl border-b-12 border-[#02505e]">
        <button
          onClick={() => setVisible(false)}
          disabled={!!loading}
          className="absolute top-1 right-4 text-gray-800 hover:text-gray-700 mb-7"
        >
          x
        </button>
        <div className="bg-[#02505e] text-gray-100 rounded-t-xl p-8">
          {/* Close button */}

          <h1 className="text-xs text-gray-400">Login Pass</h1>
          <h2 className="text-xl font-bold mb-1 uppercase">
            Hi, {employeeName}
          </h2>

          <p className="text-sm text-teal-400 my-4">
            Your shift starts at <b>{formatTime(schedule.startTime)}</b>
          </p>
        </div>

        <div className="flex flex-col overflow-hidden pb-8 px-8 bg-white">
          <button
            onClick={handleStartNow}
            disabled={!!loading}
            className={`w-full py-2 font-bold rounded-3xl mt-10 mb-2 text-gray-100 ${
              loading === "now"
                ? " bg-[#02505e] cursor-not-allowed"
                : "bg-[#02505e] hover:bg-teal-700"
            }`}
          >
            {loading === "now" ? "Starting..." : "Start now"}
          </button>

          <button
            onClick={handleStartAtSchedule}
            disabled={!!loading}
            className={`w-full py-2 font-bold text-[#02505e] rounded-3xl ${
              loading === "scheduled"
                ? "bg-[#02505e] cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-[#02505e]"
            }`}
          >
            {loading === "scheduled" ? "Please wait..." : "Scheduled time"}
          </button>
        </div>
      </div>
    </div>
  );
}
