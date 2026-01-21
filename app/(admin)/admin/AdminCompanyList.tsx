import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AdminCompanyListProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export default async function AdminCompanyList({ user }: AdminCompanyListProps) {
  if (!user || user.role !== "ADMIN") return <p>Unauthorized</p>;

  // Fetch all companies for this admin
  const companies = await prisma.company.findMany({
    where: { adminId: user.id },
    select: {
      id: true,
      name: true,
      organizationNo: true,
      loginCode: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (companies.length === 0) {
    return (
      <div>
        <h2>Hi {user.name}</h2>
        <p>You have no registered companies yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
     {/*  <h2 className="text-lg font-semibold mb-4">Hi {user.name}, your registered companies:</h2>
 */}
      {/* Large screen table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Company Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Organization Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">PIN / Login Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Registered On</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{company.name}</td>
                <td className="border border-gray-300 px-4 py-2">{company.organizationNo}</td>
                <td className="border border-gray-300 px-4 py-2">{company.loginCode}</td>
                <td className="border border-gray-300 px-4 py-2">{company.createdAt.toDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const organizationNo = formData.get("organizationNo") as string;
                      const loginCode = formData.get("loginCode") as string;

                      if (!organizationNo || !loginCode) redirect("/login?error=missing");

                      const company = await prisma.company.findUnique({
                        where: { organizationNo },
                        select: { id: true, loginCode: true },
                      });

                      if (!company) redirect("/login?error=notfound");
                      if (company.loginCode !== loginCode) redirect("/login?error=invalid");

                      const jar = await cookies();
                      jar.set("company_session", company.id, {
                        httpOnly: true,
                        path: "/",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 365 * 10, // unlimited
                      });

                      redirect("/company");
                    }}
                  >
                    <input type="hidden" name="organizationNo" value={company.organizationNo} />
                    <input type="hidden" name="loginCode" value={company.loginCode} />
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Login
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-4">
        {companies.map((company) => (
          <div key={company.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <p>
              <strong>Company Name:</strong> {company.name}
            </p>
            <p>
              <strong>Organization Number:</strong> {company.organizationNo}
            </p>
            <p>
              <strong>PIN / Login Code:</strong> {company.loginCode}
            </p>
            <p>
              <strong>Registered On:</strong> {company.createdAt.toDateString()}
            </p>
            <form
              action={async (formData: FormData) => {
                "use server";
                const organizationNo = formData.get("organizationNo") as string;
                const loginCode = formData.get("loginCode") as string;

                if (!organizationNo || !loginCode) redirect("/login?error=missing");

                const company = await prisma.company.findUnique({
                  where: { organizationNo },
                  select: { id: true, loginCode: true },
                });

                if (!company) redirect("/login?error=notfound");
                if (company.loginCode !== loginCode) redirect("/login?error=invalid");

                const jar = await cookies();
                jar.set("company_session", company.id, {
                  httpOnly: true,
                  path: "/",
                  sameSite: "lax",
                  maxAge: 60 * 60 * 24 * 365 * 10,
                });

                redirect("/company");
              }}
            >
              <input type="hidden" name="organizationNo" value={company.organizationNo} />
              <input type="hidden" name="loginCode" value={company.loginCode} />
              <button className="mt-2 w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                Login
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
