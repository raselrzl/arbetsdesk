"use client";

import { useState } from "react";
import { swapSchedules } from "./schedules";

function SwapPopup({ selectedSchedules, onClose }: { selectedSchedules: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSwap = async () => {
    if (selectedSchedules.length !== 2) return;
    setLoading(true);

    try {
      // Call server action
      await swapSchedules(selectedSchedules[0].id, selectedSchedules[1].id);
      alert("Shifts swapped successfully!");
      onClose(); // close popup
    } catch (err) {
      console.error(err);
      alert("Failed to swap shifts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="font-semibold text-lg mb-2">Swap Selected Shifts</h3>

        {selectedSchedules.map((sch) => (
          <div key={sch.id} className="mb-2 p-2 rounded border-l-4 bg-teal-200 border-teal-400">
            <p>{sch.employee.name}</p>
            <p>
              {new Date(sch.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              –
              {new Date(sch.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>{new Date(sch.date).toLocaleDateString()}</p>
          </div>
        ))}

        <button
          onClick={handleSwap}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Swapping..." : "Swap Shifts"}
        </button>
      </div>
    </div>
  );
}
