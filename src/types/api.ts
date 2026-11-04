export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** Narrow an unknown caught value to a message string. */
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
  return err instanceof Error ? err.message : fallback;
}

/** Extract a human message from any API error body: `{ error: { message } }`, legacy `{ error: "..." }` or `{ message }`. */
export function apiError(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const b = body as { error?: unknown; message?: unknown };
    if (b.error && typeof b.error === "object" && typeof (b.error as { message?: unknown }).message === "string") {
      return (b.error as { message: string }).message;
    }
    if (typeof b.error === "string" && b.error) return b.error;
    if (typeof b.message === "string" && b.message) return b.message;
  }
  return fallback;
}
