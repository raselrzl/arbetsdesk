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
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center">
      <div className="relative bg-white max-w-[250px] h-[260px] rounded-xl shadow-xl text-center p-6 border-t-12 border-teal-800">
        
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          disabled={!!loading}
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-800"
        >
          x
        </button>

        <h2 className="text-xl font-bold mb-1 uppercase">Hi, {employeeName}</h2>

        <p className="text-sm text-teal-600 my-4">
          Your shift starts at <b>{formatTime(schedule.startTime)}</b>
        </p>

        <button
          onClick={handleStartNow}
          disabled={!!loading}
          className={`w-full py-2 font-bold mt-10 mb-2 text-white ${
            loading === "now"
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-800 hover:bg-teal-700"
          }`}
        >
          {loading === "now" ? "Starting..." : "Start now"}
        </button>

        <button
          onClick={handleStartAtSchedule}
          disabled={!!loading}
          className={`w-full py-2 font-bold ${
            loading === "scheduled"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {loading === "scheduled"
            ? "Please wait..."
            : "Start at scheduled time"}
        </button>
      </div>
    </div>
  );
}
