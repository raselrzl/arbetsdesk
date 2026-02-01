"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  href?: string; // optional main link
  items: [string, string][];
}

export default function Dropdown({ label, href, items }: DropdownProps) {
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
    <div className="relative flex items-center gap-1" ref={ref}>
      <div className="flex items-center gap-1">
        {href ? (
          <Link
            href={href}
            className="hover:text-gray-300 flex items-center gap-1"
          >
            {label}
          </Link>
        ) : (
          <span className="hover:text-gray-300 flex items-center gap-1">
            {label}
          </span>
        )}

        {/* Dropdown toggle */}
        <button className="flex items-center" onClick={() => setOpen(!open)}>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-xs w-48 z-50 border border-teal-200">
          {items.map(([itemLabel, itemHref]) => (
            <Link
              key={itemHref}
              href={itemHref}
              className="block px-4 py-2 hover:bg-teal-100 text-[#00687a]"
              onClick={() => setOpen(false)}
            >
              {itemLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
