import { AppError } from "@/lib/errors";

/** Read a required env var. Fails closed; the variable name is logged, never sent to clients. */
export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new AppError(500, "CONFIG", "Server is not configured correctly.");
  }
  return value;
}
