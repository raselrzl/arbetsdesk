"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import { Menu, X, Loader2 } from "lucide-react";

export default function MobileMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLinkClick = () => setOpen(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-100"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="fixed top-[60px] left-0 right-0 bg-white shadow-md p-4 flex flex-col gap-2 z-50 max-h-[80vh] overflow-y-auto text-teal-900">
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

          {/* User login/logout menu inside dropdown */}
          <div className="pt-2 mt-4">
            <UserMenu user={user} />
          </div>
        </div>
      )}

      {/* Show Login button outside dropdown if user not logged in, with loader */}
      {!user && (
        <button
          onClick={() =>
            startTransition(() => {
              router.push("/login");
            })
          }
          disabled={isPending}
          className="py-1 px-3 bg-teal-900 text-white rounded-3xl hover:bg-teal-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
        </button>
      )}
    </div>
  );
}
