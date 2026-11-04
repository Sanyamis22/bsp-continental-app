"use client";

import type { ReactNode } from "react";
import ClientSidebar from "@/components/client-app/ClientSidebar";
import ClientTopBar from "@/components/client-app/ClientTopBar";
import { useClientSidebar } from "@/stores/sidebar";

/** Chrome for the signed-in user product: top bar + sidebar. Never the marketing navbar. */
export default function ClientShell({ children }: { children: ReactNode }) {
  const collapsed = useClientSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-slate-50">
      <ClientTopBar />
      <ClientSidebar />
      <main
        className={`min-h-screen pt-20 pb-24 transition-[padding] duration-200 lg:pb-8 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
