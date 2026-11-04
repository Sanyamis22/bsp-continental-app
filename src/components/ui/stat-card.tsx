import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  green: "bg-accent text-accent-foreground",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-secondary text-secondary-foreground",
} as const;

/** One headline number with an icon, used for KPI rows. */
function StatCard({ label, value, icon, tone = "green" }: { label: string; value: ReactNode; icon: ReactNode; tone?: keyof typeof tones }) {
  return (
    <Card data-slot="stat-card" className="flex-row items-center justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 truncate text-3xl font-black tabular-nums">{value}</p>
      </div>
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl", tones[tone])}>{icon}</div>
    </Card>
  );
}

export { StatCard };
