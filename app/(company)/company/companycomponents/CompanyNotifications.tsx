
import { prisma } from "@/app/utils/db";
import { getCompanyMessagesForCompany, getEmployeeMessagesForCompany, getEmployeeRegisteredNotificationsForCompany } from "../companyactions";
import CompanyNotificationsClient from "./CompanyNotificationsClient";
export default async function CompanyNotifications({ date }: { date?: string }) {
  const selectedDate = date ?? new Date().toISOString().split("T")[0]; // default today
  const employeeMessages = await getEmployeeMessagesForCompany(selectedDate);
  const companyMessages = await getCompanyMessagesForCompany(selectedDate);

  const employeeRegisteredNotifications =
    await getEmployeeRegisteredNotificationsForCompany(selectedDate);

  return (
    <CompanyNotificationsClient
      initialEmployeeMessages={employeeMessages}
      initialCompanyMessages={companyMessages}
      initialEmployeeRegisteredNotifications={
        employeeRegisteredNotifications
      }
      initialDate={selectedDate}
    />
  );
}
