import { z } from 'zod'


export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Message atleast 10 character" })
        .max(300, { message: "Message having olny 300 character" })
})