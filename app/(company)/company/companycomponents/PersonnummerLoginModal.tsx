"use client";

import { useState } from "react";
import { loginEmployeeWithPinByNumber } from "../companyactions";

export default function PersonnummerLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [personalNumber, setPersonalNumber] = useState("");

  if (!open) return null;

  const submitLogin = async () => {
    try {
      await loginEmployeeWithPinByNumber(personalNumber);
      setPersonalNumber("");
      onClose();
      location.reload();
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-30 p-2">
      <div className="bg-white w-full max-w-xs p-4 rounded-xs shadow-xl flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <h3 className="text-lg font-bold mb-3 text-center text-teal-600">
          Enter Personal Number
        </h3>

        <input
          className="w-full mb-3 border border-teal-100 px-2 py-1 rounded-xs h-12 text-center text-base font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="YYYYMMDDXXXX"
          value={personalNumber}
          readOnly
        />

        {/* 🔢 IDENTICAL KEYPAD */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => {
                if (personalNumber.length < 12)
                  setPersonalNumber(personalNumber + num);
              }}
              className="p-4 w-full bg-gray-100 rounded-md text-md font-semibold hover:bg-gray-200 transition flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPersonalNumber("")}
            className="p-4 w-full bg-red-400 rounded-md text-lg font-semibold text-white hover:bg-red-500 transition flex items-center justify-center"
          >
            C
          </button>

          <button
            onClick={() => {
              if (personalNumber.length < 12)
                setPersonalNumber(personalNumber + "0");
            }}
            className="p-4 w-full bg-gray-100 rounded-md text-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={() => setPersonalNumber(personalNumber.slice(0, -1))}
            className="p-4 w-full bg-yellow-400 rounded-md text-lg font-semibold hover:bg-yellow-500 transition flex items-center justify-center"
          >
            x
          </button>
        </div>

        <button
          onClick={submitLogin}
          className="mt-3 bg-teal-600 py-3 rounded-sm text-white text-lg font-bold hover:bg-teal-700 transition w-full max-w-[250px] cursor-pointer"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
