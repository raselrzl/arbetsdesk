// app/components/MobileBottomNavCompany.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Calendar,
  Clock,
  Wallet,
  BarChart,
  Users,
  MessageSquare,
} from "lucide-react";

export default function MobileBottomNavCompany() {
  const pathname = usePathname();

  const links = [
    { href: "/company/start", label: "Start", icon: Home },
    { href: "/company/schema", label: "Schema", icon: Calendar },
    { href: "/company/time", label: "Time", icon: Clock },
    { href: "/company/salary", label: "Salary", icon: Wallet },
    { href: "/company/tips", label: "Tips", icon: Wallet },
    { href: "/company/analysis", label: "Analysis", icon: BarChart },
    { href: "/company/employee", label: "Employee", icon: Users },
    { href: "/company/message", label: "Message", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden overflow-x-auto">
      <div className="flex justify-between min-w-max px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-3 ${
                active ? "text-teal-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
