"use client";

import React, { useState } from "react";
import { createEmployeeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="w-full bg-teal-600 hover:bg-teal-700 rounded-xs disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {pending ? "Creating..." : "Create Employee"}
    </Button>
  );
}


type Props = {
  company: {
    id: string;
    name: string;
    email: string;
  };
};

const initialState = { success: false, message: "" };

export default function CreateEmployeeForm({ company }: Props) {
  const [state, formAction] = React.useActionState(
    createEmployeeAction,
    initialState
  );

  const [contractType, setContractType] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const isPinValid = /^\d{4}$/.test(pin);
  const isPinMatch = pin === confirmPin;
  const canSubmit = isPinValid && isPinMatch;

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-xs border border-teal-100 shadow shadow-teal-100">
        <h1 className="text-2xl font-bold text-teal-700 text-center mb-1 uppercase">
          {company.name}
        </h1>

        <p className="text-sm text-teal-600 text-center mb-6">
          Add a New Employee
        </p>

        <form
          action={formAction}
          autoComplete="off"
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="John Doe"
              required
              className="rounded-xs"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              className="rounded-xs"
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              placeholder="9876543210"
              className="rounded-xs"
            />
          </div>

          {/* Personal Number */}
          <div>
            <Label>Personal Number</Label>
            <Input
              name="personalNumber"
              placeholder="Employee ID / Personal No."
              className="rounded-xs"
            />
          </div>

          {/* PIN + Confirm PIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>4-Digit PIN</Label>
              <Input
                name="pinCode"
                type="password"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="rounded-xs tracking-widest"
                required
              />
            </div>

            <div>
              <Label>Confirm PIN</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="rounded-xs tracking-widest"
                required
              />
            </div>
          </div>

          {/* PIN errors */}
          {!isPinValid && pin.length > 0 && (
            <p className="text-xs text-red-500">
              PIN must be exactly 4 digits
            </p>
          )}

          {isPinValid && !isPinMatch && confirmPin.length > 0 && (
            <p className="text-xs text-red-500">
              PINs do not match
            </p>
          )}

          {/* Contract Type */}
          <div>
            <Label>Contract Type</Label>
            <select
              name="contractType"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              required
              className="w-full h-10 px-3 border border-teal-200 rounded-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="">Select contract type</option>
              <option value="HOURLY">Hourly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          {/* Conditional Pay Inputs (REQUIRED when visible) */}
          {contractType === "HOURLY" && (
            <div>
              <Label>Hourly Rate</Label>
              <Input
                name="hourlyRate"
                type="number"
                step="0.01"
                placeholder="e.g. 15.50"
                required
                className="rounded-xs"
              />
            </div>
          )}

          {contractType === "MONTHLY" && (
            <div>
              <Label>Monthly Salary</Label>
              <Input
                name="monthlySalary"
                type="number"
                step="0.01"
                placeholder="e.g. 2500"
                required
                className="rounded-xs"
              />
            </div>
          )}

          {/* Message */}
          {state.message && (
            <p
              className={`text-sm ${
                state.success ? "text-teal-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          )}

          {/* Submit */}
          <SubmitButton disabled={!canSubmit} />
        </form>
      </div>
    </div>
  );
}
