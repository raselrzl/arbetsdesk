// Define the schema outside of "use server"
import { z } from 'zod'
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  personalNumber: z.string().min(5),
  address: z.string().min(1),
  pinNumber: z.string().min(4),
})


export const companyRegisterSchema = z.object({
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  organizationNo: z.string().min(6),
  loginCode: z.string().min(4),
  price: z.number(),
});


export const createEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  personalNumber: z.string().optional().or(z.literal("")),
  pinCode: z.string().min(4).max(6),
  contractType: z.enum(["HOURLY", "MONTHLY"]),
  hourlyRate: z.coerce.number().optional(),
  monthlySalary: z.coerce.number().optional(),
});

export const loginSchema = z.object({
  personalNumber: z.string().optional(),
  pinNumber: z.string().optional(),
  pinCode: z.string().optional(),
  organizationNo: z.string().optional(),
  loginCode: z.string().optional(),
});



