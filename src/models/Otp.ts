import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OtpSchema = new Schema({
  purpose: { type: String, required: true, enum: ["register", "reset"] },
  key: { type: String, required: true },
  codeHash: { type: String, required: true },
  meta: { email: { type: String } },
  attempts: { type: Number, default: 0 },
  // TTL: Mongo removes the document once `expiresAt` has passed.
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
OtpSchema.index({ purpose: 1, key: 1 }, { unique: true });

export type OtpDoc = InferSchemaType<typeof OtpSchema>;

export default (mongoose.models.Otp as Model<OtpDoc>) || mongoose.model<OtpDoc>("Otp", OtpSchema);
