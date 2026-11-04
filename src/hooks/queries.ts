"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/hooks/api";
import type { ContactDTO, InquiryDTO } from "@/types/lead";
import type { NotificationDTO } from "@/types/notification";
import type { ServicePriceDTO } from "@/types/pricing";
import type { CreateRequestInput, DecideRequestInput, RequestDTO } from "@/types/request";
import type { ProfileDTO, UserDTO } from "@/types/user";

export type DataScope = "user" | "admin";

export const queryKeys = {
  requests: (scope: DataScope = "user") => ["requests", scope] as const,
  notifications: (scope: DataScope = "user") => ["notifications", scope] as const,
  profile: ["profile"] as const,
  adminUsers: ["admin", "users"] as const,
  prices: ["prices"] as const,
  adminLeads: ["admin", "leads"] as const,
};

function scopedUrl(path: string, scope: DataScope): string {
  return scope === "admin" ? `${path}?scope=admin` : path;
}

/** Requests visible to the caller: pass `admin` from the super-admin panel only. */
export function useRequests(scope: DataScope = "user") {
  return useQuery({
    queryKey: queryKeys.requests(scope),
    queryFn: async () => (await apiRequest<{ data: RequestDTO[] }>(scopedUrl("/api/requests", scope))).data ?? [],
  });
}

/** Notification inbox: pass `admin` from the super-admin panel only. */
export function useNotifications(pollMs?: number, scope: DataScope = "user") {
  return useQuery({
    queryKey: queryKeys.notifications(scope),
    queryFn: async () => (await apiRequest<{ data: NotificationDTO[] }>(scopedUrl("/api/notifications", scope))).data ?? [],
    refetchInterval: pollMs,
  });
}

export function useMarkNotificationRead(scope: DataScope = "user") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest(scopedUrl("/api/notifications", scope), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications(scope) }),
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

export function usePrices() {
  return useQuery({
    queryKey: queryKeys.prices,
    queryFn: async () => (await apiRequest<{ data: ServicePriceDTO[] }>("/api/prices")).data ?? [],
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { slug: string; amountInr: number }) =>
      apiRequest<{ data: ServicePriceDTO }>("/api/admin/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.prices }),
  });
}

export function useAdminLeads() {
  return useQuery({
    queryKey: queryKeys.adminLeads,
    queryFn: async () => {
      const body = await apiRequest<{ inquiries: InquiryDTO[]; contacts: ContactDTO[] }>("/api/admin/leads");
      return { inquiries: body.inquiries ?? [], contacts: body.contacts ?? [] };
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      return apiRequest<{ name?: string; fileUrl?: string; url?: string }>("/api/upload", { method: "POST", body });
    },
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRequestInput) =>
      apiRequest("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.requests("user") }),
  });
}

export function useDecideRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DecideRequestInput) =>
      apiRequest("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.requests("admin") }),
  });
}

export function useRegisterAction() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  });
}

export function useForgetInit() {
  return useMutation({
    mutationFn: (phone: string) =>
      apiRequest("/api/auth/forget-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      }),
  });
}

export function useForgetFinal() {
  return useMutation({
    mutationFn: (input: { phone: string; otp: string; password: string }) =>
      apiRequest("/api/auth/forget-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
  });
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: (values: Record<string, string>) =>
      apiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: (input: { username: string; password: string }) =>
      apiRequest("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
  });
}

export function useAdminLogout() {
  return useMutation({
    mutationFn: () => apiRequest("/api/admin/logout", { method: "POST" }),
  });
}

type InquiryResponse = { inquiryId: string };
type OrderResponse = { order_id: string; key_id: string; amount: number; currency?: string };

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest<InquiryResponse>("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest<OrderResponse>("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  });
}
