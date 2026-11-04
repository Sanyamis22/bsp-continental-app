import type { ReactNode } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AuthShellProps {
  badge: string;
  title: ReactNode;
  subtitle: string;
  error?: string;
  closeHref?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Frame shared by login / register / password reset (shadcn Card on the minimal auth layout). */
export function AuthShell({ badge, title, subtitle, error, closeHref = "/", children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="relative w-full max-w-105 gap-0 py-8 shadow-lg">
        <Link
          href={closeHref}
          aria-label="Close"
          className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <FiX />
        </Link>

        <CardContent className="space-y-5">
          <div className="space-y-2 pt-2 text-center">
            <Badge variant="success" className="uppercase tracking-widest">
              {badge}
            </Badge>
            <h1 className="text-3xl font-black tracking-tight uppercase">{title}</h1>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{subtitle}</p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs leading-snug font-semibold text-rose-700"
            >
              <FiAlertTriangle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {children}

          {footer && <div className="border-t pt-5 text-center text-xs font-medium text-muted-foreground">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
