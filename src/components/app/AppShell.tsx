"use client";

import type { ReactNode } from "react";
import AppSidebar from "@/components/app/AppSidebar";
import AppTopBar from "@/components/app/AppTopBar";
import { useAppSidebar } from "@/stores/sidebar";

/** Chrome for the signed-in user product: top bar + sidebar. Never the marketing navbar. */
export default function AppShell({ children }: { children: ReactNode }) {
  const collapsed = useAppSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopBar />
      <AppSidebar />
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
