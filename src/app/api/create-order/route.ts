import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { objectIdSchema, parseBody } from "@/lib/validation";
import { PaymentService } from "@/services/PaymentService";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ inquiryId: objectIdSchema });

export async function POST(req: Request) {
  try {
    await rateLimit(`create-order:${clientIp(req)}`, 20, 10 * 60);
    const { inquiryId } = parseBody(bodySchema, await req.json().catch(() => null));
    return NextResponse.json(await PaymentService.createOrder(inquiryId));
  } catch (error) {
    return errorResponse(error, "Failed to create order.");
  }
}
