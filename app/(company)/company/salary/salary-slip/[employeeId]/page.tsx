import { getLatestSalarySlipForEmployee } from "../../salaryActions";

/* ---------------- TYPES ---------------- */
interface PageProps {
  params: Promise<{ employeeId: string }>;
}

interface PageProps {
  params: Promise<{ employeeId: string }>; // Note the Promise
}

export default async function SalarySlipPage({ params }: PageProps) {
  const { employeeId } = await params; // unwrap async params

  const slip = await getLatestSalarySlipForEmployee(employeeId);

  if (!slip) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500">
        No salary slip found for this employee.
      </div>
    );
  }

  const netPay = slip.totalPay - slip.tax;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold uppercase">Salary Slip</h1>

      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3">Employee Information</h2>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {slip.employee.person.name}
          </p>
          <p>
            <strong>Personal Number:</strong>{" "}
            {slip.employee.person.personalNumber}
          </p>
          <p>
            <strong>Company:</strong> {slip.company.name}
          </p>
        </div>
      </section>

      <section className="border border-gray-200 p-4 rounded">
        <h2 className="font-semibold mb-3">Salary Details</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span>Total Hours</span>
          <span>{slip.totalHours}</span>
          <span>Total Minutes</span>
          <span>{slip.totalMinutes}</span>
          <span>Gross Salary</span>
          <span>{slip.totalPay.toFixed(2)}</span>
          <span className="font-semibold">Net Salary</span>
          <span className="font-semibold">{netPay.toFixed(2)}</span>
        </div>
      </section>

      <section className="border border-gray-200 p-4 rounded text-sm">
        <p>
          <strong>Status:</strong> {slip.status}
        </p>
        <p>
          <strong>Period:</strong> {slip.month}/{slip.year}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(slip.createdAt).toLocaleDateString()}
        </p>
      </section>
    </div>
  );
}
