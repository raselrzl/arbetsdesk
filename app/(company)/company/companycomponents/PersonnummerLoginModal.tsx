"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
/* import {
  confirmEarlyStartAtSchedule,
  confirmEarlyStartNow,
  confirmLoginWithoutSchedule,
  loginEmployeeWithPinByNumber,
} from "../companyactions"; */

import { useRouter } from "next/navigation";
import AuthStatusPopup from "./AuthStatusPopup";
import EarlyLoginChoicePopup from "./EarlyLoginChoicePopup";
import {
  confirmEarlyStartAtSchedule,
  confirmEarlyStartNow,
  confirmLoginWithoutSchedule,
  loginEmployeeWithPinByNumber,
} from "../timelogaction";
import Image from "next/image";

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
  const [authResult, setAuthResult] = useState<any>(null);
  const [earlyLoginData, setEarlyLoginData] = useState<any>(null);
  const [loginTime, setLoginTime] = useState<string | null>(null);

  const router = useRouter();

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
        company.id,
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
      <div className="fixed inset-0 z-9999 grid grid-rows-[35%_65%] h-screen">
        {/* HEADER 30% */}
        <div className="bg-[#024a57] relative flex flex-col justify-center items-center text-center p-4">
          <div className="flex justify-between w-full px-4 absolute top-4 left-0 right-0">
            <h1 className="text-2xl sm:text-3xl uppercase font-bold text-gray-100">
              ARBET-DESK
            </h1>
            <button
              onClick={onClose}
              className="text-2xl font-bold text-gray-100 hover:text-gray-200 active:text-gray-300"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* CLOCK + DATE */}
          <div className="flex flex-col items-center justify-center mt-16">
            <div className="text-6xl sm:text-7xl font-bold text-gray-100">
              {clockTime}
            </div>
            <div className="text-lg sm:text-xl text-gray-100 mt-2">
              {dayName}, {fullDate}
            </div>
          </div>
        </div>

        {/* BODY 70% */}
        <div className="bg-gray-200 flex flex-col">
          {/* Input, Keypad and Login button */}
          <div className="flex flex-col flex-1">
            {/* Personal Number Input */}
            <div className="flex-1 bg-white border-b-2">
              <input
                className="w-full h-full text-center text-2xl sm:text-3xl font-mono tracking-widest bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="YYYYMMDDXXXX"
                value={personalNumber}
                readOnly
              />
            </div>

            <div className="flex-3 flex justify-center bg-gary-100">
              <div className="grid grid-rows-4 grid-cols-3 gap-0.5 w-full max-w-5xl bg-white shadow-lg shadow-gray-700">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    disabled={loading}
                    onClick={() => {
                      if (personalNumber.length < 12)
                        setPersonalNumber(personalNumber + num);
                    }}
                    className="w-full h-full bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Image
                      src={`/k/${num}.png`}
                      alt={`${num}`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </button>
                ))}

                <button
                  disabled={loading}
                  onClick={() => setPersonalNumber("")}
                  className="w-full h-full bg-red-500 text-3xl font-bold text-white hover:bg-red-600 active:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Image
                    src="/k/c.png"
                    alt="c"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    if (personalNumber.length < 12)
                      setPersonalNumber(personalNumber + "0");
                  }}
                  className="w-full h-full bg-gray-100 text-3xl font-bold hover:bg-gray-200 active:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Image
                    src="/k/0.png"
                    alt="0"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </button>
                <button
                  disabled={loading}
                  onClick={() => setPersonalNumber(personalNumber.slice(0, -1))}
                  className="w-full h-full bg-yellow-400 text-3xl font-bold hover:bg-yellow-500 active:bg-yellow-600 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                 <Image
                    src="/k/x.png"
                    alt="X"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex-1">
              <button
                onClick={submitLogin}
                disabled={loading || personalNumber.length < 12}
                className="w-full h-full text-2xl uppercase font-bold text-white bg-[#024a57] transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Login / Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Early Login & Auth Status Popups */}
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
            router.refresh();
          }}
          onStartAtSchedule={async () => {
            await confirmEarlyStartAtSchedule(
              earlyLoginData.employeeId,
              company!.id,
              new Date(earlyLoginData.schedule.startTime),
            );
            setEarlyLoginData(null);
            setAuthResult({
              status: "LOGGED_IN_WITH_SCHEDULE",
              employeeName: earlyLoginData.employeeName,
              schedule: earlyLoginData.schedule,
            });
            setPersonalNumber("");
            router.refresh();
          }}
        />
      )}

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
              company!.id,
            );
            setAuthResult(null);
            setPersonalNumber("");
            router.refresh();
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
