// app/components/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { Home, Calendar, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/employee",
      label: "Start",
      icon: Home,
    },
    {
      href: "/employee/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: "/employee/salary-hours",
      label: "Hours",
      icon: Clock,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden">
      <div className="flex justify-between">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 border-none ${
                active ? "text-teal-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
