interface Props {
  slip: any;
}

export default function SalarySlipTemplate({ slip }: Props) {
  const { employee, company } = slip;
  const { person } = employee;

  const isHourly = employee.contractType === "HOURLY";

  const grossSalary = slip.totalPay;
  const tax = slip.tax;
  const netSalary = grossSalary - tax;

  const totalHours = isHourly ? slip.totalHours : 0;
  const hourlyRate = isHourly ? employee.hourlyRate ?? 0 : 0;
  const monthlySalary = !isHourly ? employee.monthlySalary ?? 0 : 0;

  const yearlyGross = isHourly ? grossSalary * 12 : monthlySalary * 12;
  const yearlyNet = yearlyGross - tax * 12;

  const monthName = new Date(slip.year, slip.month - 1).toLocaleString("default", {
    month: "long",
  });

  const periodStart = new Date(slip.year, slip.month - 1, 1);
  const periodEnd = new Date(slip.year, slip.month, 0);

  const isDraft = slip.status === "DRAFT";

  return (
    <div className="relative max-w-4xl mx-auto p-6 space-y-6 border overflow-hidden bg-white">
      {isDraft && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[120px] font-extrabold text-gray-300 opacity-40 rotate-[-30deg]">
            DRAFT
          </span>
        </div>
      )}

       {/* ================= HEADER ================= */}
        <section className="flex justify-between items-start mb-20">
          <h2 className="text-xl font-bold">{company.name}</h2>

          <div className="flex flex-col gap-1 items-start pr-24">
            <h1 className="text-2xl font-bold uppercase">Salary Slip</h1>
            <p className="text-sm text-gray-600">
              {monthName} {slip.year}
            </p>
          </div>
        </section>

        {/* ================= EMPLOYEE / BANK ================= */}
        <section className="flex justify-between items-start mb-20">
          <div className="flex flex-col text-left">
            <span>Name: {person.name}</span>
            <span>Personal Number: {person.personalNumber || "-"}</span>
            <span>Email: {person.email || "-"}</span>
            <span>Phone: {person.phone || "-"}</span>
            <span>Address: {person.address || "-"}</span>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex gap-2">
              <span>Bank Name:</span>
              <span>{person.bankName || "-"}</span>
            </div>

            <div className="flex gap-1">
              <span>Period:</span>
              <span>{periodStart.toLocaleDateString()}</span>-
              <span>{periodEnd.toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <span>Withdraw:</span>
              <span>{periodStart.toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <span>Account Number:</span>
              <span>
                {person.clearingNumber || ""}-{person.accountNumber || ""}
              </span>
            </div>
          </div>
        </section>

        {/* ================= SALARY TABLE ================= */}
        <section>
          <div className="flex gap-2 mb-2 text-sm font-bold">
            <span>Period:</span>
            <span>{periodStart.toLocaleDateString()}</span>-
            <span>{periodEnd.toLocaleDateString()}</span>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-teal-200">
                <th className="border p-2 text-left">Type</th>

                {isHourly ? (
                  <>
                    <th className="border p-2 text-right">Hours</th>
                    <th className="border p-2 text-right">Hourly Rate</th>
                  </>
                ) : (
                  <th className="border p-2 text-right">Monthly Salary</th>
                )}

                <th className="border p-2 text-right">Payment</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">
                  {employee.contractType}
                </td>

                {isHourly ? (
                  <>
                    <td className="border border-gray-200 p-2 text-right">
                      {totalHours.toFixed(2)}
                    </td>
                    <td className="border border-gray-200 p-2 text-right">
                      {hourlyRate.toFixed(2)}
                    </td>
                  </>
                ) : (
                  <td className="border border-gray-200 p-2 text-right">
                    {monthlySalary.toFixed(2)}
                  </td>
                )}

                <td className="border border-gray-200 p-2 text-right font-semibold">
                  {grossSalary.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ================= FOOTER SUMMARY ================= */}
        <section className="grid grid-cols-3 mt-40 border-t pt-2 text-sm">
          {/* LEFT */}
          <div>
            <h2>Hours</h2>

            <div className="flex justify-between pr-3">
              <p>{isHourly ? "Working Hours" : "Monthly Salary"}</p>
              <p>
                {isHourly ? totalHours.toFixed(2) : monthlySalary.toFixed(2)}
              </p>
            </div>

            {isHourly && (
              <div className="flex justify-between pr-3">
                <p>Hourly Rate</p>
                <p>{hourlyRate.toFixed(2)}</p>
              </div>
            )}

            <div className="mt-6">
              <h2>Offer</h2>
              {["Saved days", "Free days", "Payment days", "Semester Days"].map(
                (label) => (
                  <div key={label} className="flex justify-between pr-3">
                    <p>{label}</p>
                    <p>{grossSalary.toFixed(2)}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* MIDDLE */}
          <div className="pr-6">
            <h2>Tax</h2>

            <div className="flex justify-between pr-3">
              <p>Salary before tax</p>
              <p>{grossSalary.toFixed(2)}</p>
            </div>

            <div className="flex justify-between pr-3">
              <p>Primary tax</p>
              <p>{tax.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h2>Total in Year</h2>

              <div className="flex justify-between pr-3">
                <p>Salary before tax</p>
                <p>{yearlyGross.toFixed(2)}</p>
              </div>

              <div className="flex justify-between pr-3">
                <p>Salary after tax</p>
                <p>{yearlyNet.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="flex justify-between pr-3">
              <p>Salary before tax</p>
              <p>{grossSalary.toFixed(2)}</p>
            </div>

            <div className="flex justify-between pr-3">
              <p>Tax</p>
              <p>{tax.toFixed(2)}</p>
            </div>

            <div className="flex justify-between pr-3 font-semibold">
              <p>Salary</p>
              <p>{netSalary.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* ================= COMPANY INFO ================= */}
        <section className="border-t grid grid-cols-3 mt-10 pt-2 text-sm">
          <div>
            <h2 className="uppercase font-medium">Company Info</h2>
            <span>{company.name}</span>
            <span>{company.organizationNo}</span>
          </div>

          <div>
            <h2 className="uppercase font-medium">Address</h2>
            <span>{company.contractDetails || "Platensgatan 5 Linköping"}</span>
          </div>
        </section>
    </div>
  );
}
