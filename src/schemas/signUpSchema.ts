import { z } from 'zod'

export const userNameValidation = z
    .string()
    .min(2, "username atleast 2 character")
    .max(20, "username no more than 20 character")
// .regex(/, "username must not contain speacial character")



export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be atleast 6 character" })
})