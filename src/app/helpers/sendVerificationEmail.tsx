import { resend } from "../lib/resend";
import VerificationEmail from "../../../emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";


export async function sendVerificationEmail (
    email: string,
    username: string,
    verifyCode: string
): Promise <ApiResponse>{

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystery App | Verification Code" ,
            react: VerificationEmail({username, otp: verifyCode})
        })
        return {success: true, message: "Veification email sent successfully"}
        
    } catch (emailError) {
        console.error("failed to send verification email",  emailError)
        return {success: false, message: "failed to send verification email"}
    }
}
