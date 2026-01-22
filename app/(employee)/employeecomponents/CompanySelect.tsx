"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Company = {
  id: string;
  name: string;
};

type CompanySelectProps = {
  companies: Company[];
  onChange?: (company: Company) => void; // ✅ optional callback when company changes
};

export default function CompanySelect({ companies, onChange }: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Company | null>(companies[0] || null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent whenever selection changes
  useEffect(() => {
    if (selected && onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <div className="relative w-48" ref={dropdownRef}>
      {/* Trigger */}
      <button
        className="w-full bg-teal-600 text-white flex justify-between items-center px-3 py-2 rounded-none border-none focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected?.name || "Select Company"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} text-white`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white text-teal-700 rounded-none border-none shadow-md">
          {companies.map((c) => (
            <li
              key={c.id}
              className={`px-3 py-2 cursor-pointer hover:bg-teal-100 ${
                selected?.id === c.id ? "bg-teal-100 font-semibold" : ""
              }`}
              onClick={() => {
                setSelected(c);
                setIsOpen(false);
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
