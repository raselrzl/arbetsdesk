"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  items: [string, string][];
}

export default function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className="relative flex items-center gap-1"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="hover:text-gray-700 flex items-center gap-1"
        onClick={() => setOpen(!open)}
      >
        {label} <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md w-48 z-50">
          {items.map(([label, href]) => (
            <Link key={href} href={href} className="block px-4 py-2 hover:bg-gray-100">
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
