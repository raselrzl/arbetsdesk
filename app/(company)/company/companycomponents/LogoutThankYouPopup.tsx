"use client";

import { ClipboardClock } from "lucide-react";

function safeTime(value?: string | Date | null) {
  if (!value) return "--:--";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  open: boolean;
  employeeName?: string;
  loginTime: string | null;
  logoutTime: string | null;
  onClose: () => void;
};


export default function LogoutThankYouPopup({
  open,
  employeeName,
  loginTime,
  logoutTime,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[260px] h-80 shadow-xl text-center relative flex flex-col justify-between rounded-3xl">
        <div className="text-xl font-bold text-gray-200 bg-[#02505e] py-4 uppercase rounded-t-2xl">
          <span className="text-sm text-teal-400">Thank you For Today</span>
          {employeeName && (
            <p className="mb-2 font-extrabold text-xl">
              {employeeName}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 my-4">
          You have successfully logged out.
        </p>

        <div className="text-sm font-mono mb-5 flex flex-col gap-1">
          <div className="flex justify-center items-center gap-1 text-2xl">
            
            {safeTime(loginTime)} - {safeTime(logoutTime)}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-[#02505e] text-white font-semibold rounded-b-2xl"
        >
          OK
        </button>
      </div>
    </div>
  );
}
