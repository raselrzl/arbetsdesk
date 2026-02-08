// app/components/MobileBottomNavCompany.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNavCompany() {
  const pathname = usePathname();

  const links = [
    { href: "/company", label: "Start", icon: "home.png" },
    { href: "/company/schedule", label: "Schedule", icon: "schedule.png" },
    { href: "/company/time", label: "Time", icon: "time.png" },
    { href: "/company/salary", label: "Salary", icon: "salary.png" },
    { href: "/company/tips", label: "Tips", icon: "4.png" },
    { href: "/company/analysis", label: "Analysis", icon: "analysis.png" },
    { href: "/company/employee", label: "Employee", icon: "emplyee.png" },
    { href: "/company/message", label: "Message", icon: "2.png" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#00687a] text-gray-100 border-t border-t-teal-600/20 shadow-md lg:hidden overflow-x-auto scrollbar-hide">
      <div className="flex justify-between min-w-max px-2">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-3 ${
                active ? "text-teal-300" : "text-gray-100"
              }`}
            >
              <img
                src={`/icons/${icon}`}
                alt={label}
                className="w-6 h-6 object-contain"
              />
              <span className="text-xs mt-1 font-medium uppercase">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
