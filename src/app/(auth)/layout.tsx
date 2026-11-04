import type { ReactNode } from "react";

/** Minimal centred shell for login / register / password reset. No navbar, no sidebar. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-slate-50">{children}</main>;
}
