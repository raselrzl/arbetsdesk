// app/components/EmployeeNavbar.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/app/utils/db";
import UserMenu from "./UserInfoMenu";
import { Calendar, Clock, Home } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav ";

export default async function EmployeeNavbar() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  let user: { personalNumber: string; role: string } | null = null;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { personalNumber: true, role: true },
    });
    if (dbUser) user = dbUser;
  }

  const companies = [
    "Nordic Service AB",
    "BluePeak Solutions",
    "ArcticWorks Group",
    "Greenline Retail",
    "FjordTech Systems",
  ];

  return (
    <>
      {/* TOP NAV */}
      <nav className="w-full bg-teal-600 px-4 py-3 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-wide">
              <Link href="/">Arbetsdesk</Link>
            </div>

            {/* Desktop only links */}
            <div className="hidden md:flex items-center gap-6 font-medium">
              <Link href="/employee/start" className="hover:text-gray-200 flex items-center gap-2">
                <Home className="w-4 h-4" /> Start
              </Link>

              <Link href="/employee/schedule" className="hover:text-gray-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> My Schedule
              </Link>

              <Link href="/employee/salary-hours" className="hover:text-gray-200 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Salary & Hours Worked
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* Company dropdown only on desktop */}
            <div className="hidden md:block">
              <select className="bg-teal-700 text-white px-3 py-1 rounded-md cursor-pointer">
                {companies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Drawer trigger */}
            <UserMenu user={user} companies={companies} />
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav />
    </>
  );
}
