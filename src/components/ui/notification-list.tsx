import { FiAlertCircle, FiBell, FiRefreshCw } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { NotificationDTO } from "@/types/notification";

interface NotificationListProps {
  heading: string;
  subheading?: string;
  items: NotificationDTO[];
  loading: boolean;
  error?: string;
  emptyText: string;
  onSelect: (item: NotificationDTO) => void;
  onRefresh: () => void;
}

/** Presentational inbox shared by the client app and the super admin panel. */
export function NotificationList({ heading, subheading, items, loading, error, emptyText, onSelect, onRefresh }: NotificationListProps) {
  const unread = items.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <FiBell className="text-primary" /> {heading}
            {unread > 0 && <Badge variant="default">{unread} new</Badge>}
          </h1>
          {subheading && <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="self-start sm:self-auto">
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          <FiAlertCircle /> {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : items.length === 0 ? (
        <Card className="items-center gap-2 p-14 text-center">
          <FiBell className="size-10 text-muted-foreground/50" />
          <p className="text-sm font-bold">All caught up</p>
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n._id}>
              <button
                type="button"
                onClick={() => onSelect(n)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                  n.isRead ? "bg-card" : "border-primary/30 bg-accent/60"
                )}
              >
                <span aria-hidden className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", n.isRead ? "bg-muted" : "bg-primary")} />
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">{n.title}</span>
                    {n.serviceType && <Badge variant="outline">{n.serviceType}</Badge>}
                  </span>
                  <span className="block text-sm text-muted-foreground">{n.message}</span>
                  <span className="block text-xs text-muted-foreground/80">
                    {n.senderName ? `${n.senderName} · ` : ""}
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
