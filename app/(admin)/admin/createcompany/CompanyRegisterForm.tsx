"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/app/components/SubmitButton";
import { registerCompanyAction } from "@/app/actions";

const initialState = {
  success: false,
  message: "",
};

export default function CompanyRegisterForm({ user }: { user: any }) {
  const [state, formAction] = React.useActionState(
    registerCompanyAction,
    initialState
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <form
        action={formAction}
        className="
          w-full max-w-md space-y-5
          bg-gray-800/90
          border border-gray-700
          p-6 rounded-2xl
          shadow-xl
        "
      >
        <h2 className="text-xl font-semibold text-gray-100 text-center">
          Create Company
        </h2>

        {state.message && (
          <p
            className={`text-sm text-center ${
              state.success
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        )}

        {/* OWNER INFO */}
        <div className="space-y-1">
          <Label className="text-gray-400">Owner Name</Label>
          <Input
            value={user.name}
            disabled
            className="
              bg-gray-700
              border-gray-600
              text-gray-300
              cursor-not-allowed
            "
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Owner Email</Label>
          <Input
            value={user.email}
            disabled
            className="
              bg-gray-700
              border-gray-600
              text-gray-300
              cursor-not-allowed
            "
          />
        </div>

        {/* COMPANY INFO */}
        <div className="space-y-1">
          <Label className="text-gray-400">Company Name</Label>
          <Input
            name="companyName"
            required
            className="
              bg-gray-900
              border-gray-700
              text-gray-100
              placeholder:text-gray-500
              focus:border-gray-500
              focus:ring-gray-500
            "
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Company Email</Label>
          <Input
            name="companyEmail"
            type="email"
            required
            className="
              bg-gray-900
              border-gray-700
              text-gray-100
              placeholder:text-gray-500
              focus:border-gray-500
              focus:ring-gray-500
            "
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Organization Number</Label>
          <Input
            name="organizationNo"
            required
            className="
              bg-gray-900
              border-gray-700
              text-gray-100
              placeholder:text-gray-500
              focus:border-gray-500
              focus:ring-gray-500
            "
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Login Code</Label>
          <Input
            name="loginCode"
            required
            className="
              bg-gray-900
              border-gray-700
              text-gray-100
              placeholder:text-gray-500
              focus:border-gray-500
              focus:ring-gray-500
            "
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Monthly Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            required
            className="
              bg-gray-900
              border-gray-700
              text-gray-100
              placeholder:text-gray-500
              focus:border-gray-500
              focus:ring-gray-500
            "
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
