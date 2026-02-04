"use client";

import { CheckCircle, AlertTriangle, Info, LogOut } from "lucide-react";
import {
  getEmployeeCurrentLoginTime,
  logoutEmployeeWithPin,
} from "../companyactions";
import { useState } from "react";
import LogoutThankYouPopup from "./LogoutThankYouPopup";

type Status =
  | "ALREADY_LOGGED_IN"
  | "LOGGED_IN_NO_SCHEDULE"
  | "LOGGED_IN_WITH_SCHEDULE"
  | "EARLY_LOGIN_CHOICE_REQUIRED";

export default function AuthStatusPopup({
  status,
  employeeName,
  schedule,
  loginTime,
  employeeId,
  onClose,
  onConfirmLogin,
  personalNumber,
}: {
  status: Status;
  employeeName: string;
  employeeId: string;
  personalNumber: string;
  schedule?: {
    startTime: string | Date;
    endTime: string | Date;
  };
  loginTime?: string;
  onClose: () => void;
  onConfirmLogin?: () => void;
}) {
  const formatTime = (v: string | Date) =>
    new Date(v).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [logoutTime, setLogoutTime] = useState<string | null>(null);

  const [currentLoginTime, setCurrentLoginTime] = useState<string | null>(
    loginTime ?? null,
  );

  const handleLogout = async () => {
    try {
      // Fetch real login time from the backend
      const loginTimeFromDb = await getEmployeeCurrentLoginTime(employeeId);
      setCurrentLoginTime(loginTimeFromDb);

      // Logout
      await logoutEmployeeWithPin(employeeId, personalNumber);

      // Set logout time
      const now = new Date().toISOString();
      setLogoutTime(now);

      // Show popup
      setShowLogoutPopup(true);
    } catch (err: any) {
      console.error(err);
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-[260px] h-80 rounded-3xl shadow-xl text-center relative">
        {status === "LOGGED_IN_WITH_SCHEDULE" && schedule && (
          <div className=" flex flex-col justify-between w-[262px] h-80 pr-2 overflow-hidden">
            <h2 className="text-xl font-bold text-gray-200 bg-[#02505e] py-12 uppercase rounded-t-xl">
              Welcome, {employeeName}
            </h2>
            <CheckCircle className="w-10 h-10 text-teal-400 mx-auto my-4" />
            <p className="font-semibold text-[#02505e]">Schedule time</p>
            <p className="text-lg font-extrabold mt-1 text-[#02505e]">
              {formatTime(schedule.startTime)} – {formatTime(schedule.endTime)}
            </p>
            {/*  {loginTime && (
              <p className="text-sm text-gray-500 mt-2">
                Logged in at: {formatTime(loginTime)}
              </p>
            )} */}
            <button
              onClick={onClose}
              className="mt-5 w-full py-4 bg-[#02505e] text-gray-100 font-bold hover:bg-teal-700 rounded-b-2xl"
            >
              OK
            </button>
          </div>
        )}

        {status === "LOGGED_IN_NO_SCHEDULE" && (
          <div className="relative flex flex-col justify-between w-[260px] h-80 overflow-hidden rounded-2xl">
          
            <h2 className="text-xl font-bold text-gray-200 bg-[#02505e] py-4">
              Hi, {employeeName}
            </h2>
            <Info className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">You don’t have a schedule today</p>
            <p className="text-sm text-gray-600 mt-1">
              Do you want to log in anyway?
            </p>

            <div className="flex gap-3 mt-5 px-3">
              <button
                onClick={onConfirmLogin}
                className="flex-1 py-2 bg-bg-[#02505e] text-white font-bold hover:bg-teal-700 rounded"
              >
                Yes
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2 bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 rounded"
              >
                No
              </button>
            </div>
          </div>
        )}

        {status === "ALREADY_LOGGED_IN" && (
          <div className="relative flex flex-col justify-between w-[260px] h-80 overflow-hidden rounded-2xl">
            {/* Close (cross) button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-800 hover:text-white"
            >
              ✕
            </button>

            <div className="text-xl font-bold text-gray-200 bg-[#02505e] py-4 uppercase">
              <p>Hi, {employeeName}</p>
              <span className="text-xs font-light text-gray-400">
                id: {personalNumber}
              </span>
            </div>

            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto my-2" />
            <p className="font-semibold">Already logged in</p>
            <p className="text-sm text-gray-600">
              If you want to log out, click on Yes
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 w-full py-4 bg-[#02505e] text-white font-bold hover:bg-teal-700"
            >
              Yes
            </button>
          </div>
        )}
      </div>

      <LogoutThankYouPopup
        open={showLogoutPopup}
        employeeName={employeeName}
        loginTime={currentLoginTime ?? null} // <-- guaranteed string | null
        logoutTime={logoutTime ?? null} // <-- also string | null
        onClose={() => {
          setShowLogoutPopup(false);
          onClose();
        }}
      />
    </div>
  );
}
