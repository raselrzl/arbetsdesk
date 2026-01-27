import { getLatestSalarySlipForEmployee } from "../../salaryActions";

/* ---------------- TYPES ---------------- */
interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function SalarySlipPage({ params }: PageProps) {
  const { employeeId } = await params;

  // Fetch latest salary slip for this employee (company checked via cookie inside action)
  const slip = await getLatestSalarySlipForEmployee(employeeId);

  if (!slip) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500">
        No salary slip found for this employee.
      </div>
    );
  }

  const netPay = slip.totalPay - slip.tax;

  const { employee, company } = slip;
  const { person } = employee;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold uppercase text-center">Salary Slip</h1>

      {/* ---------------- Employee Information ---------------- */}
      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3 text-lg">Employee Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>Name:</span>
          <span>{person.name}</span>

          <span>Personal Number:</span>
          <span>{person.personalNumber || "-"}</span>

          <span>Email:</span>
          <span>{person.email || "-"}</span>

          <span>Phone:</span>
          <span>{person.phone || "-"}</span>

          <span>Address:</span>
          <span>{person.address || "-"}</span>

          <span>Postal Code:</span>
          <span>{person.postalCode || "-"}</span>

          <span>City:</span>
          <span>{person.city || "-"}</span>

          <span>Country:</span>
          <span>{person.country || "-"}</span>

          <span>Bank Name:</span>
          <span>{person.bankName || "-"}</span>

          <span>Account Number:</span>
          <span>{person.accountNumber || "-"}</span>

          <span>Clearing Number:</span>
          <span>{person.clearingNumber || "-"}</span>

          <span>Job Title:</span>
          <span>{employee.jobTitle || "-"}</span>

          <span>Contract Type:</span>
          <span>{employee.contractType}</span>

          <span>Employment Type:</span>
          <span>{employee.employmentType || "-"}</span>

          <span>Hourly Rate:</span>
          <span>{employee.hourlyRate?.toFixed(2) || "-"}</span>

          <span>Monthly Salary:</span>
          <span>{employee.monthlySalary?.toFixed(2) || "-"}</span>

          <span>Workplace:</span>
          <span>{employee.workplace || "-"}</span>

          <span>Working Status:</span>
          <span>{employee.workingStatus || "-"}</span>

          <span>Insurance:</span>
          <span>{employee.insurance ? "Yes" : "No"}</span>

          <span>Insurance Company:</span>
          <span>{employee.insuranceCompany || "-"}</span>

          <span>Financial Support:</span>
          <span>{employee.financialSupport ? "Yes" : "No"}</span>

          <span>Company Car:</span>
          <span>{employee.companyCar ? "Yes" : "No"}</span>

          <span>Meal Allowance:</span>
          <span>{employee.mealAllowance ? "Yes" : "No"}</span>

          <span>Union Fees:</span>
          <span>{employee.unionFees ? "Yes" : "No"}</span>

          <span>Net Deduction:</span>
          <span>{employee.netDeduction ? "Yes" : "No"}</span>

          <span>Job Start Date:</span>
          <span>{employee.jobStartDate ? new Date(employee.jobStartDate).toLocaleDateString() : "-"}</span>

          <span>Job End Date:</span>
          <span>{employee.jobEndDate ? new Date(employee.jobEndDate).toLocaleDateString() : "-"}</span>
        </div>
      </section>

      {/* ---------------- Company Information ---------------- */}
      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3 text-lg">Company Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>Company Name:</span>
          <span>{company.name}</span>

          <span>Email:</span>
          <span>{company.email || "-"}</span>

          <span>Organization Number:</span>
          <span>{company.organizationNo}</span>

          <span>Contract Details:</span>
          <span>{company.contractDetails || "-"}</span>

          <span>Price:</span>
          <span>{company.price.toFixed(2)}</span>

          <span>Payment Status:</span>
          <span>{company.paymentStatus}</span>

          <span>Payment Info:</span>
          <span>{company.paymentInfo || "-"}</span>

          <span>Admin Name:</span>
          <span>{company.user.name}</span>

          <span>Admin Email:</span>
          <span>{company.user.email}</span>
        </div>
      </section>

      {/* ---------------- Salary Details ---------------- */}
      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3 text-lg">Salary Details</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span>Total Hours</span>
          <span>{slip.totalHours}</span>

          <span>Total Minutes</span>
          <span>{slip.totalMinutes}</span>

          <span>Gross Salary</span>
          <span>{slip.totalPay.toFixed(2)}</span>

          <span>Tax</span>
          <span>{slip.tax.toFixed(2)}</span>

          <span>Other Costs</span>
          <span>{slip.othersCost?.toFixed(2) || "-"}</span>

          <span className="font-semibold">Net Salary</span>
          <span className="font-semibold">{netPay.toFixed(2)}</span>

          <span>Total Tips</span>
          <span>{slip.totalTips?.toFixed(2) || "0"}</span>
        </div>
      </section>

      {/* ---------------- Status & Metadata ---------------- */}
      <section className="border border-gray-200 p-4 rounded text-sm">
        <p>
          <strong>Status:</strong> {slip.status}
        </p>
        <p>
          <strong>Period:</strong> {slip.month}/{slip.year}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(slip.createdAt).toLocaleDateString()}
        </p>
        {slip.pdfUrl && (
          <p>
            <strong>PDF:</strong>{" "}
            <a href={slip.pdfUrl} className="text-blue-600 underline" target="_blank">
              Download
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
