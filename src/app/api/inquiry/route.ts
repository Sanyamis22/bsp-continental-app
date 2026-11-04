import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { emailSchema, parseBody } from "@/lib/validation";
import { LeadService } from "@/services/LeadService";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(20),
  email: emailSchema,
  service: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(100),
});

// Public lead form. Any client-sent `amount` is ignored; the service price comes from the catalog.
export async function POST(req: Request) {
  try {
    await rateLimit(`inquiry:${clientIp(req)}`, 10, 60 * 60);
    const body = parseBody(bodySchema, await req.json().catch(() => null));
    const inquiry = await LeadService.submitInquiry(body);
    return NextResponse.json({ success: true, inquiryId: inquiry._id }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Failed to process inquiry.");
  }
}
