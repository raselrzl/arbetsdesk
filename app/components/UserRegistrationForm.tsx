"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction } from "../actions";
import React, { useState, useRef, useEffect } from "react";
import SubmitButton from "./SubmitButton";

const initialState = { success: false, message: "" };

export default function UserRegistrationForm() {
  const [state, formAction] = React.useActionState(
    createUserAction,
    initialState
  );

  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [confirmPinDigits, setConfirmPinDigits] = useState(["", "", "", ""]);
  const [showPinError, setShowPinError] = useState(false);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const confirmPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const pinValue = pinDigits.join("");
  const confirmPinValue = confirmPinDigits.join("");

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);
    if (value && index < 3) pinRefs[index + 1].current?.focus();
    if (!value && index > 0) pinRefs[index - 1].current?.focus();
    setShowPinError(
      confirmPinValue !== "" && confirmPinValue !== newDigits.join("")
    );
  };

  const handleConfirmPinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...confirmPinDigits];
    newDigits[index] = value;
    setConfirmPinDigits(newDigits);
    if (value && index < 3) confirmPinRefs[index + 1].current?.focus();
    if (!value && index > 0) confirmPinRefs[index - 1].current?.focus();
    setShowPinError(pinValue !== "" && pinValue !== newDigits.join(""));
  };

  // Reset all inputs after successful submission
  useEffect(() => {
    if (state.success) {
      // Reset all text inputs
      const form = document.querySelector("form");
      form?.reset();
      // Reset PINs
      setPinDigits(["", "", "", ""]);
      setConfirmPinDigits(["", "", "", ""]);
      setShowPinError(false);
    }
  }, [state.success]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <form
        action={formAction}
        className="space-y-6 max-w-md w-full bg-white p-8 rounded-xs shadow-lg border border-teal-200"
      >
        <h1 className="text-3xl font-extrabold text-teal-800 text-center mb-4 uppercase">
          User Registration
        </h1>

        {state.message && (
          <p
            className={`text-center font-medium ${
              state.success ? "text-green-400" : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        )}

        {/* Name */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Name</Label>
          <Input
            name="name"
            required
            placeholder="Enter a name"
            className="bg-white text-black border-teal-200 focus:border-teal-500 focus:ring-0 rounded-xs"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Email</Label>
          <Input
            name="email"
            type="email"
            required
            placeholder="Enter a valid email"
            className="bg-white text-black border-teal-200 focus:border-teal-500 focus:ring-0 rounded-xs"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Phone Number</Label>
          <Input
            name="phoneNumber"
            required
            className="bg-white text-black border-teal-200 focus:border-teal-500 focus:ring-0 rounded-xs"
          />
        </div>

        {/* Personal Number */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Personal Number</Label>
          <Input
            name="personalNumber"
            required
             className="bg-white text-black border-teal-200 focus:border-teal-500 focus:ring-0 rounded-xs"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Address</Label>
          <Input
            name="address"
            required
             className="bg-white text-black border-teal-200 focus:border-teal-500 focus:ring-0 rounded-xs"
          />
        </div>

        {/* PIN */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Enter a PIN (4 digits)</Label>
          <div className="flex gap-2 justify-center">
            {pinDigits.map((digit, i) => (
              <Input
                key={i}
                ref={pinRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                placeholder="•"
                value={digit}
                onChange={(e) => handlePinChange(i, e.target.value)}
                className="w-12 h-12 text-center text-xl text-black bg-white border border-teal-200 rounded-xs"
              />
            ))}
          </div>
        </div>

        {/* Confirm PIN */}
        <div className="flex flex-col gap-1">
          <Label className="text-gray-600">Confirm PIN</Label>
          <div className="flex gap-2 justify-center">
            {confirmPinDigits.map((digit, i) => (
              <Input
                key={i}
                ref={confirmPinRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                placeholder="•"
                value={digit}
                onChange={(e) => handleConfirmPinChange(i, e.target.value)}
                className={`w-12 h-12 text-center text-xl text-black bg-white border rounded-xs ${
                  showPinError ? "border-red-600" : "border-teal-200"
                }`}
              />
            ))}
          </div>
          {showPinError && (
            <p className="text-sm text-red-500 text-center">
              PINs do not match.
            </p>
          )}
        </div>

        {/* Role */}
        {/* <div className="flex flex-col gap-1">
          <Label className="text-gray-200">Role</Label>
          <select
            name="role"
            className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-0 px-2 py-1 rounded"
          >
            <option value="USER">User</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="COMPANY">Company</option>
          </select>
        </div>
 */}
        {/* Hidden combined PIN */}
        <input type="hidden" name="pinNumber" value={pinValue} />
        <input type="hidden" name="confirmPinNumber" value={confirmPinValue} />

        <div className="mt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
