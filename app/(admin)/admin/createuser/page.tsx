import { getLoggedInUser } from "@/app/actions";
import UserRegistrationForm from "@/app/components/UserRegistrationForm";
import { redirect } from "next/navigation";



export default async function CreateUserPage() {
  const user = await getLoggedInUser();
  
    if (!user) redirect("/login");
    if (user.role !== "SUPERADMIN") redirect("/unauthorized");
  return (
    <div>
      <UserRegistrationForm />
    </div>
  );
}
