"use server"
import { prisma } from "./utils/db";
import { createUserSchema } from "./utils/schemas";
export async function createUserAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  // Validate input
  const parsed = createUserSchema.parse({
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    personalNumber: data.personalNumber,
    address: data.address,
  })

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (existing) throw new Error('User already exists')

  // Save to DB
  await prisma.user.create({ data: parsed })
}
