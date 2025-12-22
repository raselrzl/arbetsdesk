"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function CompanyLogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-40 flex items-center justify-center gap-2 rounded-xs bg-red-600 py-2 text-white hover:bg-red-700 transition cursor-pointer disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Logout
        </>
      )}
    </button>
  );
}

export default CompanyLogoutButton;
