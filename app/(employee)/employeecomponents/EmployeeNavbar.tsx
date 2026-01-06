import Link from "next/link";
import { Calendar, Clock, Home } from "lucide-react";
import UserMenu from "./UserInfoMenu";
import CompanySelect from "./CompanySelect";
import MobileBottomNav from "./MobileBottomNav ";

type Employee = {
  id: string;
  name: string;
  email: string | null;
  company: {
    name: string;
  };
};

export default function EmployeeNavbar({
  employee,
}: {
  employee: Employee;
}) {
  const companies = [employee.company.name];

  return (
    <>
      {/* TOP NAV */}
      <nav className="w-full bg-teal-800 px-4 py-3 fixed top-0 z-50 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-wide">
              <Link href="/employee" className="uppercase">Arbetsdesk</Link>
            </div>

            <div className="hidden md:flex items-center gap-6 font-medium">
              <Link href="/employee" className="flex items-center gap-2">
                <Home className="w-4 h-4" /> Start
              </Link>

              <Link
                href="/employee/schedule"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> My Schedule
              </Link>

              <Link
                href="/employee/salary-hours"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> Salary & Hours
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <CompanySelect companies={companies} />
            </div>

            <UserMenu
              user={{
                name: employee.name,
                email: employee.email,
                role: "EMPLOYEE",
              }}
              companies={companies}
            />
          </div>
        </div>
      </nav>

      <MobileBottomNav />
    </>
  );
}
