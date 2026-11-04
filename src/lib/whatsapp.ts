import { requireEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";

/** Sends the 6-digit OTP through the Resiliohub WhatsApp template. `sendTo` must include country code if the gateway needs it. */
export async function sendOtpWhatsApp(sendTo: string, code: string): Promise<void> {
  const apiToken = requireEnv("RESILIO_API_TOKEN");
  let response: Response;
  try {
    response = await fetch("https://resiliohub.com/api/v1/send_templet", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sendTo, templetName: "auth", exampleArr: [code] }),
    });
  } catch (err) {
    console.error("WhatsApp gateway network error:", err instanceof Error ? err.message : err);
    throw new AppError(502, "INTERNAL", "Network error while connecting to WhatsApp gateway.");
  }
  if (!response.ok) {
    console.error("WhatsApp gateway rejected OTP request, status:", response.status);
    throw new AppError(400, "BAD_REQUEST", "Failed to dispatch WhatsApp OTP. Please check the mobile number format.");
  }
}
