"use client";

import { CircleOff } from "lucide-react";

type Employee = {
  id: string;
  name: string;
  email?: string;
};

export type EmployeeMessage = {
  id: string;
  content: string;
  createdAt: string;
  employee: Employee;
  isRead: boolean;
};

export default function EmployeeMessagesList({
  messages,
}: {
  messages: EmployeeMessage[];
}) {
  if (messages.length === 0)
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center bg-gray-50 h-20 w-20 rounded-full border-2 border-red-200">
          <CircleOff className="h-10 w-10 text-red-300" />
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-3 bg-white shadow rounded-md border-l-4 border-teal-600"
        >
          <p className="text-gray-700">{msg.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            <span className="bg-gray-200 px-2 py-0.5 rounded">From:</span> {msg.employee.name}{" "}
            {msg.employee.email && `(${msg.employee.email})`} {" "}
            <span className="text-[10px] ml-4 px-2 bg-amber-300 rounded">{new Date(msg.createdAt).toLocaleString("en-GB")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
