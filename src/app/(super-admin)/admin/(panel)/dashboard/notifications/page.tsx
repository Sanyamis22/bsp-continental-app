"use client";

import { useRouter } from "next/navigation";
import { NotificationList } from "@/components/ui/notification-list";
import { useMarkNotificationRead, useNotifications } from "@/hooks/queries";
import type { NotificationDTO } from "@/types/notification";

export default function AdminNotificationsPage() {
  const router = useRouter();

  const { data: items = [], isLoading, isFetching, error, refetch } = useNotifications(15_000);
  const markRead = useMarkNotificationRead();

  const open = async (notif: NotificationDTO) => {
    // Best-effort: navigate even if marking as read fails.
    await markRead.mutateAsync(notif._id).catch(() => undefined);
    router.push(notif.targetUrl || "/admin/dashboard/requests");
  };

  return (
    <NotificationList
      heading="Admin Notifications"
      subheading={"New client submissions appear here automatically."}
      items={items}
      loading={isLoading || isFetching}
      error={error instanceof Error ? error.message : undefined}
      emptyText="New requests from clients will show up here."
      onSelect={open}
      onRefresh={() => refetch()}
    />
  );
}
