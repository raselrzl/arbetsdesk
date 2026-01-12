"use client";

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
  if (messages.length === 0) return <p>No company messages yet.</p>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 shadow rounded-md border-l-4 ${
            msg.isBroadcast
              ? "bg-amber-50 border-amber-400"
              : "bg-white border-teal-900"
          }`}
        >
          <p className="text-gray-700">{msg.content}</p>

          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>
              {msg.isBroadcast
                ? `Notification to all employees – ${msg.companyName}`
                : `To: ${msg.employeeName} – ${msg.companyName}`}
            </span>
            <ClientDate date={msg.createdAt} />
          </div>
        </div>
      ))}
    </div>
  );
}
