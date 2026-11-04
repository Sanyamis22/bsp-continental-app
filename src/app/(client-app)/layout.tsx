import type { ReactNode } from "react";
import ClientShell from "@/components/client-app/ClientShell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
