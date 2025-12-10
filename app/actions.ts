"use server"
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
