"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { loginEmployeeWithPinByNumber } from "../companyactions";
import { useRouter } from "next/navigation";
import AuthStatusPopup from "./AuthStatusPopup";

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

      setAuthResult(result);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-9999 bg-teal-800 w-screen h-screen flex flex-col items-center justify-center px-4">
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
          <div className="mt-2 text-xl font-semibold">{dayName}</div>
          <div className="text-md text-gray-300">{fullDate}</div>
        </div>

        {/* INPUT */}
        <input
          className="w-full max-w-sm mb-6 border bg-white border-gray-300 px-3 py-3 h-14 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="YYYYMMDDXXXX"
          value={personalNumber}
          readOnly
        />

        {/* KEYPAD */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
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

      {authResult && (
        <AuthStatusPopup
          status={authResult.status}
          employeeName={authResult.employeeName}
          schedule={authResult.schedule}
          onClose={() => {
            setAuthResult(null); // 👈 hides popup
            setPersonalNumber("");
          }}
        />
      )}
    </>
  );
}
