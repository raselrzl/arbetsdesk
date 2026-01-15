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
  // Only broadcasted messages
  const broadcastMessages = messages.filter((msg) => msg.isBroadcast === true);

  if (broadcastMessages.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center bg-gray-50 h-20 w-20 rounded-full border-2 border-red-200">
          <CircleOff className="h-10 w-10 text-red-300" />
        </div>
      </div>
    );
  }

  // 🔹 Group messages by company name
  const groupedByCompany = broadcastMessages.reduce(
    (acc: Record<string, CompanyMessage[]>, msg) => {
      acc[msg.companyName] = acc[msg.companyName] || [];
      acc[msg.companyName].push(msg);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedByCompany).map(
        ([companyName, companyMessages]) => (
          <div key={companyName} className="space-y-3">
            {/* 🏢 Company Heading */}
            {/*   <h2 className="text-lg font-semibold text-teal-900 border-b border-teal-200 pb-1">
              {companyName}
            </h2> */}

            <div className="flex items-center gap-2 mb-4">
              <img
                src="/icons/bellicon.png"
                alt="Notification"
                className="h-10 w-10"
              />
              <span className="text-lg font-medium">{companyName}</span>
            </div>

            {companyMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 shadow rounded-md border-l-4 bg-amber-50 border-amber-400"
              >
                <p className="text-gray-700">{msg.content}</p>

                <div className="text-[10px] text-gray-800 mt-1 flex justify-end">
                  <div className="bg-amber-300 px-2 py-0.5 rounded text-gray-800">
                    <ClientDate date={msg.createdAt} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
