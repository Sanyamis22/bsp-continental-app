import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProfileSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    panCard: { type: String, default: "" },
    identificationNo: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ProfileDoc = InferSchemaType<typeof ProfileSchema>;

export default (mongoose.models.Profile as Model<ProfileDoc>) ||
  mongoose.model<ProfileDoc>("Profile", ProfileSchema);
