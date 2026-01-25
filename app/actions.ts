"use server";
import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import {
  companyRegisterSchema,
  createEmployeeSchema,
  createUserSchema,
} from "./utils/schemas";
import { cookies } from "next/headers";
import { z } from "zod";
import { SalaryStatus } from "@prisma/client";

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
      role: data.role, // <-- optional
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

/* const SESSION_TTL_SECONDS = 60 * 20; */

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
    /* maxAge: SESSION_TTL_SECONDS, */
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
  if (company.loginCode !== loginCode) redirect("/login?error=invalid");

  const jar = await cookies();

  jar.set("company_session", company.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    /* maxAge: TTL, */
  });

  redirect("/company");
}

/* export async function loginEmployeeAction(formData: FormData) {
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
  if (employee.pinCode !== pinCode) redirect("/login?error=invalid");

  const jar = await cookies();

  jar.set("employee_session", employee.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
   // maxAge: TTL,
  });

  redirect("/employee/profile");
} */

/* export async function loginEmployeeAction(formData: FormData) {
  const personalNumber = formData.get("personalNumber") as string;
  const pinCode = formData.get("pinCode") as string;

  const employee = await prisma.employee.findFirst({
    where: { personalNumber },
    select: { pinCode: true },
  });

  if (!employee || employee.pinCode !== pinCode) {
    redirect("/login?error=invalid");
  }

  const jar = await cookies();
  jar.set("employee_personal", personalNumber, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  redirect("/employee/profile");
} */

//latest
export async function loginEmployeeAction(formData: FormData) {
  const personalNumber = formData.get("personalNumber") as string;
  const pinCode = formData.get("pinCode") as string;

  // Find employee via related Person
  const employee = await prisma.employee.findFirst({
    where: { person: { personalNumber } },
    select: {
      person: {
        select: {
          pinCode: true,
        },
      },
    },
  });

  if (!employee || employee.person?.pinCode !== pinCode) {
    redirect("/login?error=invalid");
  }

  const jar = await cookies();
  jar.set("employee_personal", personalNumber, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  redirect("/employee/profile");
}

export async function logoutUserAction() {
  const jar = await cookies();
  jar.delete({
    name: "user_session",
    path: "/",
  });
  redirect("/");
}

export async function registerCompanyAction(
  prevState: { success: boolean; message: string },
  formData: FormData,
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

/* export async function createEmployeeAction(prevState: any, formData: FormData) {
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

      address: formData.get("address"),
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country"),

      employmentType: formData.get("employmentType"),
      employementPercentage: formData.get("employementPercentage"),
      workplace: formData.get("workplace"),
      jobTitle: formData.get("jobTitle"),

      paymentMethod: formData.get("paymentMethod"),
      tax: formData.get("tax"),
      bankName: formData.get("bankName"),
      clearingNumber: formData.get("clearingNumber"),
      accountNumber: formData.get("accountNumber"),

      workingStatus: formData.get("workingStatus"),

      insurance: formData.get("insurance"),
  insuranceCompany: formData.get("insuranceCompany"),

  financialSupport: formData.get("financialSupport"),
  companyCar: formData.get("companyCar"),
  mealAllowance: formData.get("mealAllowance"),
  unionFees: formData.get("unionFees"),
  netDeduction: formData.get("netDeduction"),

  jobStartDate: formData.get("jobStartDate"),
  jobEndDate: formData.get("jobEndDate"),
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
} */

export async function loginEmployeeToday(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1️⃣ Fetch employee (to get companyId)
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  let log = await prisma.timeLog.findFirst({
    where: {
      employeeId,
      logDate: today,
    },
  });

  if (!log) {
    // 2️⃣ Create new log
    log = await prisma.timeLog.create({
      data: {
        employeeId,
        companyId: employee.companyId, // ✅ REQUIRED
        logDate: today,
        loginTime: new Date(),
      },
    });
  } else if (!log.loginTime) {
    // 3️⃣ Update existing log
    log = await prisma.timeLog.update({
      where: { id: log.id },
      data: {
        loginTime: new Date(),
      },
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
  const totalMinutes = Math.floor(
    (logoutTime.getTime() - loginTime.getTime()) / 60000,
  );

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

  // 1️⃣ Get employee to know which company they belong to
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // 2️⃣ Create the time log
  const log = await prisma.timeLog.create({
    data: {
      employeeId,
      companyId: employee.companyId, // ✅ REQUIRED
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
    (logoutTime.getTime() - loginTime.getTime()) / 60000,
  );

  return await prisma.timeLog.update({
    where: { id: log.id },
    data: { logoutTime, totalMinutes },
  });
}

export async function logoutCompanyAction() {
  "use server";

  const jar = await cookies();

  jar.delete({
    name: "company_session",
    path: "/",
  });

  redirect("/");
}

/* export async function getCompanyEmployees() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) {
    throw new Error("Unauthorized");
  }

  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      contractType: true,
      companyId: true,
      timeLogs: {
        orderBy: { logDate: "desc" },
        take: 1,
      },
    },
  });

  return employees.map((emp) => {
    const log = emp.timeLogs[0];
    let status: "Working" | "Off" | "On Break" = "Off";

    if (log?.loginTime && !log.logoutTime) status = "Working";
    if (log?.loginTime && log.logoutTime) status = "Off";

    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.contractType,
      companyId: emp.companyId,
      status,
    };
  });
} */

//latest
export async function getCompanyEmployees() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) {
    throw new Error("Unauthorized");
  }

  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      contractType: true,
      companyId: true, // ✅ include companyId
      person: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      timeLogs: {
        orderBy: { logDate: "desc" },
        take: 1,
      },
    },
  });

  return employees.map((emp) => {
    const log = emp.timeLogs[0];
    let status: "Working" | "Off" | "On Break" = "Off";

    if (log?.loginTime && !log.logoutTime) status = "Working";
    if (log?.loginTime && log.logoutTime) status = "Off";

    return {
      id: emp.id,
      name: emp.person.name,
      email: emp.person.email,
      phone: emp.person.phone,
      role: emp.contractType,
      companyId: emp.companyId, // ✅ include companyId here too
      status,
    };
  });
}

export async function addDailyTip({
  date,
  amount,
}: {
  date: string | Date;
  amount: number;
}) {
  // ✅ Get company id from cookie
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized: No company session");

  const parsedDate = new Date(date);

  return prisma.dailyTip.upsert({
    where: {
      companyId_date: {
        companyId,
        date: parsedDate,
      },
    },
    update: { amount },
    create: { companyId, date: parsedDate, amount },
  });
}

// app/actions/getAvailableTipMonths.ts
export async function getAvailableTipMonths() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const tips = await prisma.dailyTip.findMany({
    where: { companyId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  // Convert to YYYY-MM and remove duplicates
  const months = Array.from(
    new Set(
      tips.map(
        (t) =>
          `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`,
      ),
    ),
  );

  return months;
}

export async function getMonthlyTips(companyId: string, month: string) {
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const tips = await prisma.dailyTip.findMany({
    where: {
      companyId,
      date: { gte: start, lt: end },
    },
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      employee: { companyId },
      logDate: { gte: start, lt: end },
    },
    include: {
      employee: true,
    },
  });

  return { tips, timeLogs };
}

export async function getCompanyTimeReports() {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;

  if (!companyId) throw new Error("Unauthorized");

  const logs = await prisma.timeLog.findMany({
    where: { companyId },
    include: {
      employee: {
        include: {
          person: true, // ✅ include person table
        },
      },
    },
    orderBy: { logDate: "desc" },
  });

  // Group by date
  const map: Record<string, any[]> = {};

  logs.forEach((log) => {
    const date = log.logDate.toISOString().slice(0, 10);

    if (!map[date]) map[date] = [];

    map[date].push({
      name: log.employee.person.name, // updated
      personalNumber: log.employee.person.personalNumber, // updated
      status: log.loginTime && !log.logoutTime ? "Working" : "Not working",
      startTime: log.loginTime
        ? log.loginTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
      endTime: log.logoutTime
        ? log.logoutTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
      costCenter: `CC-${log.employee.id.slice(0, 4)}`,
      totalMinutes: log.totalMinutes ?? 0,
    });
  });

  return Object.entries(map).map(([date, employees]) => ({
    date,
    employees,
  }));
}

export type SalaryRow = {
  employeeId: string;
  name: string;
  jobTitle: string | null;
  personalNumber: string | null;
  contractType: "HOURLY" | "MONTHLY";
  totalMinutes: number;
  hourlyRate?: number | null;
  monthlySalary?: number | null;
  salary: number;
  status: "PENDING" | "PAID" | "REJECTED" | "DRAFT" | "APPROVED";
};

/* export async function getCompanyMonthlySalary(month: string): Promise<SalaryRow[]> {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const [year, monthNum] = month.split("-").map(Number);

  // 1️⃣ Fetch employees
  const employees = await prisma.employee.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      contractType: true,
      hourlyRate: true,
      monthlySalary: true,
    },
  });

  // 2️⃣ Fetch time logs for this month
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      logDate: {
        gte: new Date(year, monthNum - 1, 1),
        lt: new Date(year, monthNum, 1),
      },
    },
    select: {
      employeeId: true,
      loginTime: true,
      logoutTime: true,
      totalMinutes: true,
    },
  });

  // 3️⃣ Aggregate total minutes with fallback
  const minutesMap: Record<string, number> = {};
  const now = new Date();

  timeLogs.forEach((log) => {
    if (!minutesMap[log.employeeId]) minutesMap[log.employeeId] = 0;

    // Use stored totalMinutes if exists
    if (log.totalMinutes != null) {
      minutesMap[log.employeeId] += log.totalMinutes;
    } 
    // Calculate from login/logout
    else if (log.loginTime && log.logoutTime) {
      const diff = Math.floor((log.logoutTime.getTime() - log.loginTime.getTime()) / 60000);
      minutesMap[log.employeeId] += diff;
    } 
    // Live calculation if still logged in
    else if (log.loginTime && !log.logoutTime) {
      const diff = Math.floor((now.getTime() - log.loginTime.getTime()) / 60000);
      minutesMap[log.employeeId] += diff;
    }
  });

  // 4️⃣ Fetch salary slips
  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, month: monthNum, year },
    select: { employeeId: true, status: true },
  });

  const statusMap: Record<string, SalaryStatus> = {};
  salarySlips.forEach((s) => {
    statusMap[s.employeeId] = s.status;
  });

  // 5️⃣ Build final rows
  const rows: SalaryRow[] = employees.map((e) => {
    const totalMinutes = minutesMap[e.id] || 0;
    let salary = 0;

    if (e.contractType === "HOURLY") salary = (totalMinutes / 60) * (e.hourlyRate || 0);
    else salary = e.monthlySalary || 0;

    return {
      employeeId: e.id,
      name: e.name,
      contractType: e.contractType,
      totalMinutes,
      hourlyRate: e.hourlyRate,
      monthlySalary: e.monthlySalary,
      salary: Math.round(salary),
      status: statusMap[e.id] || "PENDING",
    };
  });

  return rows.sort((a, b) => a.name.localeCompare(b.name));
} */

export async function getCompanyMonthlySalary(
  month: string,
): Promise<SalaryRow[]> {
  const jar = await cookies();
  const companyId = jar.get("company_session")?.value;
  if (!companyId) throw new Error("Unauthorized");

  const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59); // last day of month

  // 1️⃣ Fetch employees hired on or before end of month
  const employees = await prisma.employee.findMany({
    where: { companyId, createdAt: { lte: endOfMonth } },
    select: {
      id: true,
      contractType: true,
      hourlyRate: true,
      monthlySalary: true,
      jobTitle: true,
      person: {
        select: {
          name: true,
          personalNumber: true,
        },
      },
    },
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      companyId,
      loginTime: { gte: startOfMonth, lte: endOfMonth },
      logoutTime: { not: null },
      totalMinutes: { not: null },
    },
    select: {
      employeeId: true,
      loginTime: true,
      logoutTime: true,
      totalMinutes: true,
    },
  });

  // 3️⃣ Aggregate total minutes
  const minutesMap: Record<string, number> = {};
  const now = new Date();

  timeLogs.forEach((log) => {
    if (!minutesMap[log.employeeId]) minutesMap[log.employeeId] = 0;

    if (log.totalMinutes != null) {
      minutesMap[log.employeeId] += log.totalMinutes;
    } else if (log.loginTime && log.logoutTime) {
      const diff = Math.floor(
        (log.logoutTime.getTime() - log.loginTime.getTime()) / 60000,
      );
      minutesMap[log.employeeId] += diff;
    } else if (log.loginTime && !log.logoutTime) {
      const diff = Math.floor(
        (now.getTime() - log.loginTime.getTime()) / 60000,
      );
      minutesMap[log.employeeId] += diff;
    }
  });

  // 4️⃣ Fetch salary slips for this month
  const salarySlips = await prisma.salarySlip.findMany({
    where: { companyId, month: monthNum, year },
    select: { employeeId: true, status: true },
  });

  const statusMap: Record<string, SalaryStatus> = {};
  salarySlips.forEach((s) => {
    statusMap[s.employeeId] = s.status;
  });

  // 5️⃣ Build final rows
  const rows: SalaryRow[] = employees.map((e) => {
    const totalMinutes = minutesMap[e.id] || 0;
    let salary = 0;

    if (e.contractType === "HOURLY")
      salary = (totalMinutes / 60) * (e.hourlyRate || 0);
    else salary = e.monthlySalary || 0;

    return {
  employeeId: e.id,
  name: e.person.name,
  personalNumber: e.person.personalNumber,
  contractType: e.contractType,
  jobTitle: e.jobTitle,
  totalMinutes,
  hourlyRate: e.hourlyRate,
  monthlySalary: e.monthlySalary,
  salary: e.contractType === "HOURLY"
    ? (totalMinutes / 60) * (e.hourlyRate || 0)
    : e.monthlySalary || 0,  // exact DB value
  status: statusMap[e.id] || "PENDING",
};

  });

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}
