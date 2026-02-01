import Link from "next/link";
import { cookies } from "next/headers";
import UserMenu from "./UserMenu";
import Dropdown from "./Dropdown";
import { prisma } from "../utils/db";
import MobileMenu from "./MobileMenu";
export default async function Navbar() {
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

  return (
    <nav className="w-full bg-[#00687a] sm:shadow-md shadow-teal-100 px-4 py-3 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div className="text-xl font-bold uppercase text-gray-200">
          <Link href="/">Arbets-desk</Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3 text-gray-200">
          <Dropdown
            label="Features"
            href="/features"
            items={[
              ["Time Log", "/features/timelog"],
              ["Scheduling", "/features/schedule"],
              ["Payment", "/features/payroll"],
              ["Tip Distribution", "/features/tips"],
              ["Analytics", "/features/analytics"],
              ["Employee", "/features/employee"],
              ["Time Report", "/features/time"],
            ]}
          />

          <Dropdown
            label="Industries"
            href="/industries"
            items={[
              ["Hotels", "/industries/hotel"],
              ["Restaurants", "/industries/restaurant"],
              ["Fast Food / Café", "/industries/fastfood-cafe"],
              ["Retail", "/industries/retail"],
              ["Accounting Firms", "/industries/accounting"],
            ]}
          />

          <Link href="/integrations" className="hover:text-gray-300">
            Integrations
          </Link>
          <Link href="/pricing" className="hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/analytics" className="hover:text-gray-300">
            Analytics+
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
          {/* User Menu */}
          <UserMenu user={user} />
        </div>

        {/* MOBILE MENU */}
        <MobileMenu user={user} />
      </div>
    </nav>
  );
}
