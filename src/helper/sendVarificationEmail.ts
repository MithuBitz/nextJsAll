import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/VarificationEmail";

export async function sendVarificationEmail(
    username: string,
    email: string,
    varifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mistry message | Varification code',
            react: VerificationEmail({username, otp: varifyCode}),
          });
        return {success: true, message: "Send varification mail successfully"}
    } catch (emailError) {
        console.log("Varification email sending failed", emailError)
        return {success: false, message: "Failed to send varification mail"}
    }
}