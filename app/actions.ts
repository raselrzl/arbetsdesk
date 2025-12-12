"use server"
import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import { createUserSchema } from "./utils/schemas";

import { cookies } from "next/headers";
import { z } from "zod";

export async function createUserAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    const parsed = createUserSchema.parse({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      personalNumber: data.personalNumber,
      address: data.address,
      pinNumber: data.pinNumber, // <-- added pinNumber in schema
      role: data.role,           // <-- optional
    });

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existing) {
      return { success: false, message: "User already exists" };
    }

    await prisma.user.create({ data: parsed });

    return { success: true, message: "User registered successfully!" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}






const loginSchema = z.object({
  personalNumber: z.string().min(6, "Enter personal number"),
  pinNumber: z.string().min(4).max(4, "PIN must be 4 digits"),
});

const SESSION_TTL_SECONDS = 60 * 20;

export async function loginUserAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as {
    personalNumber: string;
    pinNumber: string;
  };

  const { personalNumber, pinNumber } = loginSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { personalNumber },
    select: { id: true, personalNumber: true, pinNumber: true, role: true },
  });

  if (!user) redirect("/login?error=notfound");
  if (user.pinNumber !== pinNumber) redirect("/login?error=invalid");

  const jar = await cookies();

  // Always set user session
  jar.set("user_session", user.id, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
  });

  switch (user.role) {

    case "EMPLOYEE":
      return redirect("/employee");

    case "COMPANY": {
      const company = await prisma.company.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      });

      if (!company) redirect("/login?error=nocompany");

      // Add company session ALSO
      jar.set("company_session", company.id, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_TTL_SECONDS,
      });

      return redirect("/company");
    }

    case "ADMIN":
      return redirect("/admin");

    case "SUPERADMIN":
      return redirect("/super-admin");

    default:
      return redirect("/");
  }
}


export async function logoutUserAction() {
  const jar = await cookies();
  jar.delete({
    name: "user_session",
    path: "/",
  });
  redirect("/login");
}



