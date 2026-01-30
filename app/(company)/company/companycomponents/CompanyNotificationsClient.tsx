"use client";

import { useState, useTransition } from "react";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";
import { fetchAllMessagesForDate } from "../message/messageactions";
import EmployeeRegisteredNotifications from "./EmployeeRegisteredNotifications";

export default function CompanyNotificationsClient({
  initialEmployeeMessages,
  initialCompanyMessages,
  initialDate,
  initialEmployeeRegisteredNotifications,
}: {
  initialEmployeeMessages: any[];
  initialCompanyMessages: any[];
  initialEmployeeRegisteredNotifications: any[];
  initialDate: string;
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [employeeMessages, setEmployeeMessages] = useState(
    initialEmployeeMessages,
  );
  const [companyMessages, setCompanyMessages] = useState(
    initialCompanyMessages,
  );
  const [isPending, startTransition] = useTransition();

  const [employeeRegisteredNotifications, setEmployeeRegisteredNotifications] =
    useState(initialEmployeeRegisteredNotifications);

  const handleDateChange = (date: string) => {
    startTransition(async () => {
      setSelectedDate(date);
      const data = await fetchAllMessagesForDate(date);

      setEmployeeMessages(data.employeeMessages);
      setCompanyMessages(data.companyMessages);
      setEmployeeRegisteredNotifications(data.employeeRegisteredNotifications);
    });
  };

  return (
    <div className="p-4 rounded space-y-6">
      <div className="flex items-center justify-end mb-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border px-2 py-1 h-8 rounded-xs border-yellow-300 bg-white"
        />
      </div>

      {isPending && <p>Loading messages…</p>}

      <section className="bg-yellow-100 rounded-xs p-4">
        {/*   <div className="flex items-center gap-2 mb-4">
          <img
            src="/icons/bellicon.png"
            alt="Notification"
            className="h-10 w-10"
          />
          <span className="text-lg font-medium">
            From Company
          </span>
        </div> */}

        <CompanyMessagesList messages={companyMessages} />
      </section>
      <section className="">
        <EmployeeRegisteredNotifications
          notifications={employeeRegisteredNotifications}
        />
      </section>

      <section className="bg-amber-50 rounded p-4">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/icons/bellicon3.gif"
            alt="Notification"
            className="h-10 w-10 border-2 rounded-full border-amber-300 bg-white"
          />
          <span className="text-lg font-medium text-teal-950">
            From Employee
          </span>
        </div>
        <EmployeeMessagesList messages={employeeMessages} />
      </section>
    </div>
  );
}
