import { z } from 'zod'

export const formSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().optional(),
  suffix: z.string().optional(),
  preferred_name: z.string().optional(),
  birth_date: z.date().min(1, "Birth date is required"),
  phone_number: z.string()
    .min(10, "Please enter a valid phone number")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  address: z.string().min(1, "Address is required."),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirm_password: z.string()
})
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password", "password"]
  });

  
export type UserInput = z.infer<typeof formSchema>;