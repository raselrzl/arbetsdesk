import AllMessagesClient from "./AllMessagesClient";
import { getCompanyMessagesForCompany, getEmployeeMessagesForCompany } from "./messageactions";





export default async function AllMessages({ date }: { date?: string }) {
  const selectedDate = date ?? new Date().toISOString().split("T")[0]; // default today

  const employeeMessages = await getEmployeeMessagesForCompany(selectedDate);
  const companyMessages = await getCompanyMessagesForCompany(selectedDate);

  return (
    <AllMessagesClient
      initialEmployeeMessages={employeeMessages}
      initialCompanyMessages={companyMessages}
      initialDate={selectedDate}
    />
  );
}
