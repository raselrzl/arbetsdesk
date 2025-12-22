import { cookies } from "next/headers";
import CompanyNavbar from "./companycomponents/CompanyNavbar";
import { redirect } from "next/navigation";

export default async function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) redirect("/");
  return (
    <div className="">
      <CompanyNavbar />
      {children}
    </div>
  );
}
