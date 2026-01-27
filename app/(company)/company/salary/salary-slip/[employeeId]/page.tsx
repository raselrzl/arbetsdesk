import { getLatestSalarySlipForEmployee } from "../../salaryActions";

/* ---------------- TYPES ---------------- */
interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function SalarySlipPage({ params }: PageProps) {
  const { employeeId } = await params;

  const slip = await getLatestSalarySlipForEmployee(employeeId);

  if (!slip) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500">
        No salary slip found for this employee.
      </div>
    );
  }

  const { employee, company } = slip;
  const { person } = employee;

  const netPay = slip.totalPay - slip.tax;

  const monthName = new Date(slip.year, slip.month - 1).toLocaleString(
    "default",
    { month: "long" },
  );

  const periodStart = new Date(slip.year, slip.month - 1, 1);
  const periodEnd = new Date(slip.year, slip.month, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-20 mb-18">
      <section className="flex justify-between items-start mb-20">
        <div className="">
          <h2 className="text-xl font-bold">{company.name}</h2>
        </div>
        <div className="flex flex-col gap-1 items-start pr-24">
          <h1 className="text-2xl font-bold uppercase">Salary Slip</h1>
          <p className="text-sm text-gray-600">
            {monthName} {slip.year}
          </p>
        </div>
      </section>
      <section className="flex justify-between items-start mb-20">
        {/* LEFT SIDE */}
        <div className="flex flex-col text-left">
          <span>Name: {person.name}</span>
          <span>Personal Number: {person.personalNumber || "-"}</span>
          <span>Email: {person.email || "-"}</span>
          <span>Phone: {person.phone || "-"}</span>
          <span>Address: {person.address || "-"}</span>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex flex-col items-start">
          <div className="flex gap-2 text-left">
            <span>Bank Name:</span>
            <span>{person.bankName || "-"}</span>
          </div>

          <div className="flex gap-2">
            <span>Period:</span>
            <span>{periodStart.toLocaleDateString()}</span>-
            <span>{periodEnd.toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <span>Winthdraw:</span>
            <span>{periodStart.toLocaleDateString()}</span>
          </div>
          <div className="flex flex-row gap-2">
            <span>Account Number:</span>
            <span>
              {person.clearingNumber || ""}-{person.accountNumber || ""}
            </span>
          </div>
        </div>
      </section>

      <section className="">
        <div className="flex gap-2 mb-2 text-sm font-bold">
          <span>Period:</span>
          <span>{periodStart.toLocaleDateString()}</span>-
          <span>{periodEnd.toLocaleDateString()}</span>
        </div>

        {/* ================= HOURLY TABLE ================= */}
        {employee.contractType === "HOURLY" && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-teal-200">
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-right">Hours</th>
                <th className="border p-2 text-right">Hourly Rate</th>
                <th className="border p-2 text-right">Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-teal-200 p-2">
                  {employee.contractType}
                </td>
                <td className="border border-teal-200 p-2 text-right">
                  {slip.totalHours.toFixed(2)}
                </td>
                <td className="border border-teal-200 p-2 text-right">
                  {employee.hourlyRate?.toFixed(2)}
                </td>
                <td className="border border-teal-200 p-2 text-right font-semibold">
                  {slip.totalPay.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* ================= MONTHLY TABLE ================= */}
        {employee.contractType === "MONTHLY" && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-teal-200">
                <th className="border border-teal-200 p-2 text-left">Type</th>
                <th className="border border-teal-200  p-2 text-right">Monthly Salary</th>
                <th className="border border-teal-200  p-2 text-right">Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-teal-200 p-2">
                  {employee.contractType}
                </td>
                <td className="border border-teal-200 p-2 text-right">
                  {employee.monthlySalary?.toFixed(2)}
                </td>
                <td className="border border-teal-200 p-2 text-right font-semibold">
                  {slip.totalPay.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      {/* ================= EMPLOYEE INFORMATION ================= */}
      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3 text-lg">Employee Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>Postal Code:</span>
          <span>{person.postalCode || "-"}</span>

          <span>City:</span>
          <span>{person.city || "-"}</span>

          <span>Country:</span>
          <span>{person.country || "-"}</span>

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
        </div>
      </section>

      {/* ================= COMPANY INFORMATION ================= */}
      <section className="border border-teal-200 p-4 rounded">
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
        </div>
      </section>

      {/* ================= SALARY DETAILS ================= */}
      <section className="border border-teal-200 p-4 rounded">
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

          <span className="font-semibold">Net Salary</span>
          <span className="font-semibold">{netPay.toFixed(2)}</span>
        </div>
      </section>

      {/* ================= STATUS ================= */}
      <section className="border border-gray-200 p-4 rounded text-sm">
        <p>
          <strong>Status:</strong> {slip.status}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(slip.createdAt).toLocaleDateString()}
        </p>
      </section>
    </div>
  );
}
