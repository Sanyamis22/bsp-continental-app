import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { ADMIN_COOKIE, verifyAdminToken, type AdminClaims } from "@/lib/auth/admin-token";
import { unauthorized } from "@/lib/errors";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/** Returns the signed-in user or throws 401. */
export async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim();
  if (!session?.user || !email) throw unauthorized();
  return {
    id: session.user.id ?? "",
    email,
    name: session.user.name ?? "",
    role: session.user.role ?? "user",
  };
}

/** Returns verified admin claims or null (never throws on a missing/invalid cookie). */
export async function getAdmin(): Promise<AdminClaims | null> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

/** Returns verified admin claims or throws 401. */
export async function requireAdmin(): Promise<AdminClaims> {
  const admin = await getAdmin();
  if (!admin) throw unauthorized("Admin authentication required.");
  return admin;
}
