import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
import AdminLayoutClient from "./adminComponent/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const userId = jar.get("user_session")?.value;

  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/");

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
