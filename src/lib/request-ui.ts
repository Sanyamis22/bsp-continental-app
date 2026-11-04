/** Badge colour for a request status (shared by the client ledger and the admin desk). */
export function statusBadgeVariant(status: string): "success" | "destructive" | "secondary" | "warning" {
  if (status === "Approved") return "success";
  if (status === "Rejected") return "destructive";
  if (status === "In Review") return "secondary";
  return "warning";
}
