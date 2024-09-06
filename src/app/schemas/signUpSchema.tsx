import {z} from "zod"

export const usernameValidation = z
.string()
.min(6, "username must not be less than 6 characters")
.max(15, "usernam must not be more than 15 characters")
.regex(/^[a-zA-Z0-9]+$/, "username should not have specail characters")

const signUpSchema = z.object({
    username: usernameValidation,
    
    email: z
    .string()
    .email({message: "invalid email, please enter a valid email"}),

    password: z
    .string()
    .min(6, {message: "password cannot be less than 6 characters"})
    .max(12, {message: "password cannot be more than 12 characters"})

})