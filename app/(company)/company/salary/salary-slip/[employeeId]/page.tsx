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
    <div className="py-30 max-w-7xl mx-auto">
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

            <div className="flex gap-1">
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
                  <th className="border border-teal-200  p-2 text-right">
                    Monthly Salary
                  </th>
                  <th className="border border-teal-200  p-2 text-right">
                    Payment
                  </th>
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
        <section className="grid grid-cols-3 mt-20 border-t pt-2">
          <div className=" flex flex-col">
            <div>
              {" "}
              <h2>Hours</h2>
              <div className="flex justify-between pr-3">
                <p>Working Hours:</p>
                <p>{slip.totalHours.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6">
              <h2>Offer</h2>
              <div className="flex justify-between pr-3">
                <p>Saved days</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pr-3">
                <p>Free days</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pr-3">
                <p>Payment days</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pr-3">
                <p>Semester Days</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="pr-6">
            <div>
              <h2>Tax</h2>
              <div className="flex justify-between pr-3">
                <p>Salary brfore tax</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>

              <div className="flex justify-between pr-3">
                <p>Primary tax</p>
                <p>{slip.tax.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h2>Total in Year</h2>
              <div className="flex justify-between pr-3">
                <p>Salary brfore tax</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pr-3">
                <p>Salary After tax</p>
                <p>{slip.totalPay.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between pr-3">
              <p>Salary brfore tax</p>
              <p>{slip.totalPay.toFixed(2)}</p>
            </div>
            <div className="flex justify-between pr-3">
              <p>Tax</p>
              <p>{slip.totalPay.toFixed(2)}</p>
            </div>
            <div className="flex justify-between pr-3">
              <p>Salary</p>
              <p>{slip.totalPay.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="border-t grid grid-cols-3 mt-10 pt-2">
          <div className="">
            <h2 className="uppercase font-medium">Company Info</h2>
            <span>{company.name}</span>
            <span>{company.organizationNo}</span>
          </div>
          <div className="">
            <h2 className="uppercase font-medium">ADDRESS</h2>
            <span>{company.contractDetails || "Platensgatan 5 Linköping"}</span>
          </div>
          <div className=""></div>
        </section>
      </div>
    </div>
  );
}
