"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/app/components/SubmitButton";
import { createEmployeeAction } from "@/app/actions";

const initialState = {
  success: false,
  message: "",
};

export default function CreateEmployeeForm() {
  const [state, formAction] = React.useActionState(
    createEmployeeAction,
    initialState
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white text-center">
          Create Employee
        </h2>

        {state.message && (
          <p
            className={`text-sm text-center ${
              state.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {state.message}
          </p>
        )}

        {/* Employee Name */}
        <div>
          <Label className="text-gray-300">Full Name</Label>
          <Input name="name" required />
        </div>

        {/* Email */}
        <div>
          <Label className="text-gray-300">Email</Label>
          <Input name="email" type="email" required />
        </div>

        {/* Phone */}
        <div>
          <Label className="text-gray-300">Phone Number</Label>
          <Input name="phoneNumber" required />
        </div>

        {/* Job Title */}
        <div>
          <Label className="text-gray-300">Job Title</Label>
          <Input name="jobTitle" required />
        </div>

        {/* Department */}
        <div>
          <Label className="text-gray-300">Department</Label>
          <Input name="department" required />
        </div>

        {/* PIN */}
        <div>
          <Label className="text-gray-300">Employee PIN (4 digits)</Label>
          <Input
            name="pinNumber"
            type="password"
            maxLength={4}
            inputMode="numeric"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
