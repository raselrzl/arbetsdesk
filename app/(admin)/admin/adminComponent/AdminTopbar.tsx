"use client";

import { Menu } from "lucide-react";

export default function AdminTopbar({
  user,
  onHamburgerClick,
}: {
  user: { name: string; email: string };
  onHamburgerClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-[#00687a] px-4 py-3 flex items-center justify-between">
      <button
        onClick={onHamburgerClick}
        className="rounded-md text-gray-100 hover:bg-white/10 flex flex-row justify-center font-extrabold text-xl"
      >
        ARBETS-DESK <Menu className="w-6 h-6 ml-4 mt-0.75" />
      </button>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-100">{user.name}</p>
        <p className="text-xs text-gray-300">{user.email}</p>
      </div>
    </header>
  );
}
