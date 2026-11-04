import RequestsView from "@/components/admin/RequestsView";
import { REQUEST_STATUSES } from "@/types/request";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const initialStatus = REQUEST_STATUSES.find((s) => s === status) ?? "Pending";
  // key remounts the view when a sidebar link switches the status tab.
  return <RequestsView key={initialStatus} initialStatus={initialStatus} />;
}
