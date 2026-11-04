'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  FiHome, 
  FiInfo, 
  FiBriefcase, 
  FiFileText, 
  FiShield, 
  FiBell, 
  FiLogIn, 
  FiLogOut, 
  FiPhoneCall,
  FiChevronDown,
  FiArrowRight,
  FiRefreshCw,
  FiCheckSquare,
  FiGrid,
  FiList
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = status === "authenticated";
  const isHomePage = pathname === "/";
  const showDashboardLink = isLoggedIn && isHomePage;

  const userImageUrl = session?.user?.image || "";
  const userName = session?.user?.name || "User";
  const brandColor = "#217044";

  // 3 Core Services
  const servicesDropdownList = [
    {
      id: "property-compliance",
      title: "Property Compliance",
      href: "/services/property-compliance",
    },
    {
      id: "cibil-management",
      title: "CIBIL Score Management",
      href: "/services/cibil-management",
    },
    {
      id: "financial-consulting",
      title: "Financial Consulting",
      href: "/services/financial-consulting",
    },
  ];

  const moreMenuItems = [
    { name: "My Requests", href: "/dashboard/my-requests", icon: <FiList size={16} /> },
    { name: "Contact Desk", href: "/contact", icon: <FiPhoneCall size={16} /> },
    { name: "Terms of Service", href: "/terms", icon: <FiFileText size={16} /> },
    { name: "Privacy Policy", href: "/privacy", icon: <FiShield size={16} /> },
    { name: "Refund & Cancellation", href: "/refund-policy", icon: <FiRefreshCw size={16} /> },
    { name: "Client Consent", href: "/client-consent", icon: <FiCheckSquare size={16} /> },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setIsServicesOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceSelect = (href: string) => {
    setIsServicesOpen(false);
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.04)] border-b border-slate-100 select-none">
        <div className="h-28 px-4 md:px-10 lg:px-16 flex items-center justify-between">
          
          {/* Logo Container */}
          <div className="flex items-center overflow-visible">
            <Link 
              href={showDashboardLink ? "/dashboard" : "/"} 
              onClick={() => { setIsServicesOpen(false); setIsMoreOpen(false); }}
              className="flex items-center active:scale-95 transition-transform overflow-visible py-1"
            >
              <Image 
                src="/images/Bsp Ccontinental financial logo PNG (1).png" 
                alt="BSP Continental Logo" 
                width={750} 
                height={220} 
                className="h-24 sm:h-26 md:h-28 lg:h-30 w-auto object-contain origin-left scale-135 sm:scale-140 md:scale-145 lg:scale-160 transition-all duration-200 select-none"
                priority
              />
            </Link>
          </div>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <Link
              href="/"
              onClick={() => { setIsServicesOpen(false); setIsMoreOpen(false); }}
              className="text-base font-bold transition-colors py-1.5 cursor-pointer hover:text-[#217044]"
              style={{ color: pathname === "/" && !isServicesOpen ? brandColor : "#334155" }}
            >
              Home
            </Link>

            {showDashboardLink && (
              <Link
                href="/dashboard"
                onClick={() => { setIsServicesOpen(false); setIsMoreOpen(false); }}
                className="text-base font-bold transition-colors py-1.5 cursor-pointer hover:text-[#217044] flex items-center gap-1.5 text-slate-700"
              >
                <FiGrid size={16} />
                Dashboard
              </Link>
            )}

            <Link
              href="/about"
              onClick={() => { setIsServicesOpen(false); setIsMoreOpen(false); }}
              className="text-base font-bold transition-colors py-1.5 cursor-pointer hover:text-[#217044]"
              style={{ color: pathname === "/about" ? brandColor : "#334155" }}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div ref={servicesRef} className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  setIsMoreOpen(false);
                }}
                className="flex items-center gap-1.5 text-base font-bold transition-colors py-1.5 cursor-pointer hover:text-[#217044]"
                style={{ color: isServicesOpen || pathname.startsWith("/services") ? brandColor : "#334155" }}
              >
                <span>Services</span>
                <FiChevronDown 
                  className={`text-sm transition-transform duration-300 ${
                    isServicesOpen ? "rotate-180 text-[#217044]" : "text-slate-400"
                  }`} 
                />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-2xl shadow-[0_15px_40px_rgba(5,37,22,0.12)] border border-slate-100 p-2 space-y-1 z-50 select-none overflow-hidden"
                  >
                    {servicesDropdownList.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceSelect(service.href)}
                        className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-emerald-50/70 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#f3c251] group-hover:scale-125 transition-transform" />
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#217044] transition-colors leading-snug">
                            {service.title}
                          </span>
                        </div>
                        <FiArrowRight className="text-xs text-slate-300 group-hover:text-[#217044] group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* More Dropdown */}
            <div 
              ref={moreRef}
              className="relative h-full flex items-center cursor-pointer"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMoreOpen(!isMoreOpen);
                  setIsServicesOpen(false);
                }}
                className="flex items-center gap-1.5 text-base font-bold transition-colors py-1.5 hover:text-[#217044]"
                style={{ color: isMoreOpen || ["/contact", "/privacy", "/terms", "/refund-policy", "/client-consent", "/dashboard/my-requests"].includes(pathname) ? brandColor : "#334155" }}
              >
                <span>More</span>
                <FiChevronDown 
                  className={`text-sm transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180 text-[#217044]" : "text-slate-400"
                  }`} 
                />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-20 left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 z-50"
                  >
                    {moreMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#217044] hover:bg-emerald-50/50 transition-colors"
                      >
                        <span className="text-slate-400">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="relative w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-[#217044] hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer"
            >
              <FiBell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#217044] rounded-full ring-2 ring-white" />
            </button>

            {!isLoggedIn && (
              <Link
                href="/login"
                className={cn(buttonVariants(), "hidden rounded-full px-6 uppercase tracking-wider md:inline-flex")}
              >
                <FiLogIn size={14} />
                Login
              </Link>
            )}

            <button 
              type="button"
              onClick={() => router.push(isLoggedIn ? "/dashboard/profile" : "/login")}
              className="relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-200/60 transition-all active:scale-95 cursor-pointer"
            >
              {isLoggedIn ? (
                userImageUrl ? (
                  <Image src={userImageUrl} alt="Profile" width={44} height={44} referrerPolicy="no-referrer" className="w-full h-full object-cover" unoptimized />
                ) : (
                  <span className="text-base font-black uppercase select-none" style={{ color: brandColor }}>
                    {userName.trim().charAt(0)}
                  </span>
                )
              ) : (
                <span className="text-base font-bold text-slate-400 select-none">?</span>
              )}
            </button>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hidden md:flex w-11 h-11 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 items-center justify-center transition-all active:scale-95 border border-rose-100/40 cursor-pointer"
                title="Logout"
              >
                <FiLogOut size={17} />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-2xl p-2.5 text-black bg-slate-50 active:scale-90 rounded-full transition-all focus:outline-none cursor-pointer"
            >
              {isOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>

        </div>
      </header>

      {/* ─── MOBILE DRAWER MENU ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-[340px] bg-white border-l border-slate-100 z-50 p-6 flex flex-col justify-between md:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.05)] overflow-y-auto"
            >
              <div className="space-y-5">
                
                {/* Drawer Top Header: Logo + Close */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <Image 
                    src="/images/Bsp Ccontinental financial logo PNG (1).png" 
                    alt="BSP Continental Logo" 
                    width={450} 
                    height={140} 
                    className="h-16 w-auto object-contain scale-110 origin-left"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xl text-black bg-slate-50 p-1.5 rounded-full active:scale-90 cursor-pointer"
                  >
                    <HiX />
                  </button>
                </div>

                {/* Profile Card & Logout Widget */}
                {isLoggedIn ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div 
                      onClick={() => { setIsOpen(false); router.push("/dashboard/profile"); }}
                      className="flex items-center gap-3 cursor-pointer overflow-hidden pr-2"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {userImageUrl ? (
                          <Image src={userImageUrl} alt="Profile" width={40} height={40} referrerPolicy="no-referrer" className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <span className="text-sm font-black text-[#217044]">{userName.trim().charAt(0)}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                        <p className="text-[10px] font-mono text-[#217044] uppercase font-bold">Active Account</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                      title="Logout"
                    >
                      <FiLogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className={cn(buttonVariants({ size: "lg" }), "w-full uppercase tracking-wider")}
                  >
                    <FiLogIn size={15} />
                    Client Login
                  </Link>
                )}

                {/* Main Navigation Links */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm font-black px-4 py-2.5 rounded-xl text-slate-800 hover:text-[#217044] hover:bg-slate-50"
                  >
                    <FiHome size={18} className="text-slate-400" />
                    Home
                  </Link>

                  {showDashboardLink && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-sm font-black px-4 py-2.5 rounded-xl text-slate-800 hover:text-[#217044] hover:bg-slate-50"
                    >
                      <FiGrid size={18} className="text-[#217044]" />
                      Dashboard
                    </Link>
                  )}

                  <Link
                    href="/dashboard/my-requests"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm font-black px-4 py-2.5 rounded-xl text-slate-800 hover:text-[#217044] hover:bg-slate-50"
                  >
                    <FiList size={18} className="text-slate-400" />
                    My Requests
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm font-black px-4 py-2.5 rounded-xl text-slate-800 hover:text-[#217044] hover:bg-slate-50"
                  >
                    <FiInfo size={18} className="text-slate-400" />
                    About
                  </Link>

                  {/* Mobile Services Accordion */}
                  <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-black text-slate-800 cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <FiBriefcase size={18} className="text-[#217044]" />
                        Services
                      </span>
                      <FiChevronDown 
                        className={`text-sm transition-transform duration-200 ${
                          mobileServicesOpen ? "rotate-180 text-[#217044]" : "text-slate-400"
                        }`} 
                      />
                    </button>

                    {mobileServicesOpen && (
                      <div className="px-3 pb-3 space-y-1 pt-1 border-t border-slate-200/60">
                        {servicesDropdownList.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => handleServiceSelect(service.href)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-white text-slate-700 hover:text-[#217044] transition-colors"
                          >
                            <span className="text-xs font-bold">{service.title}</span>
                            <FiArrowRight className="text-xs text-slate-300" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile More Accordion */}
                  <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-black text-slate-800 cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <FiPhoneCall size={18} className="text-[#217044]" />
                        More
                      </span>
                      <FiChevronDown 
                        className={`text-sm transition-transform duration-200 ${
                          mobileMoreOpen ? "rotate-180 text-[#217044]" : "text-slate-400"
                        }`} 
                      />
                    </button>

                    {mobileMoreOpen && (
                      <div className="px-4 pb-3 space-y-1 pt-1 border-t border-slate-200/60">
                        {moreMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-xs font-semibold text-slate-600 hover:text-[#217044] py-2 px-2 rounded-lg hover:bg-white"
                          >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  © 2026 BSP CONTINENTAL
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}