import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, errorResponse } from "@/lib/errors";
import { AuthService } from "@/services/AuthService";
import { verifyOtp } from "@/lib/otp";
import { normalizePhoneNumber } from "@/lib/phone";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { parseBody } from "@/lib/validation";

const bodySchema = z.object({
  phone: z.string().trim().min(1).max(20),
  otp: z.string().trim().min(1).max(10),
  password: z.string().min(6, "must be at least 6 characters").max(128),
});

export async function POST(req: Request) {
  try {
    const { phone, otp, password } = parseBody(bodySchema, await req.json().catch(() => null));
    const targetPhone = normalizePhoneNumber(phone);
    await rateLimit(`reset-final:ip:${clientIp(req)}`, 30, 10 * 60);

    const check = await verifyOtp("reset", targetPhone, otp, { consume: true });
    if (!check.ok) throw badRequest("Invalid or expired reset verification code!");

    await AuthService.resetPassword(targetPhone, password);

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    return errorResponse(error, "Internal server error occurred.");
  }
}
