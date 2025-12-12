"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        featuresRef.current &&
        !featuresRef.current.contains(e.target as Node)
      ) {
        setFeaturesOpen(false);
      }

      if (
        industriesRef.current &&
        !industriesRef.current.contains(e.target as Node)
      ) {
        setIndustriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm px-4 py-3 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold uppercase">
          <Link href="/">Arbets-desk</Link>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          {/* FEATURES DROPDOWN */}
          <div
            className="relative flex items-center gap-1"
            ref={featuresRef}
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <Link href="/features" className="hover:text-gray-700">
              Features
            </Link>

            <DropdownMenu open={featuresOpen} onOpenChange={setFeaturesOpen}>
              <DropdownMenuTrigger asChild>
                <button onClick={() => setFeaturesOpen(!featuresOpen)}>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      featuresOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" side="bottom" className="w-48 mt-2">
                {[
                  ["Time Clock", "/features/time-clock"],
                  ["Schedule", "/features/schedule"],
                  ["Hours", "/features/hours"],
                  ["Payroll", "/features/payroll"],
                  ["Analytics", "/features/analytics"],
                  ["Tips", "/features/tips"],
                  ["Staff", "/features/staff"],
                ].map(([label, href]) => (
                  <DropdownMenuItem key={href} onClick={() => setFeaturesOpen(false)}>
                    <Link href={href}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* INDUSTRIES DROPDOWN */}
          <div
            className="relative flex items-center gap-1"
            ref={industriesRef}
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <Link href="/industries" className="hover:text-gray-700">
              Industries
            </Link>

            <DropdownMenu open={industriesOpen} onOpenChange={setIndustriesOpen}>
              <DropdownMenuTrigger asChild>
                <button onClick={() => setIndustriesOpen(!industriesOpen)}>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      industriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" side="bottom" className="w-56 mt-2">
                {[
                  ["Hotels", "/industries/hotel"],
                  ["Restaurants", "/industries/restaurant"],
                  ["Fast Food / Café", "/industries/fastfood-cafe"],
                  ["Retail", "/industries/retail"],
                  ["Accounting Firms", "/industries/accounting"],
                ].map(([label, href]) => (
                  <DropdownMenuItem
                    key={href}
                    onClick={() => setIndustriesOpen(false)}
                  >
                    <Link href={href}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* OTHER DESKTOP LINKS */}
          <Link href="/integrations" className="hover:text-gray-700">Integrations</Link>
          <Link href="/pricing" className="hover:text-gray-700">Pricing</Link>
          <Link href="/analytics" className="hover:text-gray-700">Analytics+</Link>
          <Link href="/contact" className="hover:text-gray-700">Contact</Link>
          <Link href="/company" className="hover:text-gray-700">Company</Link>
          <Link href="/employee" className="hover:text-gray-700">Employee</Link>
          <Link href="/register" className="hover:text-gray-700">Register</Link>

          <Link
            href="/login"
            className="hover:text-gray-700 bg-gray-600 text-white font-bold px-4 py-1 rounded-2xl"
          >
            Login
          </Link>
        </div>

        {/* MOBILE stays unchanged */}
      </div>
    </nav>
  );
}
