"use client";

import { CheckCircle, AlertTriangle, Info, LogOut } from "lucide-react";

type Status =
  | "ALREADY_LOGGED_IN"
  | "LOGGED_IN_NO_SCHEDULE"
  | "LOGGED_IN_WITH_SCHEDULE";

export default function AuthStatusPopup({
  status,
  onClose,
}: {
  status: Status;
  onClose: () => void;
}) {
  const config = {
    ALREADY_LOGGED_IN: {
      icon: <LogOut className="w-10 h-10 text-yellow-500" />,
      title: "Already logged in",
      message: "If you want to log out, please use your logout button.",
      color: "bg-yellow-50 border-yellow-400",
    },
    LOGGED_IN_NO_SCHEDULE: {
      icon: <Info className="w-10 h-10 text-blue-500" />,
      title: "Logged in",
      message: "You don’t have a schedule today.",
      color: "bg-blue-50 border-blue-400",
    },
    LOGGED_IN_WITH_SCHEDULE: {
      icon: <CheckCircle className="w-10 h-10 text-green-500" />,
      title: "Login successful",
      message: "Your workday has started.",
      color: "bg-green-50 border-green-400",
    },
  }[status];

  return (
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
      <div
        className={`w-full max-w-sm p-6 border rounded shadow-xl ${config.color}`}
      >
        <div className="flex flex-col items-center text-center gap-3">
          {config.icon}
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm text-gray-700">{config.message}</p>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-black text-white rounded hover:opacity-80"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
