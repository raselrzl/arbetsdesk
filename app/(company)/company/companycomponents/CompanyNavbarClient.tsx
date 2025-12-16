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
  LucideIcon,
} from "lucide-react";
import CompanyUserMenu from "./CompanyUserMenu";
import MobileBottomNavCompany from "./MobileBottomNavCompany";

type CompanySession = {
  name: string;
  email: string;
  organizationNo: string;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  adminName: string;
  employeesCount: number;
};


interface CompanyNavbarClientProps {
  company: CompanySession | null;
}

export default function CompanyNavbarClient({ company }: CompanyNavbarClientProps) {
  const pathname = usePathname();

  const employees = []; // placeholder if needed

  return (
    <>
      <nav className="w-full bg-teal-600 px-4 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">

          <div className="flex items-center gap-8 h-full">
            <div className="text-2xl font-bold tracking-wide">
              <Link href="/company">Arbetsdesk</Link>
            </div>

            <div className="hidden md:flex items-center gap-6 font-medium h-full">
              <NavItem href="/company" label="Start" icon={Home} pathname={pathname} />
              <NavItem href="/company/schedule" label="Schedule" icon={Calendar} pathname={pathname} />
              <NavItem href="/company/time" label="Time" icon={Clock} pathname={pathname} />
              <NavItem href="/company/salary" label="Salary" icon={Wallet} pathname={pathname} />
              <NavItem href="/company/tips" label="Tips" icon={Wallet} pathname={pathname} />
              <NavItem href="/company/analysis" label="Analysis" icon={BarChart} pathname={pathname} />
              <NavItem href="/company/employee" label="Employee" icon={Users} pathname={pathname} />
              <NavItem href="/company/message" label="Message" icon={MessageSquare} pathname={pathname} />
            </div>
          </div>

          <CompanyUserMenu company={company} />
        </div>
      </nav>

      <MobileBottomNavCompany />
    </>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname?: string;
}

function NavItem({ href, label, icon: Icon, pathname }: NavItemProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 transition-colors h-14
        ${isActive ? "bg-teal-700" : "hover:text-gray-300"}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}

