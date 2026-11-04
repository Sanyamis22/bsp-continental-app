import { apiError } from "@/types/api";

/** JSON request that throws an Error carrying the API's message on any non-2xx / `success: false` reply. */
export async function apiRequest<T = unknown>(url: string, init?: RequestInit): Promise<T & { success?: boolean }> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const body = await res.json().catch(() => null);
  if (!res.ok || (body && body.success === false)) throw new Error(apiError(body, "Request failed. Please try again."));
  return body as T & { success?: boolean };
}
