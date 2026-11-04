"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { NotificationList } from "@/components/ui/notification-list";
import { errorMessage } from "@/types/api";
import type { NotificationDTO } from "@/types/notification";

async function fetchNotifications(): Promise<NotificationDTO[]> {
  const res = await fetch("/api/notifications", { cache: "no-store" });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.error || "Could not load notifications.");
  return result.data || [];
}

export default function AdminNotificationsPage() {
  const router = useRouter();

  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchNotifications()
      .then((data) => active && setItems(data))
      .catch((err) => active && setError(errorMessage(err)))
      .finally(() => active && setLoading(false));
    // Poll so new alerts show up without a manual refresh.
    const timer = setInterval(() => {
      fetchNotifications().then((data) => active && setItems(data)).catch(() => undefined);
    }, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const refresh = () => {
    setLoading(true);
    setError("");
    fetchNotifications()
      .then(setItems)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  const open = async (notif: NotificationDTO) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notif._id }),
      });
    } catch {
      // Marking as read is best-effort; still navigate.
    }
    router.push(notif.targetUrl || "/admin/dashboard/requests");
  };

  return (
    <NotificationList
      heading="Admin Notifications"
      subheading={"New client submissions appear here automatically."}
      items={items}
      loading={loading}
      error={error}
      emptyText="New requests from clients will show up here."
      onSelect={open}
      onRefresh={refresh}
    />
  );
}
