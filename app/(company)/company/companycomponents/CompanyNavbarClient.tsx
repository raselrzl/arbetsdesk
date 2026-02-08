"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CompanyUserMenu from "./CompanyUserMenu";
import MobileBottomNavCompany from "./MobileBottomNavCompany";
import { useState } from "react";
import PersonnummerLoginModal from "./PersonnummerLoginModal";

type CompanySession = {
  id: string;
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
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="w-full bg-[#00687a] px-4 fixed top-0 z-50 shadow-md text-white">
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
                icon="home.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/schedule"
                label="Schedule"
                icon="schedule.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/time"
                label="Time"
                icon="time.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/salary"
                label="Salary"
                icon="salary.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/tips"
                label="Tips"
                icon="4.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/analysis"
                label="Analysis"
                icon="analysis.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/employee"
                label="Employee"
                icon="emplyee.png"
                pathname={pathname}
              />
              <NavItem
                href="/company/message"
                label="Message"
                icon="2.png"
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
        company={company ? { id: company.id, name: company.name } : null}
      />
    </>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  pathname?: string;
}

function NavItem({ href, label, icon, pathname }: NavItemProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 transition-colors h-14 uppercase text-xs
        ${isActive ? "bg-white text-[#00687a]" : "hover:text-gray-300"}`}
    >
      <img
        src={`/icons/${icon}`}
        alt={label}
        className="w-4 h-4 object-contain"
      />
      {label}
    </Link>
  );
}
