"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./messageactions";

type Employee = {
  id: string;
  name: string;
  email: string | null;
};

export default function CompanyMessageForm({
  employees,
}: {
  employees: Employee[];
}) {
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
    <form action={handleSubmit} className="space-y-4">
      {/* Send to all */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="sendToAll"
          checked={sendToAll}
          onChange={(e) => setSendToAll(e.target.checked)}
        />
        Send to all employees
      </label>

      {/* Employee selector */}
      {!sendToAll && (
        <select
          name="employeeId"
          required
          className="w-full border rounded p-2"
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
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">
          Message sent successfully ✅
        </p>
      )}
    </form>
  );
}
