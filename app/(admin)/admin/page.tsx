import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
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
    <div className="flex max-w-7xl flex-col py-20 ">
      <AdminCompanyList user={user}/>
    </div>
  );
}
