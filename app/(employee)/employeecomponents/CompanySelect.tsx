"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CompanySelectProps {
  companies: string[];
}

export default function CompanySelect({ companies }: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(companies[0]);
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

  return (
    <div className="relative w-48" ref={dropdownRef}>
      {/* Trigger */}
      <button
        className="w-full bg-teal-600 text-white flex justify-between items-center px-3 py-2 rounded-none border-none focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} text-white`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white text-teal-700 rounded-none border-none shadow-md">
          {companies.map((c) => (
            <li
              key={c}
              className={`px-3 py-2 cursor-pointer hover:bg-teal-100 ${
                selected === c ? "bg-teal-100 font-semibold text-white" : ""
              }`}
              onClick={() => {
                setSelected(c);
                setIsOpen(false);
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
