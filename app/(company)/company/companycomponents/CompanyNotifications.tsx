import { getCompanyMessagesForCompany, getEmployeeMessagesForCompany } from "../companyactions";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";

export default async function CompanyNotifications() {
  const employeeMessages = await getEmployeeMessagesForCompany();
  const companyMessages = await getCompanyMessagesForCompany();

  return (
    <div className="space-y-6 mb-30 px-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Messages Sent by Employees</h2>
        <EmployeeMessagesList messages={employeeMessages} /> 
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Messages Sent by Company</h2>
        <CompanyMessagesList messages={companyMessages} /> 
      </div>
    </div>
  );
}
