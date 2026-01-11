import {
  getCompanyMessagesForCompany,
  getEmployeeMessagesForCompany,
} from "../companyactions";
import CompanyNotificationsClient from "./CompanyNotificationsClient";

type Props = {
  searchParams?: { week?: string };
};

export default async function CompanyNotifications({ searchParams }: Props) {
  const weekOffset = Number(searchParams?.week ?? 0);

  const employeeMessages = await getEmployeeMessagesForCompany(weekOffset);
  const companyMessages = await getCompanyMessagesForCompany(weekOffset);

  return (
    <CompanyNotificationsClient
      employeeMessages={employeeMessages}
      companyMessages={companyMessages}
      weekOffset={weekOffset}
    />
  );
}
