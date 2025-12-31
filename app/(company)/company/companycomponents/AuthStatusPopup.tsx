"use client";

import { CheckCircle, AlertTriangle, Info, LogOut } from "lucide-react";

type Status =
  | "ALREADY_LOGGED_IN"
  | "LOGGED_IN_NO_SCHEDULE"
  | "LOGGED_IN_WITH_SCHEDULE";

export default function AuthStatusPopup({
  status,
  employeeName,
  schedule,
  onClose,
}: {
  status: Status;
  employeeName: string;
  schedule?: {
    startTime: string | Date;
    endTime: string | Date;
  };
  onClose: () => void;
}) {
  const formatTime = (v: string | Date) =>
    new Date(v).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[250px] rounded shadow-xl text-center">
        <h2 className="text-xl font-bold text-gray-200 bg-teal-500 pb-4">Hi, {employeeName} <br/><span className="text-xs">You are sucessfully logged in</span></h2>

        {status === "LOGGED_IN_WITH_SCHEDULE" && schedule && (
          <div className="p-6">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">You have a schedule today</p>
            <p className="text-lg font-bold mt-1">
              {formatTime(schedule.startTime)} –{" "}
              {formatTime(schedule.endTime)}
            </p>
          </div>
        )}

        {status === "LOGGED_IN_NO_SCHEDULE" && (
          <div className="p-6">
            <Info className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">Logged in</p>
            <p className="text-sm text-gray-600">
              You don’t have a schedule today
            </p>
          </div>
        )}

        {status === "ALREADY_LOGGED_IN" && (
          <div className="p-6">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <p className="font-semibold">Already logged in</p>
            <p className="text-sm text-gray-600">
              If you want to log out, please use your logout button
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-teal-600 text-white font-bold hover:bg-teal-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
