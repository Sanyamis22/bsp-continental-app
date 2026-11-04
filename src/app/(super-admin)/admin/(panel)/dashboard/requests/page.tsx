import RequestsView from "@/components/super-admin/RequestsView";
import { REQUEST_STATUSES, SERVICE_TYPES } from "@/types/request";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; service?: string }>;
}) {
  const { status, q, service } = await searchParams;
  const initialStatus = REQUEST_STATUSES.find((s) => s === status) ?? "Pending";
  const initialService = SERVICE_TYPES.find((s) => s === service) ?? "ALL";
  const initialQuery = (q ?? "").slice(0, 100);
  // key remounts the view when the sidebar or the top-bar search changes the URL.
  return (
    <RequestsView
      key={`${initialStatus}|${initialService}|${initialQuery}`}
      initialStatus={initialStatus}
      initialService={initialService}
      initialQuery={initialQuery}
    />
  );
}
