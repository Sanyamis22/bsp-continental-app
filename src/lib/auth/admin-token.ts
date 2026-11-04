import { SignJWT, jwtVerify } from "jose";
import { AppError } from "@/lib/errors";

export const ADMIN_COOKIE = "bsp_admin_token";
export const ADMIN_TOKEN_TTL_SEC = 60 * 60 * 8;

const ISSUER = "bsp-continental";
const AUDIENCE = "bsp-admin";

export interface AdminClaims {
  sub: string;
  role: "super_admin";
}

function signingKey(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 32) {
    console.error("JWT_SECRET is missing or shorter than 32 characters.");
    throw new AppError(500, "CONFIG", "Server is not configured correctly.");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(subject: string): Promise<string> {
  return new SignJWT({ role: "super_admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TOKEN_TTL_SEC}s`)
    .sign(signingKey());
}

/** Verifies signature, expiry, issuer, audience and role. Returns null for anything invalid. */
export async function verifyAdminToken(token: string | undefined | null): Promise<AdminClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (payload.role !== "super_admin" || typeof payload.sub !== "string") return null;
    return { sub: payload.sub, role: "super_admin" };
  } catch {
    return null;
  }
}
