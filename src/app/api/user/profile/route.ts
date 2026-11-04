import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { parseBody } from "@/lib/validation";
import { ProfileService } from "@/services/ProfileService";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ success: true, user: await ProfileService.get(user.email) });
  } catch (error) {
    return errorResponse(error);
  }
}

const updateSchema = z.object({
  phone: z.string().trim().max(20).optional().default(""),
  panCard: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), "must be a valid PAN")
    .optional()
    .default(""),
  identificationNo: z.string().trim().max(50).optional().default(""),
});

export async function PUT(req: Request) {
  try {
    const user = await requireUser();
    const input = parseBody(updateSchema, await req.json().catch(() => null));
    await ProfileService.update(user.email, input);
    return NextResponse.json({ success: true, message: "Profile parameters securely synchronized!" });
  } catch (error) {
    return errorResponse(error);
  }
}
