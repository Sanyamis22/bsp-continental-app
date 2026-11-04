import connectDB from "@/lib/db";
import RateLimit from "@/models/RateLimit";
import { AppError } from "@/lib/errors";

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

interface SlidingWindowDoc {
  hits?: number[];
  allowed?: boolean;
}

/**
 * Atomically trims hits older than the window, admits this hit only if fewer than `limit`
 * remain, and slides the TTL. One aggregation-pipeline update on one document, so concurrent
 * requests (even across serverless instances) cannot both squeeze through the last slot.
 */
async function slidingWindowHit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const update = [
    {
      $set: {
        hits: {
          $filter: {
            input: { $ifNull: ["$hits", []] },
            as: "t",
            cond: { $gt: ["$$t", now - windowMs] },
          },
        },
      },
    },
    { $set: { allowed: { $lt: [{ $size: "$hits" }, limit] } } },
    {
      $set: {
        hits: { $cond: ["$allowed", { $concatArrays: ["$hits", [now]] }, "$hits"] },
        expiresAt: new Date(now + windowMs),
      },
    },
  ];
  const doc = (await RateLimit.collection.findOneAndUpdate({ key }, update, {
    upsert: true,
    returnDocument: "after",
  })) as SlidingWindowDoc | null;
  return { doc, now, windowMs };
}

/**
 * Sliding-window-log limiter backed by Mongo. Allows at most `limit` hits in ANY trailing
 * `windowSec` seconds (no fixed-window burst at the boundary). Rejected hits are not recorded,
 * so hammering a locked key does not extend the lock. Throws AppError 429 with Retry-After.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<void> {
  await connectDB();
  let result;
  try {
    result = await slidingWindowHit(key, limit, windowSec);
  } catch (err) {
    // Two first-ever hits can race on the unique index; the retry then updates the winner's doc.
    if ((err as { code?: number })?.code === 11000) result = await slidingWindowHit(key, limit, windowSec);
    else throw err;
  }

  if (result.doc?.allowed === false) {
    const oldest = Math.min(...(result.doc.hits ?? [result.now]));
    const retryAfter = Math.max(1, Math.ceil((oldest + result.windowMs - result.now) / 1000));
    throw new AppError(429, "RATE_LIMITED", "Too many attempts. Please try again later.", retryAfter);
  }
}

const cooldownKey = (key: string) => `cooldown:${key}`;

/** Throws 429 (with Retry-After) while a cooldown started by `startCooldown` is still running. */
export async function assertCooldown(key: string, message = "Please wait before trying again."): Promise<void> {
  await connectDB();
  const doc = await RateLimit.collection.findOne({ key: cooldownKey(key), expiresAt: { $gt: new Date() } });
  if (!doc) return;
  const retryAfter = Math.max(1, Math.ceil((doc.expiresAt.getTime() - Date.now()) / 1000));
  throw new AppError(429, "RATE_LIMITED", `${message} Try again in ${retryAfter}s.`, retryAfter);
}

/** Starts (or restarts) a cooldown of `seconds` for `key`. */
export async function startCooldown(key: string, seconds: number): Promise<void> {
  await connectDB();
  await RateLimit.collection.updateOne(
    { key: cooldownKey(key) },
    { $set: { expiresAt: new Date(Date.now() + seconds * 1000) } },
    { upsert: true }
  );
}
