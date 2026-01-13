"use client";

import { useState, useTransition } from "react";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";
import { fetchAllMessagesForDate } from "../message/messageactions";

export default function CompanyNotificationsClient({
  initialEmployeeMessages,
  initialCompanyMessages,
  initialDate,
}: {
  initialEmployeeMessages: any[];
  initialCompanyMessages: any[];
  initialDate: string;
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [employeeMessages, setEmployeeMessages] = useState(
    initialEmployeeMessages
  );
  const [companyMessages, setCompanyMessages] = useState(
    initialCompanyMessages
  );
  const [isPending, startTransition] = useTransition();

  const handleDateChange = (date: string) => {
    startTransition(async () => {
      setSelectedDate(date);
      const { employeeMessages, companyMessages } =
        await fetchAllMessagesForDate(date);
      setEmployeeMessages(employeeMessages);
      setCompanyMessages(companyMessages);
    });
  };

  return (
    <div className="p-4 rounded space-y-6">
      <div className="flex items-center justify-end mb-2">
       
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border px-2 py-1 h-8 rounded-xs border-amber-300"
        />
      </div>

      {isPending && <p>Loading messages…</p>}

      <section className="bg-amber-100 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/icons/bellicon.png"
            alt="Notification"
            className="h-10 w-10"
          />
          <span className="text-lg font-medium">
            From Company
          </span>
        </div>


        <CompanyMessagesList messages={companyMessages} />
      </section>
      <section className="bg-amber-50 rounded-lg p-4">
         <div className="flex items-center gap-2 mb-4">
          <img
            src="/icons/bellicon3.gif"
            alt="Notification"
            className="h-10 w-10"
          />
          <span className="text-sm font-medium">
            From Employee
          </span>
        </div>
        <EmployeeMessagesList messages={employeeMessages} />
      </section>
    </div>
  );
}
