import PrintSalarySlipClient from "../../../PrintSalarySlipClient";
import { getLatestSalarySlipForEmployee } from "../../../salaryActions";
import SalarySlipTemplate from "../../SalarySlipTemplate";

interface PageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

export default async function DownloadSalarySlipPage({ params }: PageProps) {
  const { employeeId } = await params;

  const slip = await getLatestSalarySlipForEmployee(employeeId);

  if (!slip) {
    return (
      <div className="p-6 text-center text-gray-500">No salary slip found.</div>
    );
  }

  return (
    <div className="my-30">
      <PrintSalarySlipClient />
      <div id="salary-slip-print">
        <SalarySlipTemplate slip={slip} />
      </div>
    </div>
  );
}
