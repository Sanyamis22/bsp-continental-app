"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppSidebar } from "@/stores/sidebar";
import { 
  Home, 
  PhoneCall,
  CircleDollarSign,
  FileClock,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield
} from "lucide-react";

const desktopMenus = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Property Compliance", href: "/dashboard/property-compliance", icon: Shield },
  { title: "Credit Score Management", href: "/dashboard/credit-score-management", icon: TrendingUp },
  { title: "Financial Consultancy", href: "/dashboard/finance", icon: CircleDollarSign },
  { title: "Contact", href: "/dashboard/contact", icon: PhoneCall },
  { title: "My Requests", href: "/dashboard/my-requests", icon: FileClock },
  { title: "Profile", href: "/dashboard/profile", icon: User },
];

const mobileMenus = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Compliance", href: "/dashboard/property-compliance", icon: Shield },
  { title: "Credit Score", href: "/dashboard/credit-score-management", icon: TrendingUp },
  { title: "Finance", href: "/dashboard/finance", icon: CircleDollarSign },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const isMinimized = useAppSidebar((s) => s.collapsed);
  const toggle = useAppSidebar((s) => s.toggle);

  const toggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <motion.aside 
        initial={false}
        animate={{ width: isMinimized ? 76 : 256 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="hidden lg:flex fixed left-0 top-20 z-40 flex-col h-[calc(100vh-5rem)] bg-white border-r border-slate-200/90 select-none p-3 justify-between shadow-2xs overflow-hidden"
      >
        <div className="flex flex-col gap-3 overflow-hidden pt-2">
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-14rem)] scrollbar-none pr-0.5">
            {desktopMenus.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isMinimized ? item.title : ""}
                  className={`relative flex items-center ${isMinimized ? "justify-center px-0" : "px-3.5"} py-2.5 rounded-xl transition-all duration-150 group overflow-hidden ${
                    isActive 
                      ? "text-white font-bold" 
                      : "text-slate-600 hover:text-[#217044] hover:bg-[#217044]/10 font-semibold"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="desktopActivePill"
                      className="absolute inset-0 bg-[#217044] rounded-xl -z-10 shadow-2xs"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

                  <div className={`flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-[#217044]"
                  }`}>
                    <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {!isMinimized && (
                    <span className="ml-3 text-xs tracking-wide truncate uppercase font-black whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ─── BOTTOM SECTION: BADA HIT-AREA TOGGLE BUTTON & VERSION ─── */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          
          {/* Bada Minimize / Expand Button Area */}
          <button
            type="button"
            onClick={toggleSidebar}
            className={`w-full py-3 px-3 flex items-center ${
              isMinimized ? "justify-center" : "justify-between"
            } rounded-xl bg-slate-50 hover:bg-[#217044]/10 border border-slate-200/80 text-slate-700 hover:text-[#217044] transition-all cursor-pointer group shadow-2xs`}
            title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {!isMinimized && (
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 group-hover:text-[#217044]">
                Collapse Menu
              </span>
            )}
            <div className="p-1 rounded-md bg-white group-hover:bg-[#217044] group-hover:text-white transition-colors shadow-xs">
              {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </div>
          </button>

          {/* Version Info */}
          <div className={`px-1 flex items-center ${isMinimized ? "justify-center" : "justify-between"}`}>
            {!isMinimized && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                System
              </span>
            )}
            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#217044]/10 text-[#217044] rounded-md border border-[#217044]/20 shrink-0">
              v1.0
            </span>
          </div>
        </div>

      </motion.aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full px-3 pb-3">
        <div className="relative flex items-center justify-around bg-white/95 backdrop-blur-xl border border-slate-200 py-2 px-1 rounded-2xl shadow-2xl">
          {mobileMenus.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex-1 flex flex-col items-center justify-center py-1.5 outline-none select-none group min-w-0"
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobileActivePill"
                    className="absolute inset-x-1 top-0 bottom-0 bg-[#217044]/10 rounded-xl -z-10 border border-[#217044]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                <motion.div 
                  whileTap={{ scale: 0.92 }} 
                  className={`p-0.5 transition-colors ${isActive ? "text-[#217044]" : "text-slate-500"}`}
                >
                  <IconComponent 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                </motion.div>

                <span className={`mt-0.5 text-[9px] tracking-tight uppercase transition-all truncate px-0.5 max-w-full ${
                  isActive ? "text-[#217044] font-black" : "text-slate-500 font-bold"
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