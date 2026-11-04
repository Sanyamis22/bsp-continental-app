import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipientEmail: { type: String, required: true, index: true },
    senderName: { type: String, default: "" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    serviceType: { type: String, default: "General" },
    requestId: { type: Schema.Types.ObjectId, ref: "Request" },
    targetUrl: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type NotificationDoc = InferSchemaType<typeof NotificationSchema>;

export default (mongoose.models.Notification as Model<NotificationDoc>) ||
  mongoose.model<NotificationDoc>("Notification", NotificationSchema);
