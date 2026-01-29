"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployeeAction } from "./createEmployeeFormAction";
import { ContractType, EmploymentType, WorkingStatus } from "@prisma/client";

type Props = {
  company: {
    id: string;
    name: string;
    email: string;
  };
};

type FormState = {
  success: boolean;
  message: string;
};

export default function CreateEmployeeForm({ company }: Props) {
  const [state, setState] = useState<FormState>({
    success: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Local state for selects and checkboxes
  const [contractType, setContractType] = useState<ContractType | "">("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");
  const [workingStatus, setWorkingStatus] = useState<WorkingStatus | "">("");
  const [insurance, setInsurance] = useState(true);
  const [financialSupport, setFinancialSupport] = useState(false);
  const [companyCar, setCompanyCar] = useState(false);
  const [mealAllowance, setMealAllowance] = useState(false);
  const [unionFees, setUnionFees] = useState(false);
  const [netDeduction, setNetDeduction] = useState(false);

  // PIN
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const isPinValid = /^\d{4}$/.test(pin);
  const isPinMatch = pin === confirmPin;
  const canSubmit = isPinValid && isPinMatch;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const form = Object.fromEntries(formData.entries()) as Record<
        string,
        string
      >;

      const data = {
        companyId: form.companyId,
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        personalNumber: form.personalNumber,
        pinCode: form.pinCode || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country || undefined,
        contractType: contractType as ContractType,
        hourlyRate: contractType === "HOURLY" ? form.hourlyRate : undefined,
        monthlySalary:
          contractType === "MONTHLY" ? form.monthlySalary : undefined,
        jobTitle: form.jobTitle || undefined,
        workplace: form.workplace || undefined,
        employmentType: employmentType || undefined,
        workingStatus: workingStatus || undefined,
        insurance,
        insuranceCompany: form.insuranceCompany || undefined,
        financialSupport,
        companyCar,
        mealAllowance,
        unionFees,
        netDeduction,
        bankName: form.bankName || undefined,
        clearingNumber: form.clearingNumber || undefined,
        accountNumber: form.accountNumber || undefined,
        jobStartDate: form.jobStartDate || undefined,
        jobEndDate: form.jobEndDate || undefined,
      };

      const result = await createEmployeeAction(data);
      setState(result);

      if (result.success) {
        alert("Employee created successfully!");
      }
    } catch (err: any) {
      setState({
        success: false,
        message: err.message || "Failed to create employee",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4 py-20">
      <div className="w-full max-w-7xl p-4">
        <h1 className="text-2xl font-bold text-teal-700 text-center mb-1 uppercase">
          {company.name}
        </h1>
        <p className="text-sm text-teal-600 text-center mb-6">
          Add a New Employee
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          autoComplete="off"
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 "
        >
          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-5">
            <input type="hidden" name="companyId" value={company.id} />

            {/* Identity */}
            <h1 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Identity
            </h1>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Name</Label>
              <Input
                name="name"
                placeholder="John Doe"
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Phone</Label>
              <Input
                name="phone"
                placeholder="9876543210"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Personal Number</Label>
              <Input
                name="personalNumber"
                placeholder="ID / Personal No."
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            {/* PIN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">PIN</Label>
                <Input
                  name="pinCode"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Confirm PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  required
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>
            </div>

            {!isPinValid && pin.length > 0 && (
              <p className="text-red-500 text-xs mt-1">PIN must be 4 digits</p>
            )}

            {isPinValid && !isPinMatch && confirmPin.length > 0 && (
              <p className="text-red-500 text-xs mt-1">PINs do not match</p>
            )}
          </div>

          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-4">
            {/* Address */}
            <h1 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Address
            </h1>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Address</Label>
              <Input
                name="address"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">City</Label>
              <Input
                name="city"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Postal Code</Label>
              <Input
                name="postalCode"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Country</Label>
              <Input
                name="country"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>
          </div>

          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-4">
            {/* Employment */}
            <h1 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Employment
            </h1>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Employment Type</Label>
              <select
                name="employmentType"
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value as EmploymentType)
                }
                required
                className="border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
              >
                <option value="">Select</option>
                <option value="PERMANENT">PERMANENT</option>
                <option value="INTERN">INTERN</option>
                <option value="TEMPORARY">TEMPORARY</option>
                <option value="PROVISIONARY">PROVISIONARY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            {/* Contract */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Salary Type</Label>
              <select
                name="contractType"
                value={contractType}
                onChange={(e) =>
                  setContractType(e.target.value as ContractType)
                }
                required
                className="border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
              >
                <option value="">Select salary type</option>
                <option value="HOURLY">Hourly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            {contractType === "HOURLY" && (
              <Input
                name="hourlyRate"
                type="text"
                placeholder="Hourly rate"
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            )}

            {contractType === "MONTHLY" && (
              <Input
                name="monthlySalary"
                type="text"
                placeholder="Monthly salary"
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            )}

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Job Title</Label>
              <Input
                name="jobTitle"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Workplace</Label>
              <Input
                name="workplace"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Working Status</Label>
              <select
                name="workingStatus"
                value={workingStatus}
                onChange={(e) =>
                  setWorkingStatus(e.target.value as WorkingStatus)
                }
                required
                className="border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
              >
                <option value="">Select</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="TERMINATED">TERMINATED</option>
                <option value="LEAVE">LEAVE</option>
                <option value="PENDING">PENDING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-4">
            {/* Benefits */}
            <h1 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Benefits & Deductions
            </h1>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="insurance"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
                className="accent-black"
              />
              <Label className="text-sm text-gray-700">Insurance</Label>
            </div>

            {insurance && (
              <Input
                name="insuranceCompany"
                placeholder="Insurance company"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="financialSupport"
                  checked={financialSupport}
                  onChange={(e) => setFinancialSupport(e.target.checked)}
                  className="accent-black"
                />
                Financial Support
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="companyCar"
                  checked={companyCar}
                  onChange={(e) => setCompanyCar(e.target.checked)}
                  className="accent-black"
                />
                Company Car
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="mealAllowance"
                  checked={mealAllowance}
                  onChange={(e) => setMealAllowance(e.target.checked)}
                  className="accent-black"
                />
                Meal Allowance
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="unionFees"
                  checked={unionFees}
                  onChange={(e) => setUnionFees(e.target.checked)}
                  className="accent-black"
                />
                Union Fees
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="netDeduction"
                  checked={netDeduction}
                  onChange={(e) => setNetDeduction(e.target.checked)}
                  className="accent-black"
                />
                Net Deduction
              </label>
            </div>
          </div>

          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-4">
            {/* Bank */}
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Bank Details
            </h2>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Bank Name</Label>
              <Input
                name="bankName"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Clearing Number</Label>
              <Input
                name="clearingNumber"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Account Number</Label>
              <Input
                name="accountNumber"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>
          </div>

          {/* Job dates */}
          <div className="border border-gray-200 p-6 max-w-lg bg-white space-y-4">
            <h1 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Job Dates
            </h1>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Job Start Date</Label>
              <Input
                type="date"
                name="jobStartDate"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Job End Date</Label>
              <Input
                type="date"
                name="jobEndDate"
                className="rounded-none border-gray-300 focus:border-black focus:ring-0"
              />
            </div>
          </div>

          {/* Message */}
          {state.message && (
            <p className={state.success ? "text-teal-600" : "text-red-600"}>
              {state.message}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-30 bg-teal-800 hover:bg-teal-900 flex items-center justify-center gap-2 rounded-none"
          >
            {loading
              ? "Creating..."
              : canSubmit
                ? "Create Employee"
                : "Invalid PIN"}
          </Button>
        </form>
      </div>
    </div>
  );
}
