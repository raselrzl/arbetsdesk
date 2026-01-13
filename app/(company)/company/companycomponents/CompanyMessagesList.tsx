"use client";

import { CircleOff } from "lucide-react";
import ClientDate from "./ClientDate";

export type CompanyMessage = {
  id: string;
  content: string;
  createdAt: string;
  isBroadcast: boolean;
  companyName: string;
  employeeName?: string;
};

export default function CompanyMessagesList({
  messages,
}: {
  messages: CompanyMessage[];
}) {
  // ✅ Only broadcasted messages
  const broadcastMessages = messages.filter(
    (msg) => msg.isBroadcast === true
  );

  if (broadcastMessages.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center bg-gray-50 h-20 w-20 rounded-full border-2 border-red-200">
          <CircleOff className="h-10 w-10 text-red-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {broadcastMessages.map((msg) => (
        <div
          key={msg.id}
          className="p-3 shadow rounded-md border-l-4 bg-amber-50 border-amber-400"
        >
          <p className="text-gray-700">{msg.content}</p>

          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>
              {msg.companyName}
            </span>
            <div className="bg-teal-800 p-1 rounded text-gray-100"><ClientDate date={msg.createdAt} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
