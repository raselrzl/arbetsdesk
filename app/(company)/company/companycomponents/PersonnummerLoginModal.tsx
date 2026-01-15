"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  confirmEarlyStartAtSchedule,
  confirmEarlyStartNow,
  confirmLoginWithoutSchedule,
  loginEmployeeWithPinByNumber,
} from "../companyactions";
import { useRouter } from "next/navigation";
import AuthStatusPopup from "./AuthStatusPopup";
import EarlyLoginChoicePopup from "./EarlyLoginChoicePopup";

export default function PersonnummerLoginModal({
  open,
  onClose,
  company,
}: {
  open: boolean;
  onClose: () => void;
  company: { id: string; name: string } | null;
}) {
  const [personalNumber, setPersonalNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [statusPopup, setStatusPopup] = useState<null | any>(null);
  const [authResult, setAuthResult] = useState<any>(null);
  const [earlyLoginData, setEarlyLoginData] = useState<any>(null);

  const [loginTime, setLoginTime] = useState<string | null>(null);

  const router = useRouter();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!open) return null;

  const dayName = time.toLocaleDateString("en-GB", { weekday: "long" });
  const fullDate = time.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const clockTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const submitLogin = async () => {
    if (loading || personalNumber.length < 12) return;
    if (!company) return;

    try {
      setLoading(true);
      const result = await loginEmployeeWithPinByNumber(
        personalNumber,
        company.id
      );

      if (result.status === "EARLY_LOGIN_CHOICE_REQUIRED") {
        setEarlyLoginData(result);
      } else {
        setAuthResult(result);
        setLoginTime(new Date().toISOString());
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-9999 bg-teal-950 w-screen h-screen flex flex-col items-center justify-center px-4">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-bold text-gray-300 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>

        {/* 🕒 CLOCK */}
        <div className="mb-8 text-center text-white">
          <div className="text-6xl md:text-7xl font-bold">{clockTime}</div>
          <div className="text-md text-gray-300 text-right">
            {dayName}, <span className="mr-2">{fullDate}</span>
          </div>
          <div className="mt-2 text-xl font-semibold text-right"></div>
        </div>

        {/* INPUT */}
        <input
          className="w-full max-w-sm mb-6 border bg-white border-gray-300 px-3 py-3 h-14 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="YYYYMMDDXXXX"
          value={personalNumber}
          readOnly
        />

        {/* KEYPAD */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm border">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              disabled={loading}
              onClick={() => {
                if (personalNumber.length < 12)
                  setPersonalNumber(personalNumber + num);
              }}
              className="h-16 bg-gray-100 text-xl font-bold hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50"
            >
              {num}
            </button>
          ))}

          <button
            disabled={loading}
            onClick={() => setPersonalNumber("")}
            className="h-16 bg-red-500 text-xl font-bold text-white hover:bg-red-600 transition flex items-center justify-center disabled:opacity-50"
          >
            C
          </button>

          <button
            disabled={loading}
            onClick={() => {
              if (personalNumber.length < 12)
                setPersonalNumber(personalNumber + "0");
            }}
            className="h-16 bg-gray-100 text-xl font-bold hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50"
          >
            0
          </button>

          <button
            disabled={loading}
            onClick={() => setPersonalNumber(personalNumber.slice(0, -1))}
            className="h-16 bg-yellow-400 text-xl font-bold hover:bg-yellow-500 transition flex items-center justify-center disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* ENTER BUTTON */}
        <button
          onClick={submitLogin}
          disabled={loading || personalNumber.length < 12}
          className="mt-6 bg-teal-600 py-4 text-white text-xl font-bold hover:bg-teal-700 transition w-full max-w-sm flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enter"}
        </button>
      </div>

      {/* Show Early Login choice only if authResult is null */}
      {earlyLoginData && !authResult && (
        <EarlyLoginChoicePopup
          employeeName={earlyLoginData.employeeName}
          schedule={earlyLoginData.schedule}
          loginTime={loginTime || undefined}
          onStartNow={async () => {
            await confirmEarlyStartNow(earlyLoginData.employeeId, company!.id);
            setEarlyLoginData(null);
            setAuthResult({
              status: "LOGGED_IN_WITH_SCHEDULE",
              employeeName: earlyLoginData.employeeName,
              schedule: earlyLoginData.schedule,
            });
            setPersonalNumber("");
            router.refresh(); // refresh UI immediately
          }}
          onStartAtSchedule={async () => {
            await confirmEarlyStartAtSchedule(
              earlyLoginData.employeeId,
              company!.id,
              new Date(earlyLoginData.schedule.startTime)
            );
            setEarlyLoginData(null);
            setAuthResult({
              status: "LOGGED_IN_WITH_SCHEDULE",
              employeeName: earlyLoginData.employeeName,
              schedule: earlyLoginData.schedule,
            });
            setPersonalNumber("");
            router.refresh(); // refresh UI immediately
          }}
        />
      )}

      {/* Show AuthStatusPopup only if earlyLoginData is null */}
      {authResult && !earlyLoginData && (
        <AuthStatusPopup
          status={authResult.status}
          employeeName={authResult.employeeName}
          personalNumber={authResult.personalNumber}
          employeeId={authResult.employeeId}
          schedule={authResult.schedule}
          loginTime={loginTime || undefined}
          onConfirmLogin={async () => {
            await confirmLoginWithoutSchedule(
              authResult.employeeId,
              company!.id
            );
            setAuthResult(null);
            setPersonalNumber("");
            router.refresh(); // refresh UI immediately
          }}
          onClose={() => {
            setAuthResult(null);
            setPersonalNumber("");
          }}
        />
      )}
    </>
  );
}
