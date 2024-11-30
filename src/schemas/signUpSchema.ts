import { z } from 'zod'

export const userValidation = z
    .string()
    .min(2, "Username atleast 2 character")
    .max(20, "Username no more than 20 character")
// .regex(/, "Username must not contain speacial character")



export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be atleast 6 character" })
})