import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    preferredContact: { type: String, default: "call" },
    message: { type: String, default: "", trim: true },
    status: { type: String, default: "New" },
  },
  { timestamps: true }
);

export type ContactDoc = InferSchemaType<typeof ContactSchema>;

export default (mongoose.models.Contact as Model<ContactDoc>) ||
  mongoose.model<ContactDoc>("Contact", ContactSchema);
