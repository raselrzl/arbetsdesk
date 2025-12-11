"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // desktop dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-md px-4 py-3 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="text-xl font-bold uppercase">
          <Link href="/">Arbets-desk</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-gray-700 rounded"
            >
             <Menu className="w-6 h-6" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                <Link
                  href="/admin/createuser"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Burger Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link
            href="/admin/createuser"
            className="block px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link
            href="/logout"
            className="block px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
