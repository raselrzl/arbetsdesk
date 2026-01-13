"use client";

export default function EarlyLoginChoicePopup({
  employeeName,
  schedule,
  onStartNow,
  onStartAtSchedule,
}: {
  employeeName: string;
  schedule: {
    startTime: string | Date;
    endTime: string | Date;
  };
  onStartNow: () => void;
  onStartAtSchedule: () => void;
}) {
  const formatTime = (v: string | Date) =>
    new Date(v).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[280px] rounded shadow-xl text-center p-6">
        <h2 className="text-lg font-bold mb-1">
          Hi, {employeeName}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Your shift starts at{" "}
          <b>{formatTime(schedule.startTime)}</b>
        </p>

        <button
          onClick={onStartNow}
          className="w-full bg-teal-600 text-white py-3 font-bold mb-2 hover:bg-teal-700"
        >
          Start now
        </button>

        <button
          onClick={onStartAtSchedule}
          className="w-full bg-gray-200 py-3 font-bold hover:bg-gray-300"
        >
          Start at scheduled time
        </button>
      </div>
    </div>
  );
}
