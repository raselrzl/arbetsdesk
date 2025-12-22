import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";
import { Suspense } from "react";

export default async function Page() {
  const cookieStore =await cookies();

  const userSession = cookieStore.get("user_session");
  const companySession = cookieStore.get("company_session");
  const employeeSession = cookieStore.get("employee_session");

  if (userSession) {
    redirect("/");
  }

  if (companySession) {
    redirect("/company");
  }

  if (employeeSession) {
    redirect("/employee/profile");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
