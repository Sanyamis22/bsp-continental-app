import type { Types } from "mongoose";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export interface NewNotification {
  recipientEmail: string;
  senderName?: string;
  title: string;
  message: string;
  serviceType?: string;
  requestId?: Types.ObjectId;
  targetUrl?: string;
}

export const NotificationRepository = {
  async create(input: NewNotification) {
    await connectDB();
    return Notification.create(input);
  },

  async listFor(recipientEmail: string, limit = 50) {
    await connectDB();
    return Notification.find({ recipientEmail }).sort({ createdAt: -1 }).limit(limit);
  },

  async markRead(id: string, recipientEmail: string) {
    await connectDB();
    return Notification.findOneAndUpdate({ _id: id, recipientEmail }, { isRead: true }, { new: true });
  },
};
