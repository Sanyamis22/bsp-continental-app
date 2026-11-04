export interface NotificationDTO {
  _id: string;
  recipientEmail: string;
  senderName?: string;
  title: string;
  message: string;
  serviceType?: string;
  requestId?: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}
