"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // shadcn/ui
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm px-4 py-3 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="text-xl font-bold uppercase">
          <Link href="/">Arbets-desk</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/features" className="hover:text-gray-700">
            Features
          </Link>
          <Link href="/industries" className="hover:text-gray-700">
            Industries
          </Link>
          <Link href="/integrations" className="hover:text-gray-700">
            Integrations
          </Link>
          <Link href="/pricing" className="hover:text-gray-700">
            Pricing
          </Link>
          <Link href="/analytics" className="hover:text-gray-700">
            Analytics+
          </Link>
          <Link href="/contact" className="hover:text-gray-700">
            Contact
          </Link>
          <Link href="/company" className="hover:text-gray-700">
            Company
          </Link>
          <Link href="/employee" className="hover:text-gray-700">
            Employee
          </Link>
          <Link href="/register" className="hover:text-gray-700">
            Register
          </Link>
          <Link
            href="/login"
            className="hover:text-gray-700 bg-gray-600 text-white font-bold px-2 py-1 rounded-2xl"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu (shadcn/ui dropdown) */}

        <div className="md:hidden flex items-center">
          <Link
            href="/login"
            className="hover:text-gray-700 bg-gray-600 text-white font-bold px-4 py-1 rounded-2xl"
          >
            Login
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 mt-2">
              <DropdownMenuItem>
                <Link href="/features">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/industries">Industries</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/integrations">Integrations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/pricing">Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/analytics">Analytics+</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/contact">Contact</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/employee" className="hover:text-gray-700">
                  Employee
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/company" className="hover:text-gray-700">
                  Company
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/register">Register</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/login"
                  className="hover:text-gray-700 bg-gray-600 text-white font-bold px-4 py-1 rounded-2xl"
                >
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
