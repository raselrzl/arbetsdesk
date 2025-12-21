"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginEmployeeWithPinByNumber } from "../companyactions";
import RealClock from "./RealClock";

export default function PersonnummerLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [personalNumber, setPersonalNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const today = new Date();
  const dayName = today.toLocaleDateString("en-GB", { weekday: "long" });
  const fullDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const submitLogin = async () => {
    if (loading || personalNumber.length < 12) return;

    try {
      setLoading(true);
      await loginEmployeeWithPinByNumber(personalNumber);
      setPersonalNumber("");
      alert("Login successful");
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black w-screen h-screen flex flex-col items-center justify-center px-4">
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800"
        aria-label="Close"
      >
        ×
      </button>

      {/* 🕒 BIG CLOCK */}
      <div className="mb-8 text-center">
        <div className="">
          <RealClock />
        </div>

        <div className=" text-xl font-semibold text-gray-700">
          {dayName}
        </div>
        <div className="text-md text-gray-500">{fullDate}</div>
      </div>

      {/* INPUT */}
      <input
        className="w-full max-w-sm mb-6 border bg-white border-teal-200 px-3 py-3 h-14 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder="YYYYMMDDXXXX"
        value={personalNumber}
        readOnly
      />

      {/* 🔢 KEYPAD */}
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

      {/* ENTER */}
      <button
        onClick={submitLogin}
        disabled={loading || personalNumber.length < 12}
        className="mt-6 bg-teal-600 py-4 text-white text-xl font-bold hover:bg-teal-700 transition w-full max-w-sm flex items-center justify-center disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enter"}
      </button>
    </div>
  );
}
