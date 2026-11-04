import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { objectIdSchema, parseBody } from "@/lib/validation";
import { PaymentService } from "@/services/PaymentService";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  inquiryId: objectIdSchema,
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  try {
    await rateLimit(`verify-payment:${clientIp(req)}`, 30, 10 * 60);
    const body = parseBody(bodySchema, await req.json().catch(() => null));
    const { paymentId } = await PaymentService.verify({
      inquiryId: body.inquiryId,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });
    return NextResponse.json({ success: true, message: "Payment successfully verified", paymentId });
  } catch (error) {
    return errorResponse(error);
  }
}
