"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSuperAdminSidebar } from "@/stores/sidebar";
import { 
  LayoutDashboard,
  Inbox, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  IndianRupee
} from "lucide-react";

// Admin Menu List (Added Leads page)
const adminMenus = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Requests", href: "/admin/dashboard/requests", icon: Inbox },
  { title: "Leads", href: "/admin/dashboard/leads", icon: Users },
  { title: "Approved", href: "/admin/dashboard/requests?status=Approved", icon: CheckCircle2 },
  { title: "Rejected", href: "/admin/dashboard/requests?status=Rejected", icon: XCircle },
  { title: "Pricing", href: "/admin/dashboard/pricing", icon: IndianRupee },
];

/** Reads ?status= (needs a Suspense boundary); the inner view also renders server-side without it. */
export default function SuperAdminSidebar() {
  const currentStatus = useSearchParams().get("status");
  return <SuperAdminSidebarView currentStatus={currentStatus} />;
}

export function SuperAdminSidebarView({ currentStatus }: { currentStatus: string | null }) {
  const pathname = usePathname();

  const isItemActive = (href: string): boolean => {
    const [path, query] = href.split("?");
    if (path === "/admin/dashboard") return pathname === path;
    if (path === "/admin/dashboard/requests") {
      const wanted = query ? new URLSearchParams(query).get("status") : null;
      return pathname === path && currentStatus === wanted;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  const isMinimized = useSuperAdminSidebar((s) => s.collapsed);
  const toggle = useSuperAdminSidebar((s) => s.toggle);

  return (
    <>
      {/* ================= DESKTOP FIXED SIDEBAR ================= */}
      <motion.aside 
        animate={{ width: isMinimized ? "4.5rem" : "16rem" }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="hidden md:flex fixed left-0 top-20 bottom-0 z-40 flex-col bg-white border-r border-slate-200/90 select-none p-3 justify-between shadow-2xs"
      >
        <div className="flex flex-col gap-2">
          
          {/* Header Row: Admin Panel Title & Minimize Toggle */}
          <div className={`flex items-center ${isMinimized ? "justify-center" : "justify-between"} px-2 pt-1 pb-2 border-b border-slate-100`}>
            {!isMinimized && (
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-blue-600" /> Admin Panel
              </span>
            )}
            <button 
              type="button"
              onClick={toggle}
              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-blue-600"
              title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 pt-2">
            {adminMenus.map((item) => {
              const isActive = isItemActive(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isMinimized ? item.title : ""}
                  className={`relative flex items-center ${isMinimized ? "justify-center px-2" : "px-3.5"} py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "text-white font-bold" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 font-semibold"
                  }`}
                >
                  {/* Active Background Pill */}
                  {isActive && (
                    <motion.div 
                      layoutId="adminActivePillDesktop"
                      className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-2xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                  }`}>
                    <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {/* Label */}
                  {!isMinimized && (
                    <span className="ml-3 text-xs tracking-wide truncate uppercase font-black">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Version Badge */}
        <div className={`pt-3 border-t border-slate-100 px-2 flex items-center ${isMinimized ? "justify-center" : "justify-between"}`}>
          {!isMinimized && <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Admin Portal</span>}
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            v0.1
          </span>
        </div>
      </motion.aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 w-full px-2 pb-2">
        <div className="relative flex items-center justify-around bg-white/95 backdrop-blur-xl border border-slate-200 px-1 py-2 rounded-2xl shadow-2xl">
          
          {adminMenus.map((item) => {
            const isActive = isItemActive(item.href);
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex-1 flex flex-col items-center justify-center py-1 outline-none select-none group min-w-0"
              >
                {/* Active Indicator for Mobile */}
                {isActive && (
                  <motion.div 
                    layoutId="adminActivePillMobile"
                    className="absolute inset-x-1 top-0 bottom-0 bg-blue-50 rounded-xl -z-10 border border-blue-200"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Icon */}
                <motion.div whileTap={{ scale: 0.92 }} className={`p-0.5 ${isActive ? "text-blue-600" : "text-slate-500"}`}>
                  <IconComponent 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="transition-transform duration-200"
                  />
                </motion.div>

                {/* Mobile Label */}
                <span className={`mt-0.5 text-[9px] uppercase tracking-tight transition-all truncate px-0.5 max-w-full ${
                  isActive ? "text-blue-950 font-black" : "text-slate-500 font-bold"
                }`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}