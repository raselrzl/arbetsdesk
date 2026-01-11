"use client";
import { useState } from "react";

export default function CompanyNotificationsWrapper({
  employeeMessages,
  companyMessages,
  loadMessages,
}: any) {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setWeekOffset((w) => w - 1)}>← Previous</button>
        <button onClick={() => setWeekOffset(0)}>Current</button>
        <button onClick={() => setWeekOffset((w) => w + 1)}>Next →</button>
      </div>
    </>
  );
}
