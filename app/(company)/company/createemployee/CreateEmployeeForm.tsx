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
          <div className="border p-6 max-w-lg gap-2 bg-white">
            {" "}
            <input type="hidden" name="companyId" value={company.id} />
            {/* Identity */}
            <h1 className="text-xl font-bold">Identity</h1>
            <div>
              <Label>Name</Label>
              <Input name="name" placeholder="John Doe" required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" placeholder="john@example.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" placeholder="9876543210" />
            </div>
            <div>
              <Label>Personal Number</Label>
              <Input
                name="personalNumber"
                placeholder="ID / Personal No."
                required
              />
            </div>
            {/* PIN */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>PIN</Label>
                <Input
                  name="pinCode"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Confirm PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  required
                />
              </div>
            </div>
            {!isPinValid && pin.length > 0 && (
              <p className="text-red-500 text-xs">PIN must be 4 digits</p>
            )}
            {isPinValid && !isPinMatch && confirmPin.length > 0 && (
              <p className="text-red-500 text-xs">PINs do not match</p>
            )}
          </div>

          <div className="border p-6 max-w-lg bg-white">
            {" "}
            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input name="address" />
            </div>
            <div>
              <Label>City</Label>
              <Input name="city" />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input name="postalCode" />
            </div>
            <div>
              <Label>Country</Label>
              <Input name="country" />
            </div>
          </div>

          <div className="border p-6 max-w-lg bg-white">
            {/* Employment */}
            <h1 className="text-xl font-bold">Employment</h1>
            <div>
              <Label>Employment Type</Label>
              <select
                name="employmentType"
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value as EmploymentType)
                }
                required
              >
                <option value="">Select</option>
                <option value="PERMANENT">PERMANENT</option>
                <option value="INTERN">INTERN</option>
                <option value="TEMPORARY">TEMPORARY</option>
                <option value="PROVISIONARY">PROVISIONARY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>{" "}
            {/* Contract */}
            <div>
              <Label>Salary Type</Label>
              <select
                name="contractType"
                value={contractType}
                onChange={(e) =>
                  setContractType(e.target.value as ContractType)
                }
                required
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
              />
            )}
            {contractType === "MONTHLY" && (
              <Input
                name="monthlySalary"
                type="text"
                placeholder="Monthly salary"
                required
              />
            )}
            <div>
              <Label>Job Title</Label>
              <Input name="jobTitle" />
            </div>
            <div>
              <Label>Workplace</Label>
              <Input name="workplace" />
            </div>
            <div>
              <Label>Working Status</Label>
              <select
                name="workingStatus"
                value={workingStatus}
                onChange={(e) =>
                  setWorkingStatus(e.target.value as WorkingStatus)
                }
                required
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

          <div className="border p-6 max-w-lg bg-white">
            {/* Benefits */}
            <h1 className="text-xl font-bold">Benefits & Deductions</h1>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="insurance"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
              />
              <Label>Insurance</Label>
            </div>
            {insurance && (
              <Input name="insuranceCompany" placeholder="Insurance company" />
            )}
            <div className="grid grid-cols-2 gap-2">
              <label>
                <input
                  type="checkbox"
                  name="financialSupport"
                  checked={financialSupport}
                  onChange={(e) => setFinancialSupport(e.target.checked)}
                />{" "}
                Financial Support
              </label>
              <label>
                <input
                  type="checkbox"
                  name="companyCar"
                  checked={companyCar}
                  onChange={(e) => setCompanyCar(e.target.checked)}
                />{" "}
                Company Car
              </label>
              <label>
                <input
                  type="checkbox"
                  name="mealAllowance"
                  checked={mealAllowance}
                  onChange={(e) => setMealAllowance(e.target.checked)}
                />{" "}
                Meal Allowance
              </label>
              <label>
                <input
                  type="checkbox"
                  name="unionFees"
                  checked={unionFees}
                  onChange={(e) => setUnionFees(e.target.checked)}
                />{" "}
                Union Fees
              </label>
              <label>
                <input
                  type="checkbox"
                  name="netDeduction"
                  checked={netDeduction}
                  onChange={(e) => setNetDeduction(e.target.checked)}
                />{" "}
                Net Deduction
              </label>
            </div>
          </div>

          <div className="border p-6 max-w-lg bg-white">
            {/* Bank */}
            <div>
              <Label>Bank Name</Label>
              <Input name="bankName" />
            </div>
            <div>
              <Label>Clearing Number</Label>
              <Input name="clearingNumber" />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input name="accountNumber" />
            </div>
          </div>

          {/* Job dates */}
          <div className="border p-6 max-w-lg bg-white">
            {" "}
            <div>
              <Label>Job Start Date</Label>
              <Input type="date" name="jobStartDate" />
            </div>
            <div>
              <Label>Job End Date</Label>
              <Input type="date" name="jobEndDate" />
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
