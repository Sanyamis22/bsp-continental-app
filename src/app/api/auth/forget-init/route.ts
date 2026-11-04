import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, errorResponse } from "@/lib/errors";
import { AuthService } from "@/services/AuthService";
import { discardOtp, issueOtp } from "@/lib/otp";
import { normalizePhoneNumber } from "@/lib/phone";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { parseBody } from "@/lib/validation";
import { sendOtpWhatsApp } from "@/lib/whatsapp";

const bodySchema = z.object({ phone: z.string().trim().min(1).max(20) });

export async function POST(req: Request) {
  try {
    const { phone } = parseBody(bodySchema, await req.json().catch(() => null));
    const targetPhone = normalizePhoneNumber(phone);
    if (targetPhone.length !== 10) throw badRequest("Please enter a valid 10-digit mobile number.");

    await rateLimit(`reset-init:ip:${clientIp(req)}`, 10, 60 * 60);

    await AuthService.assertResettable(targetPhone);

    const code = await issueOtp("reset", targetPhone);
    try {
      await sendOtpWhatsApp(`91${targetPhone}`, code);
    } catch (err) {
      await discardOtp("reset", targetPhone);
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "Password reset verification code has been dispatched to your WhatsApp number.",
    });
  } catch (error) {
    return errorResponse(error, "An unexpected error occurred during password reset processing.");
  }
}
