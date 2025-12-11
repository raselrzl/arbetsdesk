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
