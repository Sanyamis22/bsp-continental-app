import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ServicePriceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    amountInr: { type: Number, required: true, min: 1 },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ServicePriceDoc = InferSchemaType<typeof ServicePriceSchema>;

export default (mongoose.models.ServicePrice as Model<ServicePriceDoc>) ||
  mongoose.model<ServicePriceDoc>("ServicePrice", ServicePriceSchema);
