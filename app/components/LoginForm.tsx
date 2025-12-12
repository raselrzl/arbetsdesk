"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginUserAction } from "../actions";

type Errors = { personalNumber?: string; pinNumber?: string };

export default function LoginForm() {
  const search = useSearchParams();

  const [personalNumber, setPersonalNumber] = useState("");
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    personalNumber: false,
    pinNumber: false,
  });

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const pinNumber = pinDigits.join("");

  // Handle server errors from query
  useEffect(() => {
    const err = search.get("error");
    if (err === "notfound") {
      setErrors({ personalNumber: "User not found." });
      setTouched((t) => ({ ...t, personalNumber: true }));
    } else if (err === "invalid") {
      setErrors({ pinNumber: "Invalid PIN code." });
      setTouched((t) => ({ ...t, pinNumber: true }));
    }
  }, [search]);

  function validate(values = { personalNumber, pinNumber }): Errors {
    const next: Errors = {};
    if (!values.personalNumber.trim())
      next.personalNumber = "Personal number is required.";
    if (!values.pinNumber) next.pinNumber = "PIN code is required.";
    else if (values.pinNumber.length !== 4)
      next.pinNumber = "PIN must be 4 digits.";
    return next;
  }

  function handleBlur(field: "personalNumber" | "pinNumber") {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors({ ...errors, ...validate() });
  }

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);

    if (value && index < 3) pinRefs[index + 1].current?.focus();
    if (!value && index > 0) pinRefs[index - 1].current?.focus();
  };

  const showPersonalError =
    (touched.personalNumber || submitted) && !!errors.personalNumber;
  const showPinError = (touched.pinNumber || submitted) && !!errors.pinNumber;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-teal-700 p-8 shadow-md rounded-md">
        <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">
          Login
        </h1>

        {/* Form submits directly to server action */}
        <form action={loginUserAction} className="grid gap-6" noValidate>
          {/* Personal Number */}
          <div className="grid gap-1.5">
            <Label
              className={`${showPersonalError ? "text-red-600" : "text-white"}`}
            >
              *Personal Number
            </Label>
            <Input
              type="number"
              name="personalNumber"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
              onBlur={() => handleBlur("personalNumber")}
              min={100000000000}
              max={999999999999}
              className={`h-10 border rounded px-2 text-black bg-white placeholder-gray-400 ${
                showPersonalError ? "border-red-600" : "border-white"
              }`}
              placeholder="000000000000"
            />
            {showPersonalError && (
              <p className="text-sm text-red-600">{errors.personalNumber}</p>
            )}
          </div>

          {/* PIN */}
          <div className="grid gap-1.5">
            <Label
              className={`${showPinError ? "text-red-600" : "text-white"}`}
            >
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
                />
              ))}
            </div>
            {showPinError && (
              <p className="text-sm text-red-600 text-center">
                {errors.pinNumber}
              </p>
            )}
          </div>

          {/* Hidden input to combine PIN digits */}
          <input type="hidden" name="pinNumber" value={pinNumber} />

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="w-36 rounded-xs inline-flex items-center justify-center bg-teal-900 cursor-pointer"
            >
              Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-md p-2 mt-6 text-sm text-gray-600 text-center bg-teal-50 rounded-lg">
        Having trouble logging in? Contact Personalkollen support at{" "}
        <a
          href="mailto:support@arbetsdesk.se"
          className="text-teal-800 hover:underline font-bold"
        >
          support@arbetsdesk.se
        </a>{" "}
       or  <span className="font-bold text-teal-800">010-150 00 00 </span> and we’ll help you!
      </div>
    </div>
  );
}
