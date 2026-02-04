/* "use client";

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
    initialState,
  );

  return (
    <div className="max-w-7xl flex items-center justify-center px-4">
      <form
        action={formAction}
        className="
          w-full max-w-md space-y-5
          bg-gray-800/90
          border border-teal-200
          p-6 rounded-xs
          shadow-xl
        "
      >
        <h2 className="text-xl font-semibold text-gray-100 text-center">
          Create Company
        </h2>

        {state.message && (
          <p
            className={`text-sm text-center ${
              state.success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        )}

        <div className="flex gap-2 justify-between">
          {" "}
          <div className="space-y-1">
            <Label className="text-gray-400">Owner Name</Label>
            <Input
              value={user.name}
              disabled
              className="
              bg-gray-700
              border-teal-200
              text-gray-300
              cursor-not-allowed
              rounded-xs
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
              border-teal-200
              text-gray-300
              cursor-not-allowed
              rounded-xs
            "
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-400">Company Name</Label>
          <Input
            name="companyName"
            required
            className="
              bg-gray-900
              border-teal-200
              text-gray-100
              placeholder:text-gray-500
              focus:border-teal-200
              focus:ring-gray-500
              rounded-xs
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
              border-teal-200
              text-gray-100
              placeholder:text-gray-500
              focus:border-teal-200
              focus:ring-gray-500
              rounded-xs
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
              border-teal-200
              text-gray-100
              placeholder:text-gray-500
              focus:border-teal-200
              focus:ring-gray-500
              rounded-xs
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
              border-teal-200
              text-gray-100
              placeholder:text-gray-500
              focus:border-teal-200
              focus:ring-gray-500
              rounded-xs
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
              border-teal-200
              text-gray-100
              placeholder:text-gray-500
              focus:border-teal-200
              focus:ring-gray-500
              rounded-xs
            "
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
 */

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
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState(
    registerCompanyAction,
    initialState,
  );

  // LOGIN CODE STATE
  const [code1, setCode1] = React.useState("");
  const [code2, setCode2] = React.useState("");
  const [codeError, setCodeError] = React.useState("");

  const handleCodeChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
      setter(value);
      setCodeError("");
    };

  const codesMatch =
    code1.length === 4 && code2.length === 4 && code1 === code2;

  /**
   * 🔁 RESET FORM AFTER SUCCESS
   */
  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset(); // clears uncontrolled inputs
      setCode1("");
      setCode2("");
      setCodeError("");
    }
  }, [state.success]);

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-10">
      <form
        ref={formRef}
        action={formAction}
        autoComplete="off"
        className="
          w-full
          max-w-md
          lg:max-w-2xl
          space-y-8
          bg-gray-800/90
          border border-teal-300/40
          p-6 lg:p-10
          rounded-xs
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-gray-100 uppercase">
            Created by
          </h2>
          <p className="text-xs text-gray-400">
            Company registration details
          </p>
        </div>

        {state.message && (
          <p
            className={`text-sm text-center ${
              state.success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        )}

        {/* OWNER INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-teal-300 uppercase border-b border-teal-300/30 pb-2">
            Owner Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-400">Owner Name</Label>
              <Input
                value={user.name}
                disabled
                autoComplete="off"
                className="bg-gray-700 border-teal-200 text-gray-300 cursor-not-allowed rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">Owner Email</Label>
              <Input
                value={user.email}
                disabled
                autoComplete="off"
                className="bg-gray-700 border-teal-200 text-gray-300 cursor-not-allowed rounded-xs"
              />
            </div>
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-teal-300 uppercase border-b border-teal-300/30 pb-2">
            Company Info
          </h3>

          <Input
            name="companyName"
            placeholder="Company Name"
            autoComplete="off"
            required
            className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
          />

          <Input
            name="companyEmail"
            type="email"
            placeholder="Company Email"
            autoComplete="off"
            required
            className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
          />

          <Input
            name="organizationNo"
            placeholder="Organization Number"
            autoComplete="off"
            required
            className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
          />
        </div>

        {/* SECURITY */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-teal-300 uppercase border-b border-teal-300/30 pb-2">
            Security
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={code1}
              onChange={handleCodeChange(setCode1)}
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="Pin Code"
              className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
            />

            <Input
              value={code2}
              onChange={handleCodeChange(setCode2)}
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="Confirm Pin"
              className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
            />
          </div>

          {codeError && (
            <p className="text-sm text-red-400 font-medium">{codeError}</p>
          )}

          <input
            type="hidden"
            name="loginCode"
            value={codesMatch ? code1 : ""}
          />
        </div>

        {/* BILLING */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-teal-300 uppercase border-b border-teal-300/30 pb-2">
            Billing
          </h3>

          <Input
            name="price"
            type="number"
            step="0.01"
            placeholder="Monthly Price"
            autoComplete="off"
            required
            className="bg-gray-900 border-teal-200 text-gray-100 rounded-xs"
          />
        </div>

        <SubmitButton disabled={!codesMatch} />
      </form>
    </div>
  );
}
