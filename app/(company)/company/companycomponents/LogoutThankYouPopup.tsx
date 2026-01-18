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
  loginTime?: string | Date | null;
  logoutTime?: string | Date | null;
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
      <div className="bg-white w-full max-w-[250px] h-[260px] rounded-xs shadow-xl text-center relative">
        <div className="text-xl font-bold text-gray-200 bg-teal-800 py-4 uppercase">
          Thank you For Today
          {employeeName && (
            <p className="text-sm mb-2 font-semibold">
              {employeeName}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 my-4">
          You have successfully logged out.
        </p>

        <div className="text-sm font-mono mb-5 flex flex-col gap-1">
          <div className="flex justify-center items-center gap-1">
            <ClipboardClock className="w-3 h-3" />
            Login: {safeTime(loginTime)}
          </div>
          <div className="flex justify-center items-center gap-1">
            <ClipboardClock className="w-3 h-3" />
            Logout: {safeTime(logoutTime)}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-teal-800 text-white font-semibold"
        >
          OK
        </button>
      </div>
    </div>
  );
}
