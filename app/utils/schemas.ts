// Define the schema outside of "use server"
import { z } from "zod";
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  personalNumber: z.string().min(5),
  address: z.string().min(1),
  pinNumber: z.string().min(4),
});

export const companyRegisterSchema = z.object({
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  organizationNo: z.string().min(6),
  loginCode: z.string().min(4),
  price: z.number(),
});

/* export const createEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  personalNumber: z.string().optional().or(z.literal("")),
  pinCode: z.string().min(4).max(6),
  contractType: z.enum(["HOURLY", "MONTHLY"]),
  hourlyRate: z.coerce.number().optional(),
  monthlySalary: z.coerce.number().optional(),

  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  employmentType: z
    .enum(["PERMANENT", "INTERN", "TEMPORARY", "PROVISIONARY", "OTHER"])
    .optional(),
  workplace: z.string().optional(),
  jobTitle: z.string().optional(),
  employementPercentage: z.coerce.number().optional(),

  paymentMethod: z
    .enum(["BANKTRANSFER", "PAYROLLFILE", "MANUAL", "OTHER"])
    .optional(),
  bankName: z.string().optional(),
  clearingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  tax: z.coerce.number().optional(),

   workingStatus: z
    .enum(["ACTIVE", "TERMINATED", "LEAVE", "PENDING", "OTHER"])
    .optional(),


  insuranceCompany: z.string().optional(),
insurance: z.preprocess((val) => val === "on", z.boolean()).default(true),
financialSupport: z.preprocess((val) => val === "on", z.boolean()).default(false),
companyCar: z.preprocess((val) => val === "on", z.boolean()).default(false),
mealAllowance: z.preprocess((val) => val === "on", z.boolean()).default(false),
unionFees: z.preprocess((val) => val === "on", z.boolean()).default(false),
netDeduction: z.preprocess((val) => val === "on", z.boolean()).default(false),

jobStartDate: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
jobEndDate: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),



}); */
//new
export const createEmployeeSchema = z.object({
  personId: z.string().min(1, "Person is required"),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  personalNumber: z.string().optional().or(z.literal("")),
  pinCode: z.string().min(4).max(6),

  contractType: z.enum(["HOURLY", "MONTHLY"]),
  hourlyRate: z.coerce.number().optional(),
  monthlySalary: z.coerce.number().optional(),

  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  employmentType: z
    .enum(["PERMANENT", "INTERN", "TEMPORARY", "PROVISIONARY", "OTHER"])
    .optional(),
  workplace: z.string().optional(),
  jobTitle: z.string().optional(),
  employementPercentage: z.coerce.number().optional(),

  paymentMethod: z
    .enum(["BANKTRANSFER", "PAYROLLFILE", "MANUAL", "OTHER"])
    .optional(),
  bankName: z.string().optional(),
  clearingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  tax: z.coerce.number().optional(),

  workingStatus: z
    .enum(["ACTIVE", "TERMINATED", "LEAVE", "PENDING", "OTHER"])
    .optional(),

  insuranceCompany: z.string().optional(),
  insurance: z.preprocess((val) => val === "on", z.boolean()).default(true),
  financialSupport: z.preprocess((val) => val === "on", z.boolean()).default(false),
  companyCar: z.preprocess((val) => val === "on", z.boolean()).default(false),
  mealAllowance: z.preprocess((val) => val === "on", z.boolean()).default(false),
  unionFees: z.preprocess((val) => val === "on", z.boolean()).default(false),
  netDeduction: z.preprocess((val) => val === "on", z.boolean()).default(false),

  jobStartDate: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  jobEndDate: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
});

export const loginSchema = z.object({
  personalNumber: z.string().optional(),
  pinNumber: z.string().optional(),
  pinCode: z.string().optional(),
  organizationNo: z.string().optional(),
  loginCode: z.string().optional(),
});
