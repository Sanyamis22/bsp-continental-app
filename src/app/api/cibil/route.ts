import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { requireEnv } from "@/lib/env";
import { requireFeature } from "@/lib/features";
import { AppError, errorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { parseBody } from "@/lib/validation";

const bodySchema = z.object({
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "must be a valid PAN"),
});

export async function POST(req: Request) {
  try {
    requireFeature("CIBIL");
    const user = await requireUser();
    await rateLimit(`cibil:${user.email.toLowerCase()}`, 5, 60 * 60);
    const { pan } = parseBody(bodySchema, await req.json().catch(() => null));

    const apiKey = requireEnv("SANDBOX_API_KEY");
    const apiSecret = requireEnv("SANDBOX_API_SECRET");

    // 1. Authenticate & get access token
    const authRes = await fetch("https://api.sandbox.co.in/authenticate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-api-secret": apiSecret,
        "x-api-version": "1.0",
      },
      cache: "no-store",
    });
    const authData = await authRes.json();
    const token = authData.access_token || authData.data?.access_token;
    if (!token) {
      throw new AppError(502, "INTERNAL", "Verification service authentication failed.");
    }

    // 2. Sandbox accepts one of several payload formats; try until one is not a 400.
    const payloadsToTry = [
      { "@entity": "in.co.sandbox.kyc.pan.verify", pan, consent: "y", reason: "For KYC Verification" },
      { pan, consent: "y", reason: "KYC Verification" },
      { pan, consent: "y" },
    ];

    let successResponse: unknown = null;
    for (const payload of payloadsToTry) {
      const panRes = await fetch("https://api.sandbox.co.in/kyc/pan/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
          "x-api-key": apiKey,
          "x-api-version": "1.0",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const panData = await panRes.json();
      if (panData.code !== 400 && panRes.status !== 400) {
        successResponse = panData;
        break;
      }
    }

    if (!successResponse) {
      throw new AppError(400, "BAD_REQUEST", "PAN verification was rejected by the service.");
    }
    return NextResponse.json({ success: true, data: successResponse });
  } catch (error) {
    return errorResponse(error);
  }
}
