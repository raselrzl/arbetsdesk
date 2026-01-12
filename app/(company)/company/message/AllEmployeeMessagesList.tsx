"use client";

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

export default function AllEmployeeMessagesList({
  messages,
}: {
  messages: EmployeeMessage[];
}) {
  if (messages.length === 0) return <p>No messages sent by employees.</p>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-3 bg-white shadow rounded-md border-l-4 border-teal-600"
        >
          <p className="text-gray-700">{msg.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            From: {msg.employee.name}{" "}
            {msg.employee.email && `(${msg.employee.email})`} –{" "}
            {new Date(msg.createdAt).toLocaleString("en-GB")}
          </div>
        </div>
      ))}
    </div>
  );
}
