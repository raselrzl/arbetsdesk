"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserInfoMenu";
import CompanySelect from "./CompanySelect";
import MobileBottomNav from "./MobileBottomNav ";

type Employee = {
  id: string;
  name: string;
  email: string | null;
  companies: { id: string; name: string }[];
};

export default function EmployeeNavbar({ employee }: { employee: Employee }) {
  const pathname = usePathname();

  // Pass full objects
  const companies = employee.companies;

  const links = [
    { href: "/employee/schedule", label: "My Schedule" },
    { href: "/employee/salary-hours", label: "Salary & Hours" },
    { href: "/employee/profile", label: "Profile" },
  ];

  return (
    <>
      <nav className="w-full bg-teal-500 px-4 py-3 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-4 md:gap-8">
            <div className="text-xl font-bold tracking-wide">
              <Link href="/employee" className="uppercase">
                Arbetsdesk
              </Link>
            </div>

            <div className="hidden md:flex flex-wrap items-center gap-4 lg:gap-6 font-medium">
              {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 px-3 py-0.5 rounded-full transition-colors ${
                      active ? "bg-teal-700" : "hover:bg-teal-600"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
            <div className="hidden md:block">
              <CompanySelect companies={companies} />
            </div>

            <UserMenu
              user={{
                name: employee.name,
                email: employee.email,
                role: "EMPLOYEE",
              }}
              companies={employee.companies}// keep as {id, name}[]
            />
          </div>
        </div>
      </nav>

      <MobileBottomNav />
    </>
  );
}

