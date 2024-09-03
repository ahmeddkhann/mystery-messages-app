import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, "message must not be less than 10 characters")
    .max(300, "message must not be more than 300 characters")
})