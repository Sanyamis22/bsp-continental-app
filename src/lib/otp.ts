import crypto from "crypto";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import { requireEnv } from "@/lib/env";
import { assertCooldown, rateLimit, startCooldown } from "@/lib/rate-limit";

export type OtpPurpose = "register" | "reset";

const OTP_TTL_MS = 10 * 60 * 1000;

/** Wrong guesses allowed per issued code. The code is burned on the last one. */
export const MAX_OTP_ATTEMPTS = 5;
/** Minimum gap between two sends to the same number (enforced server-side, not just in the UI). */
export const OTP_RESEND_COOLDOWN_SEC = 30;
/** Sends allowed to one number in any trailing 10 minutes. */
const OTP_SENDS_PER_WINDOW = 3;
const OTP_SEND_WINDOW_SEC = 10 * 60;
/** Verify calls allowed for one number in any trailing 10 minutes (on top of the per-code attempt cap). */
const OTP_VERIFIES_PER_WINDOW = 10;
/** After a code is burned by wrong guesses, that number cannot request or verify codes for this long. */
export const OTP_LOCKOUT_SEC = 15 * 60;

const lockKey = (purpose: OtpPurpose, key: string) => `otp-lock:${purpose}:${key}`;
const resendKey = (purpose: OtpPurpose, key: string) => `otp-resend:${purpose}:${key}`;

function hashCode(code: string): string {
  return crypto.createHmac("sha256", requireEnv("NEXTAUTH_SECRET")).update(code).digest("hex");
}

/**
 * Creates (replacing any previous) OTP and returns the plaintext code to deliver.
 * Enforces: lockout, 30s resend cooldown, and a sliding-window cap of sends per number.
 */
export async function issueOtp(purpose: OtpPurpose, key: string, meta?: { email?: string }): Promise<string> {
  await assertCooldown(lockKey(purpose, key), "Too many wrong codes for this number.");
  await assertCooldown(resendKey(purpose, key), "A code was just sent.");
  await rateLimit(`otp-send:${purpose}:${key}`, OTP_SENDS_PER_WINDOW, OTP_SEND_WINDOW_SEC);

  await connectDB();
  const code = crypto.randomInt(100000, 1000000).toString();
  await Otp.findOneAndUpdate(
    { purpose, key },
    { $set: { codeHash: hashCode(code), meta, attempts: 0, expiresAt: new Date(Date.now() + OTP_TTL_MS) } },
    { upsert: true }
  );
  await startCooldown(resendKey(purpose, key), OTP_RESEND_COOLDOWN_SEC);
  return code;
}

/** Discards an OTP, e.g. when the delivery to the user failed. */
export async function discardOtp(purpose: OtpPurpose, key: string): Promise<void> {
  await connectDB();
  await Otp.deleteOne({ purpose, key });
}

export type OtpCheck = { ok: true; meta?: { email?: string } } | { ok: false };

/**
 * Checks a code in constant time. Wrong guesses are counted; the MAX_OTP_ATTEMPTS-th wrong guess burns
 * the code and locks the number out for OTP_LOCKOUT_SEC. `consume: true` deletes the OTP on success.
 */
export async function verifyOtp(
  purpose: OtpPurpose,
  key: string,
  code: string,
  options: { consume: boolean }
): Promise<OtpCheck> {
  await assertCooldown(lockKey(purpose, key), "Too many wrong codes for this number.");
  await rateLimit(`otp-verify:${purpose}:${key}`, OTP_VERIFIES_PER_WINDOW, OTP_SEND_WINDOW_SEC);

  await connectDB();
  const doc = await Otp.findOne({ purpose, key });
  if (!doc || doc.expiresAt.getTime() <= Date.now()) return { ok: false };

  const given = Buffer.from(hashCode(code.trim()), "hex");
  const stored = Buffer.from(doc.codeHash, "hex");
  const match = given.length === stored.length && crypto.timingSafeEqual(given, stored);

  if (!match) {
    // Atomic increment so parallel guesses cannot all read the same attempt count.
    const updated = await Otp.findOneAndUpdate({ _id: doc._id }, { $inc: { attempts: 1 } }, { new: true });
    if (updated && updated.attempts >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteOne({ _id: doc._id });
      await startCooldown(lockKey(purpose, key), OTP_LOCKOUT_SEC);
    }
    return { ok: false };
  }

  if (options.consume) await Otp.deleteOne({ _id: doc._id });
  return { ok: true, meta: doc.meta?.email ? { email: doc.meta.email } : undefined };
}
