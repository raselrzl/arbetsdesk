"use client";

import { useState } from "react";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";

export default function MobileMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  // helper function to close dropdown
  const handleLinkClick = () => setOpen(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Show Login/Register next to hamburger if user not logged in */}
      {!user && (
        <Link
          href="/login"
          className="py-1 px-3 bg-teal-600 text-white rounded-xs hover:bg-teal-700 text-sm"
        >
          Login
        </Link>
      )}
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-100"
      >
        <Menu />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="fixed top-[60px] left-0 right-0 bg-white shadow-md p-4 flex flex-col gap-2 z-50 max-h-[80vh] overflow-y-auto">
          <Link
            href="/features"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Features
          </Link>
          <Link
            href="/industries"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Industries
          </Link>
          <Link
            href="/integrations"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Integrations
          </Link>
          <Link
            href="/pricing"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Pricing
          </Link>
          <Link
            href="/analytics"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Analytics+
          </Link>
          <Link
            href="/contact"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
          <Link
            href="/company"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Company
          </Link>
          <Link
            href="/employee"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Employee
          </Link>

           <Link
            href="/admin/createuser"
            className="py-2 border-b"
            onClick={handleLinkClick}
          >
            Register
          </Link>

          {/* Inside dropdown, no need to show login again */}
          {user && <UserMenu user={user} />}
        </div>
      )}
    </div>
  );
}
