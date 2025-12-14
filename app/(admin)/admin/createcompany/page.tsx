import { getLoggedInUser } from "@/app/actions";
import { redirect } from "next/navigation";
import CompanyRegisterForm from "./CompanyRegisterForm";

export default async function CreateCompanyPage() {
  const user = await getLoggedInUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  return <CompanyRegisterForm user={user} />;
}
