import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    service: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    message: { type: String, required: true, maxlength: 100, trim: true },
    paymentStatus: { type: String, default: "Pending" },
    orderId: { type: String, index: true },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export type InquiryDoc = InferSchemaType<typeof InquirySchema>;

export default (mongoose.models.Inquiry as Model<InquiryDoc>) ||
  mongoose.model<InquiryDoc>("Inquiry", InquirySchema);
