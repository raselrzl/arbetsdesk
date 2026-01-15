"use client";

import { CircleOff, Mail, MessageCircle } from "lucide-react";

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
        ><span className="uppercase font-bold text-[10px] flex items-center">{msg.employee.name}{" "}<MessageCircle className="pl-1"/></span>
          <p className="text-gray-700 flex mr-2"><span className="text-xs"></span>{msg.content}</p>
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span className="flex bg-gray-200 px-2 py-0.5 rounded-xs">
             
              <Mail className="h-4 w-4 mr-2"/>{msg.employee.email && `${msg.employee.email}`}
            </span>{" "}
            <span className="flex items-center justify-end text-[10px] px-2 text-gray-100 bg-teal-800 rounded-xs">
              {new Date(msg.createdAt).toLocaleString("en-GB")}
            </span>
            
          </div>
        </div>
      ))}
    </div>
  );
}
