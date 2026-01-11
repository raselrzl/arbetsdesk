"use client";

import { useEffect, useState } from "react";
import { getCompanyMessages } from "./messageactions";

type Employee = {
  id: string;
  name: string;
  email?: string; // Keep undefined
};

type EmployeeMessage = {
  id: string;
  content: string;
  createdAt: string;
  employee: Employee;
  isRead: boolean;
};

export default function CompanyMessagesList() {
  const [messages, setMessages] = useState<EmployeeMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyMessages()
      .then((msgs) =>
        // ✅ normalize null to undefined for employee.email
        setMessages(
          msgs.map((m) => ({
            ...m,
            employee: {
              ...m.employee,
              email: m.employee.email ?? undefined,
            },
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <p>Loading messages...</p>;
  if (messages.length === 0) return <p>No messages sent by employees yet.</p>;

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-4 bg-white shadow rounded-md border-l-4 border-teal-600"
        >
          <p className="text-gray-700">{msg.content}</p>
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>
              From: {msg.employee.name}{" "}
              {msg.employee.email && `(${msg.employee.email})`}
            </span>
            <span>{formatDate(msg.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
