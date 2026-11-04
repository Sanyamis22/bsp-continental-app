import { NextResponse } from "next/server";

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "CONFIG"
  | "INTERNAL";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly retryAfterSec?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const unauthorized = (msg = "Authentication required.") => new AppError(401, "UNAUTHORIZED", msg);
export const forbidden = (msg = "You do not have access to this resource.") => new AppError(403, "FORBIDDEN", msg);
export const badRequest = (msg: string) => new AppError(400, "BAD_REQUEST", msg);
export const notFound = (msg = "Resource not found.") => new AppError(404, "NOT_FOUND", msg);

/**
 * Maps any thrown value to an HTTP response. Unexpected errors are logged and
 * returned as a generic message so internals never leak to clients.
 *
 * ponytail: body also carries legacy `success` / `message` / string `error` keys that existing
 * clients read — move to `{ error: { code, message } }` once clients use a shared API hook (Phase 3).
 */
export function errorResponse(err: unknown, fallbackMessage = "Something went wrong. Please try again.") {
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        error: err.message,
        code: err.code,
        ...(err.retryAfterSec ? { retryAfterSec: err.retryAfterSec } : {}),
      },
      {
        status: err.status,
        headers: err.retryAfterSec ? { "Retry-After": String(err.retryAfterSec) } : undefined,
      }
    );
  }
  console.error("Unhandled API error:", err instanceof Error ? err.message : err);
  return NextResponse.json(
    { success: false, message: fallbackMessage, error: fallbackMessage, code: "INTERNAL" satisfies ErrorCode },
    { status: 500 }
  );
}
