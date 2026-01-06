"use client";

import { useState } from "react";

export default function PinField({ pin }: { pin: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="border rounded-md p-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">Login PIN</p>
        <p className="font-medium tracking-widest">
          {show ? pin : "****"}
        </p>
      </div>

      <button
        onClick={() => setShow(!show)}
        className="text-sm text-teal-600 hover:underline"
      >
        {show ? "Hide" : "View"}
      </button>
    </div>
  );
}
