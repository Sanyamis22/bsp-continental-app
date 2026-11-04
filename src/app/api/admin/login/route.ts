import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, ADMIN_TOKEN_TTL_SEC, signAdminToken } from "@/lib/auth/admin-token";
import { requireEnv } from "@/lib/env";
import { badRequest, errorResponse, unauthorized } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  username: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

/** Constant-time string comparison (hashes first so lengths never leak). */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(req: Request) {
  try {
    await rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60);

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) throw badRequest("Please provide both Email and Password!");

    const adminUser = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || "").trim();
    if (!adminUser) requireEnv("ADMIN_USERNAME");
    const adminPass = requireEnv("ADMIN_PASSWORD");

    const { username, password } = parsed.data;
    const userOk = safeEqual(username.toLowerCase(), adminUser.toLowerCase());
    const passOk = safeEqual(password, adminPass);
    if (!(userOk && passOk)) throw unauthorized("Invalid Email or Master Password!");

    const token = await signAdminToken(adminUser);
    const response = NextResponse.json({ success: true, message: "Logged in successfully" });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_TOKEN_TTL_SEC,
    });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
