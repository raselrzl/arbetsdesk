"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function EditableField({
  label,
  value,
  onSave,
  masked = false,
  disabled = false,
}: {
  label: string;
  value?: string | null;
  masked?: boolean;
  disabled?: boolean;
  onSave?: (oldVal: string, newVal: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [oldVal, setOldVal] = useState("");
  const [newVal, setNewVal] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    if (newVal !== confirm) {
      setError("New values do not match");
      return;
    }

    setLoading(true);
    try {
      await onSave?.(oldVal, newVal);
      setSuccess(`${label} updated successfully!`);
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
        setLoading(false);
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Update failed");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 items-center border rounded-xs overflow-hidden">
        <div className="bg-gray-100 p-4 text-gray-800 text-xs font-semibold">
          {label}
        </div>
        <div className="col-span-2 p-2 flex justify-between items-center">
          <span>{masked && !showValue ? "****" : value ?? "-"}</span>
          <div className="flex gap-2">
            {masked && (
              <button
                type="button"
                onClick={() => setShowValue(!showValue)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showValue ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {!disabled && (
              <button
                onClick={() => setOpen(true)}
                className="text-teal-600 hover:underline text-xs"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white text-teal-900 p-6 rounded-xs w-80">
            <h3 className="font-semibold mb-3">Edit {label}</h3>

            <input
              type={masked ? "password" : "text"}
              placeholder="Current"
              className="input w-full border h-8 p-2 border-teal-100 mt-2"
              onChange={(e) => setOldVal(e.target.value)}
            />
            <input
              type={masked ? "password" : "text"}
              placeholder="New"
              className="input w-full border h-8 p-2 border-teal-100 mt-2"
              onChange={(e) => setNewVal(e.target.value)}
            />
            <input
              type={masked ? "password" : "text"}
              placeholder="Confirm New"
              className="input w-full border h-8 p-2 border-teal-100 mt-2"
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {success && (
              <p className="text-green-500 text-xs mt-1">{success}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpen(false)} disabled={loading} className="border px-2 py-1 border-red-500 rounded-xs">
                Cancel
              </button>
              <button
                onClick={submit}
                className={`bg-teal-900 text-white px-3 py-1 rounded flex items-center gap-2 rounded-xs${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
