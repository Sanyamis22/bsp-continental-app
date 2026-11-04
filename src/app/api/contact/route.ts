import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { parseBody } from "@/lib/validation";
import { LeadService } from "@/services/LeadService";

const bodySchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  mobileNumber: z.string().trim().min(5).max(20),
  serviceRequired: z.string().trim().min(1).max(200),
  cityDistrict: z.string().trim().min(1).max(100),
  preferredContact: z.string().trim().max(50).optional(),
  message: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    await rateLimit(`contact:${clientIp(req)}`, 10, 60 * 60);
    const body = parseBody(bodySchema, await req.json().catch(() => null));

    const contact = await LeadService.submitContact({
      name: body.fullName,
      phone: body.mobileNumber,
      service: body.serviceRequired,
      city: body.cityDistrict,
      preferredContact: body.preferredContact || "call",
      message: body.message || "",
    });

    return NextResponse.json(
      { success: true, message: "Contact request submitted successfully.", contactId: contact._id },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
