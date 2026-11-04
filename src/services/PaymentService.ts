import crypto from "crypto";
import Razorpay from "razorpay";
import { LeadRepository } from "@/repositories/LeadRepository";
import { requireEnv } from "@/lib/env";
import { AppError, badRequest, notFound } from "@/lib/errors";

export const PaymentService = {
  /** Creates a Razorpay order for the amount stored on the inquiry (never a client-supplied amount). */
  async createOrder(inquiryId: string) {
    const keyId = requireEnv("RAZORPAY_KEY_ID");
    const keySecret = requireEnv("RAZORPAY_KEY_SECRET");

    const inquiry = await LeadRepository.findInquiry(inquiryId);
    if (!inquiry) throw notFound("Inquiry not found.");
    if (inquiry.paymentStatus === "Completed") {
      throw new AppError(409, "CONFLICT", "This inquiry has already been paid.");
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(inquiry.amount * 100),
      currency: "INR",
      receipt: `inq_${inquiry._id}`,
      notes: { inquiryId: String(inquiry._id) },
    });

    inquiry.orderId = order.id;
    await inquiry.save();

    return { order_id: order.id, amount: order.amount, currency: order.currency, key_id: keyId };
  },

  /** Verifies the gateway signature for an order we issued, then marks the inquiry paid (idempotent). */
  async verify(input: { inquiryId: string; orderId: string; paymentId: string; signature: string }) {
    const keySecret = requireEnv("RAZORPAY_KEY_SECRET");

    const inquiry = await LeadRepository.findInquiryByOrder(input.inquiryId, input.orderId);
    if (!inquiry) throw notFound("Order not found for this inquiry.");

    const expected = crypto.createHmac("sha256", keySecret).update(`${input.orderId}|${input.paymentId}`).digest();
    const given = Buffer.from(input.signature, "hex");
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      throw badRequest("Signature verification failed");
    }

    if (inquiry.paymentStatus !== "Completed") {
      inquiry.paymentStatus = "Completed";
      inquiry.paymentId = input.paymentId;
      await inquiry.save();
    }
    return { paymentId: input.paymentId };
  },
};
