import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
import AdminPage from "./AdminPageComponent";
import AdminCompanyList from "./AdminCompanyList";

export default async function AdminPageWrapper() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex max-w-7xl mx-auto flex-col py-10">
      <AdminPage user={user} />
      <AdminCompanyList user={user}/>
    </div>
  );
}
