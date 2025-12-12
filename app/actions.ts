"use server"
import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import { createUserSchema } from "./utils/schemas";

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




import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  personalNumber: z.string().min(6, "Enter personal number"),
  pinNumber: z.string().min(4).max(4, "PIN must be 4 digits"),
});

const SESSION_TTL_SECONDS = 60 * 20; // 20 min session

export async function loginAction(input: z.infer<typeof loginSchema>) {
  const { personalNumber, pinNumber } = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { personalNumber },
    select: {
      id: true,
      personalNumber: true,
      pinNumber: true,
      role: true,
    },
  });

  // User not found
  if (!user) {
    redirect("/login?error=notfound");
  }

  // PIN mismatch
  if (user.pinNumber !== pinNumber) {
    redirect("/login?error=invalid");
  }

  // Create session cookie
  const jar = await cookies();
  jar.set("user_session", user.id, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
  });

  // Redirect by role
  let redirectPath = "/";

  switch (user.role) {
    case "EMPLOYEE":
      redirectPath = "/employee";
      break;
    case "COMPANY":
      redirectPath = "/company";
      break;
    case "ADMIN":
      redirectPath = "/admin";
      break;
    case "SUPERADMIN":
      redirectPath = "/super-admin";
      break;

    case "USER":
      redirectPath = "/profile";
      break;
    default:
      redirectPath = "/thank-you";
  }

  redirect(redirectPath);
}
