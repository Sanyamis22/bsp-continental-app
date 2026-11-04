import { NotificationRepository } from "@/repositories/NotificationRepository";
import { notFound } from "@/lib/errors";
import type { RequestStatus } from "@/types/request";
import type { Types } from "mongoose";

/** Recipient key of the shared admin inbox. */
export const ADMIN_INBOX = "ADMIN";

export const NotificationService = {
  list(recipientEmail: string) {
    return NotificationRepository.listFor(recipientEmail);
  },

  async markRead(id: string, recipientEmail: string) {
    const updated = await NotificationRepository.markRead(id, recipientEmail);
    if (!updated) throw notFound("Notification not found.");
    return updated;
  },

  notifyAdminOfNewRequest(params: { userName: string; serviceType: string; requestId: Types.ObjectId }) {
    return NotificationRepository.create({
      recipientEmail: ADMIN_INBOX,
      senderName: params.userName,
      title: `New ${params.serviceType} Request Received!`,
      message: `${params.userName} has submitted a new ${params.serviceType} application.`,
      serviceType: params.serviceType,
      requestId: params.requestId,
      targetUrl: "/admin/dashboard/requests",
    });
  },

  notifyUserOfDecision(params: {
    userEmail: string;
    serviceType: string;
    status: RequestStatus;
    adminMessage?: string;
    requestId: Types.ObjectId;
  }) {
    return NotificationRepository.create({
      recipientEmail: params.userEmail,
      senderName: "Admin Legal Team",
      title: `Request Status Updated: ${params.status}`,
      message: params.adminMessage
        ? `Admin Note: "${params.adminMessage}"`
        : `Your request status is now ${params.status}.`,
      serviceType: params.serviceType || "General",
      requestId: params.requestId,
      targetUrl: "/dashboard/my-requests",
    });
  },
};
