"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { 
  FiSearch, 
  FiBell, 
  FiLogOut, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiFilter,
  FiChevronDown,
  FiLayers,
  FiX as FiCloseX,
  FiShield
} from "react-icons/fi";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [menuDropdown, setMenuDropdown] = useState(false);
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "Search Applicant or ID...",
    "Search CIBIL Audits...",
    "Search Property Records...",
    "Search Phone or Email..."
  ];

  const filterOptions = [
    { label: "All Requests", value: "All" },
    { label: "CIBIL Audit", value: "CIBIL Audit" },
    { label: "Property Vetting", value: "Property Vetting" },
  ];

  const adminMenuOptions = [
    { label: "All Requests", path: "/admin/dashboard/requests", icon: FiLayers, color: "text-[#217044]", bg: "bg-emerald-50" },
    { label: "Approved Requests", path: "/admin/dashboard/requests?status=Approved", icon: FiCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Approval", path: "/admin/dashboard/requests?status=Pending", icon: FiClock, color: "text-amber-600", bg: "bg-emerald-50" },
    { label: "Rejected Requests", path: "/admin/dashboard/requests?status=Rejected", icon: FiXCircle, color: "text-rose-600", bg: "bg-emerald-50" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsOpen(false);
      window.location.replace("/admin/login");
    }
  };

  return (
    <>
      {/* ─── PREMIUM RESPONSIVE ADMIN HEADER BAR ─── */}
      <nav className="fixed top-0 left-0 right-0 h-24 sm:h-32 bg-white/95 backdrop-blur-md z-50 px-4 sm:px-6 lg:px-10 flex items-center justify-between select-none border-b border-slate-200/80 shadow-xs">
        
        {/* 👉 2X GIANT & PROMINENT BRAND LOGO */}
        <div className="flex items-center shrink-0">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center active:scale-95 transition-transform"
          >
            <div className="relative h-20 w-64 sm:h-28 sm:w-[26rem]">
              <Image
                src="/images/Bsp Ccontinental financial logo PNG (1).png"
                alt="BSP Continental"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-left scale-110 sm:scale-150 origin-left"
              />
            </div>
          </Link>
        </div>

        {/* Center: Search & Request Filters (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-4">
          <div className="relative w-full flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-[#217044] focus-within:bg-white transition-all shadow-inner">
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterDropdown(!filterDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                <FiFilter size={13} className="text-[#217044]" />
                <span>{selectedFilter}</span>
                <FiChevronDown size={12} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {filterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-12 left-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold"
                  >
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedFilter(opt.value);
                          setFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-[#217044] transition-colors flex items-center justify-between ${
                          selectedFilter === opt.value ? "text-[#217044] font-black bg-emerald-50" : "text-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex-1 ml-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <FiSearch className="absolute left-1 top-2 text-slate-400" size={15} />
            </div>

          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition-all cursor-pointer"
          >
            <FiSearch size={18} />
          </button>

          {/* Requests Desk Dropdown (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuDropdown(!menuDropdown)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#217044]/10 hover:bg-[#217044]/15 border border-[#217044]/20 text-[#217044] text-xs font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-2xs"
            >
              <FiLayers size={15} />
              <span>Requests Desk</span>
              <FiChevronDown size={13} />
            </button>

            <AnimatePresence>
              {menuDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-14 right-0 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold space-y-1"
                >
                  <div className="px-4 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Workflow Status
                  </div>

                  {adminMenuOptions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMenuDropdown(false)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                      >
                        <div className={`p-2 rounded-xl ${item.bg}`}>
                          <Icon className={item.color} size={15} />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <Link 
            href="/admin/dashboard/notifications" 
            className="relative w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Admin Notifications"
          >
            <FiBell size={18} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#217044] rounded-full ring-2 ring-white animate-pulse" />
          </Link>

          {/* Desktop Admin Badge */}
          <div className="hidden sm:flex h-11 px-3.5 rounded-2xl items-center gap-2.5 bg-emerald-50 border border-emerald-200 shadow-2xs">
            <FiShield size={14} className="text-[#217044]" />
            <span className="text-xs font-black tracking-wider text-[#217044] uppercase">ADMIN</span>
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={handleAdminLogout}
            className="hidden md:flex h-11 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 items-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-90 rounded-2xl transition-all border border-slate-200 cursor-pointer"
          >
            {isOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>

        </div>
      </nav>

      {/* ─── MOBILE SEARCH OVERLAY ─── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-5 shadow-2xl z-[60] md:hidden space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Search Console</span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-slate-500 hover:text-black bg-slate-100 rounded-full cursor-pointer"
              >
                <FiCloseX size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedFilter === opt.value
                      ? "bg-[#217044] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-12 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#217044]"
              />
              <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3.5 text-slate-500 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE SLIDER DRAWER MENU (FULLY FIXED & SCROLLABLE) ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-[320px] bg-white border-l border-slate-200 z-[80] p-6 flex flex-col justify-between md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6 pb-6">
                
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Admin Menu
                  </span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-700 bg-slate-100 rounded-full cursor-pointer"
                  >
                    <HiX size={18} />
                  </button>
                </div>

                {/* Admin Status Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#217044] flex items-center justify-center text-white">
                      <FiShield size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase block text-white">Super Admin</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Status Navigation Links (Fully Visible & Scrollable) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-1 block mb-2">
                    Requests Management
                  </span>

                  <Link
                    href="/admin/dashboard/notifications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3.5 text-xs font-bold text-slate-800 px-4 py-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100 text-[#217044] transition-all border border-emerald-100"
                  >
                    <div className="p-2 rounded-xl bg-[#217044] text-white">
                      <FiBell size={16} />
                    </div>
                    <span>Notifications Studio</span>
                  </Link>

                  {adminMenuOptions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3.5 text-xs font-bold text-slate-800 px-4 py-3.5 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                      >
                        <div className={`p-2 rounded-xl ${item.bg}`}>
                          <Icon className={item.color} size={16} />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

              </div>

              {/* Bottom Mobile Logout */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={handleAdminLogout}
                  className="w-full py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  <FiLogOut size={16} />
                  <span>Logout Admin</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}