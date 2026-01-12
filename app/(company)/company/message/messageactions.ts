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


export async function getCompanyMessages() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  // Fetch all messages sent by employees for this company
  const messages = await prisma.employeeMessage.findMany({
    where: { companyId },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: m.employee,
    isRead: m.isRead,
  }));
}



function getDateRangeFromDate(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}


export async function getEmployeeMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.employeeMessage.findMany({
    where: {
      companyId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: { employee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    employee: { id: m.employee.id, name: m.employee.name, email: m.employee.email ?? undefined },
    isRead: m.isRead,
  }));
}

export async function getCompanyMessagesForCompany(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const messages = await prisma.message.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: {
      company: { select: { name: true } },
      employee: { select: { name: true } }, // will be null for broadcasts
    },
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: m.isBroadcast,
    companyName: m.company.name,
    employeeName: m.employee?.name, // only filled for private messages
  }));
}


export async function fetchAllMessagesForDate(date: string) {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const { start, end } = getDateRangeFromDate(date);

  const employeeMessages = await prisma.employeeMessage.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: { employee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const companyMessagesRaw = await prisma.message.findMany({
    where: { companyId, createdAt: { gte: start, lte: end } },
    include: { company: { select: { name: true } }, employee: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const companyMessages = companyMessagesRaw.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    isBroadcast: m.isBroadcast,
    companyName: m.company.name,
    employeeName: m.employee?.name,
  }));

  return {
    employeeMessages: employeeMessages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      employee: { id: m.employee.id, name: m.employee.name, email: m.employee.email ?? undefined },
      isRead: m.isRead,
    })),
    companyMessages,
  };
}