"use server";

import { prisma } from "@/app/utils/db";
import { cookies } from "next/headers";

export async function sendMessage(formData: FormData) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) {
    throw new Error("Unauthorized");
  }

  const content = formData.get("content") as string;
  const employeeId = formData.get("employeeId") as string | null;
  const sendToAll = formData.get("sendToAll") === "on";

  if (!content || content.trim().length === 0) {
    throw new Error("Message content is required");
  }

  await prisma.message.create({
    data: {
      companyId,
      content,
      isBroadcast: sendToAll,
      employeeId: sendToAll ? null : employeeId,
    },
  });
}
