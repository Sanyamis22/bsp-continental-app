"use client";

import { Suspense, type ReactNode } from "react";
import AdminSidebar, { AdminSidebarView } from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { useAdminSidebar } from "@/stores/sidebar";

/** Chrome for the admin console. The login page lives outside this shell. */
export default function AdminShell({ children }: { children: ReactNode }) {
  const collapsed = useAdminSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminTopBar />
      <Suspense fallback={<AdminSidebarView currentStatus={null} />}>
        <AdminSidebar />
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
