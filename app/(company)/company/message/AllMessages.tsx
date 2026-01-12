import AllMessagesClient from "./AllMessagesClient";
import {
  getCompanyMessagesForCompany,
  getEmployeeMessagesForCompany,
} from "./messageactions";

type Employee = {
  id: string;
  name: string;
  email: string | null;
};

export default async function AllMessages({
  employees,
  date,
}: {
  employees: Employee[];
  date?: string;
}) {
  const selectedDate = date ?? new Date().toISOString().split("T")[0];

  const employeeMessages = await getEmployeeMessagesForCompany(selectedDate);
  const companyMessages = await getCompanyMessagesForCompany(selectedDate);

  return (
    <AllMessagesClient
      employees={employees}
      initialEmployeeMessages={employeeMessages}
      initialCompanyMessages={companyMessages}
      initialDate={selectedDate}
    />
  );
}
