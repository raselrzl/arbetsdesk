"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUserAction } from "@/app/actions";
import {
  LayoutDashboard,
  User,
  Building2,
  LogOut,
  ChevronLeft,
} from "lucide-react";

export default function AdminSidebar({
  user,
  open,
  onClose,
}: {
  user: { name: string; email: string };
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xs font-medium transition
     ${
       pathname === href
         ? "bg-[#02505e] text-gray-100"
         : "text-gray-200 hover:bg-gray-700"
     }`;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 md:hidden bg-black/30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
    fixed top-0 left-0 h-screen w-54
    bg-[#00687a] text-gray-100 border-r
    z-50
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    flex flex-col
  `}
      >
        {/* Header */}
        <div className="py-2.5 px-6 md:px-2 border-b flex justify-between items-center lg:block">
          <h1 className="text-md md:text-xl font-extrabold uppercase text-gray-100">
            Admin Panel
          </h1>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-100"
            onClick={onClose}
          >
            <ChevronLeft />
          </button>
        </div>

        {/* User info + Nav */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 py-4 border-b">
            <p className="text-sm font-bold truncate uppercase">{user.name}</p>
            <p className="text-xs truncate">{user.email}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className={linkClass("/admin")}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>

            <Link
              href="/admin/createuser"
              className={linkClass("/admin/createuser")}
            >
              <User className="w-4 h-4" /> Create User
            </Link>

            <Link
              href="/admin/createcompany"
              className={linkClass("/admin/createcompany")}
            >
              <Building2 className="w-4 h-4" /> Create Company
            </Link>
          </nav>
        </div>

        {/* Logout button pinned at bottom */}
        <form action={logoutUserAction} className="p-4 border-t">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </form>
      </aside>
    </>
  );
}
