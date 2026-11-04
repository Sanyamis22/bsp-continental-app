import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { requireEnv } from "@/lib/env";
import { requireFeature } from "@/lib/features";
import { AppError, errorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { parseBody } from "@/lib/validation";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .min(1)
    .max(20),
});

const SYSTEM_PROMPT = `You are the official AI Assistant of "BSP Continental", based in Bilaspur, Chhattisgarh.
You help clients with:
1. Property Paper Verification (Zameen/Makaan ke kagaz check karna).
2. Loan Rejection Consultation (Loan reject hone par sahi tarika batana).
3. CIBIL Score Improvement Service (Low CIBIL score ko sudharna).
Language Policy: Conversational Hinglish. Keep answers short, positive, and direct.`;

export async function POST(req: Request) {
  try {
    requireFeature("CHAT");
    const user = await requireUser();
    await rateLimit(`chat:${user.email.toLowerCase()}`, 20, 60);
    const { messages } = parseBody(bodySchema, await req.json().catch(() => null));
    const apiKey = requireEnv("GROQ_API_KEY");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error status:", response.status);
      throw new AppError(502, "INTERNAL", "Assistant is unavailable right now.");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response generated.";
    return NextResponse.json({ reply });
  } catch (error) {
    return errorResponse(error, "Assistant is unavailable right now.");
  }
}
