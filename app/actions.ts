"use server"
import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import { companyRegisterSchema, createEmployeeSchema, createUserSchema } from "./utils/schemas";
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

    case "ADMIN":
      return redirect("/admin");

    case "SUPERADMIN":
      return redirect("/super-admin");

    default:
      return redirect("/");
  }
}


const TTL = 60 * 60 * 24;

export async function loginCompanyAction(formData: FormData) {
  const organizationNo = formData.get("organizationNo") as string;
  const loginCode = formData.get("loginCode") as string;

  if (!organizationNo || !loginCode) {
    redirect("/login?error=missing");
  }

  const company = await prisma.company.findUnique({
    where: { organizationNo },
    select: { id: true, loginCode: true },
  });

  if (!company) redirect("/login?error=notfound");
  if (company.loginCode !== loginCode)
    redirect("/login?error=invalid");

  const jar = await cookies();

  jar.set("company_session", company.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: TTL,
  });

  redirect("/company");
}


export async function loginEmployeeAction(formData: FormData) {
  const personalNumber = formData.get("personalNumber") as string;
  const pinCode = formData.get("pinCode") as string;

  if (!personalNumber || !pinCode) {
    redirect("/login?error=missing");
  }

  const employee = await prisma.employee.findFirst({
    where: { personalNumber },
    select: { id: true, pinCode: true },
  });

  if (!employee) redirect("/login?error=notfound");
  if (employee.pinCode !== pinCode)
    redirect("/login?error=invalid");

  const jar = await cookies();

  jar.set("employee_session", employee.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: TTL,
  });

  redirect("/employee/profile");
}

  
export async function logoutUserAction() {
  const jar = await cookies();
  jar.delete({
    name: "user_session",
    path: "/",
  });
  redirect("/login");
}

export async function registerCompanyAction(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  try {
    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    const raw = Object.fromEntries(formData.entries());

    const data = companyRegisterSchema.parse({
      companyName: raw.companyName,
      companyEmail: raw.companyEmail,
      organizationNo: raw.organizationNo,
      loginCode: raw.loginCode,
      price: Number(raw.price),
    });

    await prisma.company.create({
      data: {
        adminId: user.id,
        name: data.companyName,
        email: data.companyEmail,
        organizationNo: data.organizationNo,
        loginCode: data.loginCode,
        price: data.price,
      },
    });

    return {
      success: true,
      message: "Company created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function getLoggedInUser() {
  const jar = await cookies();
  const userId = jar.get("user_session")?.value;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function createEmployeeAction(
  prevState: any,
  formData: FormData
) {
  try {
    const jar = await cookies();
    const companyId = jar.get("company_session")?.value;

    if (!companyId) {
      return { success: false, message: "Unauthorized" };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return { success: false, message: "Company not found" };
    }

    const data = createEmployeeSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      personalNumber: formData.get("personalNumber"),
      pinCode: formData.get("pinCode"),
      contractType: formData.get("contractType"),
      hourlyRate: formData.get("hourlyRate"),
      monthlySalary: formData.get("monthlySalary"),
    });

    await prisma.employee.create({
      data: {
        ...data,
        companyId: company.id,
      },
    });

    return { success: true, message: "Employee created successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.errors?.[0]?.message || "Something went wrong",
    };
  }
}

export async function loginEmployeeToday(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let log = await prisma.timeLog.findFirst({
    where: { employeeId, logDate: today },
  });

  if (!log) {
    // Create new log for today
    log = await prisma.timeLog.create({
      data: {
        employeeId,
        logDate: today,
        loginTime: new Date(),
      },
    });
  } else if (!log.loginTime) {
    // Update existing log
    log = await prisma.timeLog.update({
      where: { id: log.id },
      data: { loginTime: new Date() },
    });
  }

  return log;
}

export async function logoutEmployeeToday(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await prisma.timeLog.findFirst({
    where: { employeeId, logDate: today },
  });

  if (!log) throw new Error("Employee has not logged in today");

  const loginTime = log.loginTime ?? new Date();
  const logoutTime = new Date();
  const totalMinutes = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 60000);

  return await prisma.timeLog.update({
    where: { id: log.id },
    data: { logoutTime, totalMinutes },
  });
}

export async function getEmployeeStatus(companyId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.employee.findMany({
    where: { companyId },
    include: {
      timeLogs: {
        where: { logDate: today },
      },
    },
  });
}




// ------------------- LOGIN -------------------
export async function loginEmployee(employeeId: string) {
  "use server";

  const now = new Date();

  // Always create a new log
  const log = await prisma.timeLog.create({
    data: {
      employeeId,
      loginTime: now,
      logoutTime: null,
      logDate: now,
    },
  });

  return log;
}

// ------------------- LOGOUT -------------------
export async function logoutEmployee(employeeId: string) {
  "use server";

  // Find the latest open log
  const log = await prisma.timeLog.findFirst({
    where: { employeeId, logoutTime: null },
    orderBy: { loginTime: "desc" },
  });

  if (!log) throw new Error("Employee is not logged in");

  const logoutTime = new Date();
  const loginTime = log.loginTime!;
  const totalMinutes = Math.floor(
    (logoutTime.getTime() - loginTime.getTime()) / 60000
  );

  return await prisma.timeLog.update({
    where: { id: log.id },
    data: { logoutTime, totalMinutes },
  });
}
