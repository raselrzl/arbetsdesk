"use client";

import { useState } from "react";
import { sendEmployeeMessage } from "./employeeactions";

type SendMessageFormProps = {
  companyId: string;
  onSuccess?: () => void;
};

export default function SendMessageForm({
  companyId,
  onSuccess,
}: SendMessageFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendEmployeeMessage({ title, content, companyId });
      setTitle("");
      setContent("");
      onSuccess?.();
      alert("Message sent successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded max-w-md bg-black text-white"
    >
      <h2 className="text-lg font-semibold mb-2">Send Message</h2>

      <label className="block mb-2">
        Title (optional)
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded-xs"
        />
      </label>

      <label className="block mb-2">
        Message
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-2 py-1 rounded-xs"
          rows={4}
          required
        />
      </label>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-sm text-white px-2 py-0.5 rounded-xs hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
