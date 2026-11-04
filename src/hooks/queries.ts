"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/hooks/api";
import type { NotificationDTO } from "@/types/notification";
import type { RequestDTO } from "@/types/request";
import type { ProfileDTO, UserDTO } from "@/types/user";

export const queryKeys = {
  requests: ["requests"] as const,
  notifications: ["notifications"] as const,
  profile: ["profile"] as const,
  adminUsers: ["admin", "users"] as const,
};

/** Requests visible to the caller: a client's own, or all of them for the admin. */
export function useRequests() {
  return useQuery({
    queryKey: queryKeys.requests,
    queryFn: async () => (await apiRequest<{ data: RequestDTO[] }>("/api/requests")).data ?? [],
  });
}

/** Notification inbox of the caller (client inbox, or the shared admin inbox). */
export function useNotifications(pollMs?: number) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => (await apiRequest<{ data: NotificationDTO[] }>("/api/notifications")).data ?? [],
    refetchInterval: pollMs,
  });
}

export function useMarkNotificationRead() {
  return useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      }),
  });
}

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile,
    enabled,
    queryFn: async (): Promise<Required<Pick<ProfileDTO, "phone" | "panCard" | "identificationNo">>> => {
      const body = await apiRequest<{ user: Required<Pick<ProfileDTO, "phone" | "panCard" | "identificationNo">> }>("/api/user/profile");
      return body.user;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { phone: string; panCard: string; identificationNo: string }) =>
      apiRequest("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile }),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => (await apiRequest<{ users: UserDTO[] }>("/api/admin/users")).users ?? [],
  });
}
