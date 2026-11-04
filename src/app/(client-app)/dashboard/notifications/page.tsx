"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationList } from "@/components/ui/notification-list";
import { useMarkNotificationRead, useNotifications } from "@/hooks/queries";
import type { NotificationDTO } from "@/types/notification";

export default function UserNotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: items = [], isLoading, isFetching, error, refetch } = useNotifications(30_000);
  const markRead = useMarkNotificationRead();

  const open = async (notif: NotificationDTO) => {
    // Best-effort: navigate even if marking as read fails.
    await markRead.mutateAsync(notif._id).catch(() => undefined);
    router.push(notif.targetUrl || "/dashboard/my-requests");
  };

  return (
    <NotificationList
      heading="Notifications"
      subheading={session?.user?.email ? `Updates for ${session.user.email}` : undefined}
      items={items}
      loading={isLoading || isFetching}
      error={error instanceof Error ? error.message : undefined}
      emptyText="Status updates on your requests will show up here."
      onSelect={open}
      onRefresh={() => refetch()}
    />
  );
}
