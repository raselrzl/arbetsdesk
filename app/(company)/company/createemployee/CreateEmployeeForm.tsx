"use client";

import React from "react";
import { createEmployeeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Add New Employee
        </h1>

        {/* ✅ Context info */}
        <p className="text-sm text-gray-600 text-center mb-6">
          Company: <span className="font-medium">{company.name}</span>
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" required />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" type="email" />
          </div>

          <div>
            <Label>Phone</Label>
            <Input name="phone" />
          </div>

          <div>
            <Label>Personal Number</Label>
            <Input name="personalNumber" />
          </div>

          <div>
            <Label>PIN Code</Label>
            <Input name="pinCode" type="password" required />
          </div>

          <div>
            <Label>Contract Type</Label>
            <select
              name="contractType"
              className="w-full border rounded h-10 px-2"
              required
            >
              <option value="">Select</option>
              <option value="HOURLY">Hourly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div>
            <Label>Hourly Rate</Label>
            <Input name="hourlyRate" type="number" step="0.01" />
          </div>

          <div>
            <Label>Monthly Salary</Label>
            <Input name="monthlySalary" type="number" step="0.01" />
          </div>

          {state.message && (
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          )}

          <Button type="submit" className="w-full">
            Create Employee
          </Button>
        </form>
      </div>
    </div>
  );
}
