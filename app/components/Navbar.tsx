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
    <nav className="w-full bg-white shadow-sm px-4 py-3 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div className="text-2xl font-bold uppercase text-teal-900">
          <Link href="/">Arbets-desk</Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
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

          <Link href="/integrations" className="hover:text-teal-700">
            Integrations
          </Link>
          <Link href="/pricing" className="hover:text-teal-700">
            Pricing
          </Link>
          <Link href="/analytics" className="hover:text-teal-700">
            Analytics+
          </Link>
          <Link href="/contact" className="hover:text-teal-700">
            Contact
          </Link>
          <Link href="/admin/createuser" className="hover:text-teal-700">
            Register
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
