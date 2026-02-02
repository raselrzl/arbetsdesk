"use server";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const business = formData.get("business") as string | null;
  const phone = formData.get("phone") as string | null;

  if (!name || !email) {
    throw new Error("Missing required fields");
  }

  await prisma.contactRequest.create({
    data: {
      name,
      email,
      business: business || undefined,
      phone: phone || undefined,
    },
  });

  redirect("/thank-you");
}
