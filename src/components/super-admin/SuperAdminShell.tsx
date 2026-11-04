"use client";

import { Suspense, type ReactNode } from "react";
import SuperAdminSidebar, { SuperAdminSidebarView } from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminTopBar from "@/components/super-admin/SuperAdminTopBar";
import { useSuperAdminSidebar } from "@/stores/sidebar";

/** Chrome for the admin console. The login page lives outside this shell. */
export default function SuperAdminShell({ children }: { children: ReactNode }) {
  const collapsed = useSuperAdminSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-slate-50">
      <SuperAdminTopBar />
      <Suspense fallback={<SuperAdminSidebarView currentStatus={null} />}>
        <SuperAdminSidebar />
      </Suspense>
      <main
        className={`min-h-screen pt-24 pb-24 transition-[padding] duration-200 sm:pt-32 md:pb-8 ${
          collapsed ? "md:pl-[4.5rem]" : "md:pl-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
