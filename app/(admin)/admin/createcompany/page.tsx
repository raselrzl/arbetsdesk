import { getLoggedInUser } from "@/app/actions";
import { redirect } from "next/navigation";
import CompanyRegisterForm from "./CompanyRegisterForm";

export default async function CreateCompanyPage() {
  const user = await getLoggedInUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  return (
    <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 md:pt-4">
      <CompanyRegisterForm user={user} />
    </div>
  );
}
