"use client";

import { useState, useTransition } from "react";
import AllEmployeeMessagesList from "./AllCompanyMessagesList";
import AllCompanyMessagesList from "./AllCompanyMessagesList";
import { fetchAllMessagesForDate } from "./messageactions";

export default function AllMessagesClient({
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

      <div className="grid grid-cols-2 gap-4 mb-20">
        <section>
          <h2 className="font-semibold">Message Sent</h2>
          <AllCompanyMessagesList messages={companyMessages} />
        </section>
        <section>
          <h2 className="font-semibold">Messages Received</h2>
          <AllEmployeeMessagesList messages={employeeMessages} />
        </section>
      </div>
    </div>
  );
}
