import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Label + control. The control is nested in the label, so it is announced and clickable without ids. */
function FormField({ label, hint, className, children }: { label: ReactNode; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <label data-slot="form-field" className={cn("block space-y-1.5", className)}>
      <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export { FormField };
