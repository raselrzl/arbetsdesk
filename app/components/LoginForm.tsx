"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginEmployeeAction } from "../actions";

type Errors = { personalNumber?: string; pinNumber?: string };

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [personalNumber, setPersonalNumber] = useState("");
  
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ personalNumber: false, pinNumber: false });

  const search = useSearchParams();
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Combine PIN digits into a single string
  const pinNumber = pinDigits.join("");

  // Validation
  function validate(values = { personalNumber, pinNumber }): Errors {
    const next: Errors = {};
    if (!values.personalNumber.trim()) next.personalNumber = "Personal number is required.";
    if (!values.pinNumber) next.pinNumber = "PIN code is required.";
    else if (values.pinNumber.length !== 4) next.pinNumber = "PIN must be 4 digits.";
    return next;
  }

  function handleBlur(field: "personalNumber" | "pinNumber") {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors({ ...errors, ...validate() });
  }

  // Handle server errors
  useEffect(() => {
    const err = search.get("error");
    if (err === "notfound") {
      setErrors({ personalNumber: "User not found." });
      setTouched(t => ({ ...t, personalNumber: true }));
    } else if (err === "invalid") {
      setErrors({ pinNumber: "Invalid PIN code." });
      setTouched(t => ({ ...t, pinNumber: true }));
    }
  }, [search]);

  // Handle digit change and auto-focus
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);

    // focus next input
    if (value && index < 3) pinRefs[index + 1].current?.focus();
    // focus previous if empty
    if (!value && index > 0) pinRefs[index - 1].current?.focus();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await loginEmployeeAction({ personalNumber, pinNumber });
    } finally {
      setLoading(false);
    }
  }

  const showPersonalError = (touched.personalNumber || submitted) && !!errors.personalNumber;
  const showPinError = (touched.pinNumber || submitted) && !!errors.pinNumber;

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
  <div className="w-full max-w-md bg-gray-700 p-8 shadow-md rounded-md">
    <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">Login</h1>

    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {/* Personal Number */}
      <div className="grid gap-1.5">
        <Label className={`${showPersonalError ? "text-red-600" : "text-white"}`}>
          *Personal Number
        </Label>
        <Input
          type="number"
          name="personalNumber"
          value={personalNumber}
          onChange={(e) => setPersonalNumber(e.target.value)}
          onBlur={() => handleBlur("personalNumber")}
          min={100000000000} // example minimum
          max={999999999999} // example maximum
          className={`h-10 border rounded px-2 text-black bg-white placeholder-gray-400 ${
            showPersonalError ? "border-red-600" : "border-white"
          }`}
          disabled={loading}
          placeholder="000000000000"
        />
        {showPersonalError && <p className="text-sm text-red-600">{errors.personalNumber}</p>}
      </div>

      {/* PIN */}
      <div className="grid gap-1.5">
        <Label className={`${showPinError ? "text-red-600" : "text-white"}`}>
          *PIN
        </Label>
        <div className="flex gap-2 justify-center">
          {pinDigits.map((digit, i) => (
            <Input
              key={i}
              ref={pinRefs[i]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              placeholder="."
              value={digit}
              onChange={(e) => handlePinChange(i, e.target.value)}
              onBlur={() => handleBlur("pinNumber")}
              className={`w-12 h-12 text-center text-xl text-black bg-white border rounded ${
                showPinError ? "border-red-600" : "border-white"
              }`}
              disabled={loading}
            />
          ))}
        </div>
        {showPinError && <p className="text-sm text-red-600 text-center">{errors.pinNumber}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          disabled={loading}
          className="w-36 rounded-xs inline-flex items-center justify-center bg-gray-800 cursor-pointer"
        >
          {loading ? (
            <>
              Login <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Login <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  </div>
</div>

  );
}
