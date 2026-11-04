import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, errorResponse } from "@/lib/errors";
import { AuthService } from "@/services/AuthService";
import { discardOtp, issueOtp, verifyOtp } from "@/lib/otp";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { emailSchema, parseBody, phoneSchema } from "@/lib/validation";
import { sendOtpWhatsApp } from "@/lib/whatsapp";

const bodySchema = z.object({
  action: z.enum(["INIT", "VERIFY", "FINAL"]),
  phone: phoneSchema,
  email: z.preprocess((v) => (v === "" ? undefined : v), emailSchema.optional()),
  name: z.string().trim().min(1).max(100).optional(),
  otp: z.string().trim().max(10).optional(),
  password: z.string().min(6).max(128).optional(),
});

export async function POST(req: Request) {
  try {
    const body = parseBody(bodySchema, await req.json().catch(() => null));
    const targetPhone = body.phone;
    const targetEmail = body.email ? body.email.toLowerCase().trim() : `${targetPhone}@bspcontinental.local`;
    const ip = clientIp(req);

    // INIT: create OTP and dispatch over WhatsApp
    if (body.action === "INIT") {
      await rateLimit(`register-init:ip:${ip}`, 10, 60 * 60);

      await AuthService.assertRegistrable(targetPhone, targetEmail);

      const code = await issueOtp("register", targetPhone, { email: targetEmail });
      try {
        await sendOtpWhatsApp(targetPhone, code);
      } catch (err) {
        await discardOtp("register", targetPhone);
        throw err;
      }
      return NextResponse.json({ success: true, message: "WhatsApp verification code sent successfully." });
    }

    // VERIFY: check the code without consuming it
    if (body.action === "VERIFY") {
      await rateLimit(`register-verify:ip:${ip}`, 30, 10 * 60); // per-number caps live in verifyOtp
      const check = await verifyOtp("register", targetPhone, body.otp ?? "", { consume: false });
      if (!check.ok) throw badRequest("Invalid or expired verification code.");
      return NextResponse.json({ success: true, message: "Verification code confirmed." });
    }

    // FINAL: consume OTP, create account
    await rateLimit(`register-final:ip:${ip}`, 30, 10 * 60);
    if (!body.name || !body.password) throw badRequest("Name and a password of at least 6 characters are required.");

    const check = await verifyOtp("register", targetPhone, body.otp ?? "", { consume: true });
    if (!check.ok) throw badRequest("Security session expired. Please restart the registration process.");

    const newUser = await AuthService.register({
      name: body.name,
      email: check.meta?.email || targetEmail,
      phone: targetPhone,
      password: body.password,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. You can now log in.",
      userId: newUser._id,
    });
  } catch (error) {
    return errorResponse(error, "Internal server error occurred.");
  }
}
