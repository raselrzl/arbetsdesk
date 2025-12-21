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
import { useState } from "react";
import PersonnummerLoginModal from "./PersonnummerLoginModal";

type CompanySession = {
  id:string,
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

export default function CompanyNavbarClient({
  company,
}: CompanyNavbarClientProps) {
  const pathname = usePathname();

  const employees = []; // placeholder if needed

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="w-full bg-teal-600 px-4 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-3 h-full">
            <div
              onClick={() => setShowLogin(true)}
              className="text-xl font-bold tracking-wide uppercase cursor-pointer hover:text-teal-200"
            >
              Login
            </div>

            <div className="hidden lg:flex items-center gap-1 font-medium h-full">
              <NavItem
                href="/company"
                label="Start"
                icon={Home}
                pathname={pathname}
              />
              <NavItem
                href="/company/schedule"
                label="Schedule"
                icon={Calendar}
                pathname={pathname}
              />
              <NavItem
                href="/company/time"
                label="Time"
                icon={Clock}
                pathname={pathname}
              />
              <NavItem
                href="/company/salary"
                label="Salary"
                icon={Wallet}
                pathname={pathname}
              />
              <NavItem
                href="/company/tips"
                label="Tips"
                icon={Wallet}
                pathname={pathname}
              />
              <NavItem
                href="/company/analysis"
                label="Analysis"
                icon={BarChart}
                pathname={pathname}
              />
              <NavItem
                href="/company/employee"
                label="Employee"
                icon={Users}
                pathname={pathname}
              />
              <NavItem
                href="/company/message"
                label="Message"
                icon={MessageSquare}
                pathname={pathname}
              />
            </div>
          </div>

          <CompanyUserMenu company={company} />
        </div>
      </nav>

      <MobileBottomNavCompany />
      <PersonnummerLoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        company={
          company ? { id: company.id, name: company.name } : null
        }
      />
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
