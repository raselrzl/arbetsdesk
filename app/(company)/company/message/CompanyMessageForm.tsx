"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./messageactions";

type Employee = {
  id: string;
  name: string;
  email: string | null;
};

export default function CompanyMessageForm({ employees }: { employees: Employee[] }) {
  const [sendToAll, setSendToAll] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setSuccess(false);

    startTransition(async () => {
      await sendMessage(formData);
      setSuccess(true);
    });
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md shadow-teal-800 rounded-xs border border-teal-100">
      <h2 className="text-xl font-semibold mb-4 text-teal-800">Send Company Message</h2>

      <form action={handleSubmit} className="space-y-4">
        {/* Send to all */}
        <label className="flex items-center gap-3 text-gray-700">
          <input
            type="checkbox"
            name="sendToAll"
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
            className="w-4 h-4 text-teal-600 border-teal-100 rounded-xs focus:ring-2 focus:ring-teal-500"
          />
          Send to all employees
        </label>

        {/* Employee selector */}
        {!sendToAll && (
          <select
            name="employeeId"
            required
            className="w-full border border-teal-100 rounded-xs p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.email ? `(${emp.email})` : ""}
              </option>
            ))}
          </select>
        )}

        {/* Message content */}
        <textarea
          name="content"
          required
          rows={5}
          placeholder="Write your message..."
          className="w-full border border-teal-100 rounded-xs p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none shadow-sm"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-800 text-white font-medium py-2 px-4 rounded-xs hover:bg-teal-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>

        {/* Success message */}
        {success && (
          <p className="text-green-600 text-sm mt-2 text-center">
            Message sent successfully ✅
          </p>
        )}
      </form>
    </div>
  );
}
