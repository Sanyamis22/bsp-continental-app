import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/errors";
import { parseBody } from "@/lib/validation";
import { PricingService } from "@/services/PricingService";

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(60),
  amountInr: z.number(),
});

// Super admin only: change what a service costs. Takes effect for the next inquiry / Razorpay order.
export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const { slug, amountInr } = parseBody(bodySchema, await req.json().catch(() => null));
    const data = await PricingService.update(slug, amountInr, admin.sub);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
