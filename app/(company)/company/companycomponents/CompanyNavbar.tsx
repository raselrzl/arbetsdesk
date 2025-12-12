// app/components/CompanyNavbar.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";

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

export default async function CompanyNavbar() {
  const cookieStore = await cookies();
  const companySession = cookieStore.get("company_session")?.value;

  let company: { name: string } | null = null;

  if (companySession) {
    const dbCompany = await prisma.user.findUnique({
      where: { id: companySession },
      select: { name: true },
    });
    if (dbCompany) company = dbCompany;
  }

  return (
    <>
      <nav className="w-full bg-teal-600 px-4 py-3 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-wide">
              <Link href="/company">Arbetsdesk</Link>
            </div>

            <div className="hidden md:flex items-center gap-6 font-medium">
              <NavItem href="/company" label="Start" icon={Home} />
              <NavItem href="/company/schedule" label="Schedule" icon={Calendar} />
              <NavItem href="/company/time" label="Time" icon={Clock} />
              <NavItem href="/company/salary" label="Salary" icon={Wallet} />
              <NavItem href="/company/tips" label="Tips" icon={Wallet} />
              <NavItem href="/company/analysis" label="Analysis" icon={BarChart} />
              <NavItem href="/company/employee" label="Employee" icon={Users} />
              <NavItem href="/company/message" label="Message" icon={MessageSquare} />
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
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  return (
    <Link href={href} className="hover:text-gray-200 flex items-center gap-2">
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
