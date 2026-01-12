"use client";

import { useState } from "react";

type Employee = {
  id: string;
  name: string;
  email: string | null;
};

export default function CompanyMessageForm({
  employees,
  onSubmit,
}: {
  employees: Employee[];
  onSubmit: (formData: FormData) => void;
}) {
  const [sendToAll, setSendToAll] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md shadow-teal-800 rounded-xs border border-teal-100">
      <h2 className="text-xl font-semibold mb-4 text-teal-800">
        Send Company Message
      </h2>

      <form action={onSubmit} className="space-y-4">
        {/* Checkbox */}
        <label className="flex items-center gap-3 text-gray-700">
          <input
            type="checkbox"
            name="sendToAll"
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
            className="w-4 h-4 text-teal-600"
          />
          Send to all employees
        </label>

        {/* Employee selector (always mounted) */}
        <div
          className={`transition-opacity duration-200 ${
            sendToAll ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <select
            name="employeeId"
            required={!sendToAll}
            disabled={sendToAll}
            className="w-full border p-2 bg-white"
          >
            <option value="">Select employee</option>
            {employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.email ? `(${emp.email})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <textarea
          name="content"
          required
          rows={5}
          placeholder="Write your message..."
          className="w-full border p-3 resize-none"
        />

        <button
          type="submit"
          className="w-full bg-teal-800 text-white py-2"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
