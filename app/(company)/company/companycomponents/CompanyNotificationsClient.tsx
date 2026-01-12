"use client";

import { useState, useTransition } from "react";
import CompanyMessagesList from "./CompanyMessagesList";
import EmployeeMessagesList from "./EmployeeMessagesList";
import { fetchMessagesForDate } from "../companyactions"; // server action

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
  const [employeeMessages, setEmployeeMessages] = useState(initialEmployeeMessages);
  const [companyMessages, setCompanyMessages] = useState(initialCompanyMessages);
  const [isPending, startTransition] = useTransition();

  const handleDateChange = (date: string) => {
    startTransition(async () => {
      setSelectedDate(date);
      const { employeeMessages, companyMessages } = await fetchMessagesForDate(date);
      setEmployeeMessages(employeeMessages);
      setCompanyMessages(companyMessages);
    });
  };

  return (
    <div className="space-y-6 p-4 bg-teal-100 rounded mt-12">
      <div className="flex items-center gap-4 justify-end">
        <label className="font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border px-2 py-1 h-8 rounded-xs border-teal-300"
        />
      </div>

      {isPending && <p>Loading messages…</p>}

      <section>
        <h2 className="font-semibold">Employee Messages</h2>
        <EmployeeMessagesList messages={employeeMessages} />
      </section>

      <section>
        <h2 className="font-semibold">Company Messages</h2>
        <CompanyMessagesList messages={companyMessages} />
      </section>
    </div>
  );
}
