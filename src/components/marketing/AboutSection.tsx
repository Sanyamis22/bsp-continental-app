"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { 
  FiHome, 
  FiInfo, 
  FiBriefcase, 
  FiHelpCircle,
  FiFileText, 
  FiShield, 
  FiBell, 
  FiLogIn, 
  FiLogOut, 
  FiUser, 
  FiPhoneCall,
  FiList
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();

  // 🔥 ADMIN ROUTE GUARD
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isLoggedIn = status === "authenticated";
  const userImageUrl = session?.user?.image || "";
  const userName = session?.user?.name || "User";

  const brandColor = "#217044";

  const menuItems = [
    { name: "Home", href: "/", targetId: "home", icon: <FiHome size={20} /> },
    { name: "About", href: "/#about", targetId: "about", icon: <FiInfo size={20} /> },
    { name: "Services", href: "/services", icon: <FiBriefcase size={20} /> },
    { name: "How It Works", href: "/#how-it-works", targetId: "how-it-works", icon: <FiHelpCircle size={20} /> },
    { name: "Contact", href: "/contact", icon: <FiPhoneCall size={20} /> },
    { name: "Terms", href: "/terms", icon: <FiFileText size={20} /> },
    { name: "Privacy", href: "/privacy", icon: <FiShield size={20} /> },
  ];

  // ⚡ Auto-scroll listener: Kisi bhi page se Home par aane ke baad #about scroll trigger karta hai
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const executeScroll = () => {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      };

      // Dual delay taaki DOM heavy sections ke load hone ka wait kare
      const timer1 = setTimeout(executeScroll, 100);
      const timer2 = setTimeout(executeScroll, 350);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [pathname]);

  // ⚡ Click Handler: Current page par direct scroll, doosre page par hone par home redirect
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, item: { targetId?: string; href?: string; name?: string }) => {
    setIsOpen(false);

    if (item.targetId) {
      if (pathname === "/") {
        e.preventDefault();
        const targetElement = document.getElementById(item.targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${item.targetId}`);
        }
      } else {
        // Agar doosre page par hain (e.g. /services ya /contact)
        e.preventDefault();
        router.push(`/#${item.targetId}`);
      }
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      {/* ─── OPTIMIZED EXTRA TALL NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 h-28 bg-white z-40 px-4 md:px-10 lg:px-16 flex items-center justify-between select-none shadow-[0_4px_25px_rgba(0,0,0,0.04)] border-b border-slate-100 transition-all duration-300">
        
        {/* Branding Logo Container */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center active:scale-95 transition-transform py-1 overflow-visible"
          >
            <Image 
              src="/images/Bsp Ccontinental financial logo PNG (1).png" 
              alt="BSP Continental Logo" 
              width={600} 
              height={180} 
              className="h-24 md:h-26 w-auto object-contain scale-125 md:scale-135 origin-left"
              priority
            />
          </Link>
        </div>

        {/* Center Links (Desktop Version) */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="text-base font-bold transition-colors relative py-1.5 cursor-pointer"
                style={{ color: isActive ? brandColor : "#94A3B8" }}
                onMouseEnter={(e) => !isActive && ((e.currentTarget as HTMLElement).style.color = brandColor)}
                onMouseLeave={(e) => !isActive && ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
              >
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="modernNavbarTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                    style={{ backgroundColor: brandColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side Utility Actions */}
        <div className="flex items-center gap-3">
          
          {/* Notification Button */}
          <button className="relative w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-[#217044] hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer">
            <FiBell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#217044] rounded-full ring-2 ring-white" />
          </button>

          {/* Desktop Login Button */}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 px-6 py-3 rounded-full text-white font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
              style={{ backgroundColor: brandColor }}
              onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
              onMouseLeave={(e) => e.currentTarget.style.filter = "none"}
            >
              <FiLogIn size={14} />
              Login
            </Link>
          )}

          {/* Profile Access Badge */}
          <button 
            onClick={handleProfileClick}
            className="relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-200/60 transition-all active:scale-95 cursor-pointer"
          >
            {isLoggedIn ? (
              userImageUrl ? (
                <img src={userImageUrl} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <span className="text-base font-black uppercase select-none" style={{ color: brandColor }}>
                  {userName.trim().charAt(0)}
                </span>
              )
            ) : (
              <span className="text-base font-bold text-slate-400 select-none">?</span>
            )}
          </button>

          {/* Desktop Instant Logout Trigger */}
          {isLoggedIn && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hidden md:flex w-11 h-11 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 items-center justify-center transition-all active:scale-95 border border-rose-100/40 cursor-pointer"
            >
              <FiLogOut size={17} />
            </button>
          )}

          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl p-2.5 text-black bg-slate-50 active:scale-90 rounded-full transition-all focus:outline-none cursor-pointer"
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* ─── MOBILE SLIDE DRAWER MENU ─── */}
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
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white border-l border-slate-100 z-50 p-6 flex flex-col justify-between md:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.05)]"
            >
              <div className="space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <Image 
                    src="/images/Bsp Ccontinental financial logo PNG (1).png" 
                    alt="BSP Continental Logo" 
                    width={400} 
                    height={120} 
                    className="h-16 w-auto object-contain"
                  />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-xl text-black bg-slate-50 p-1.5 rounded-full active:scale-90 cursor-pointer"
                  >
                    <HiX />
                  </button>
                </div>

                {/* User HUD */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-3xs">
                      {isLoggedIn ? (
                        userImageUrl ? (
                          <img src={userImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base font-black uppercase" style={{ color: brandColor }}>{userName.trim().charAt(0)}</span>
                        )
                      ) : (
                        <span className="text-base font-bold text-slate-400">?</span>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h3 className="text-sm font-black text-slate-950 truncate uppercase tracking-tight">
                        {isLoggedIn ? userName : "Guest"}
                      </h3>
                    </div>
                  </div>

                  <div>
                    {isLoggedIn ? (
                      <button
                        onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/login" }); }}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs uppercase tracking-wider active:scale-[0.98] transition-all border border-rose-100/40 cursor-pointer"
                      >
                        <FiLogOut size={14} /> Log Out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all text-center cursor-pointer"
                        style={{ backgroundColor: brandColor }}
                      >
                        <FiLogIn size={14} /> Login
                      </Link>
                    )}
                  </div>
                </div>

                {/* Mobile Menu List Links */}
                <div className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item)}
                        className="flex items-center gap-4 text-base font-black px-4 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
                        style={{ 
                          backgroundColor: isActive ? `${brandColor}10` : "transparent",
                          color: isActive ? brandColor : "#334155"
                        }}
                      >
                        <span style={{ color: isActive ? brandColor : "#94A3B8" }}>
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    );
                  })}

                  {/* My Requests Link */}
                  {isLoggedIn && (
                    <Link
                      href="/dashboard/my-requests"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 text-base font-black px-4 py-3 rounded-xl transition-all duration-150 active:scale-[0.98]"
                      style={{ 
                        backgroundColor: pathname === "/dashboard/my-requests" ? `${brandColor}10` : "transparent",
                        color: pathname === "/dashboard/my-requests" ? brandColor : "#334155"
                      }}
                    >
                      <span style={{ color: pathname === "/dashboard/my-requests" ? brandColor : "#94A3B8" }}>
                        <FiList size={20} />
                      </span>
                      My Requests
                    </Link>
                  )}

                  {/* Profile Link */}
                  {isLoggedIn && (
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 text-base font-black px-4 py-3 rounded-xl transition-all duration-150 active:scale-[0.98]"
                      style={{ 
                        backgroundColor: pathname === "/dashboard/profile" ? `${brandColor}10` : "transparent",
                        color: pathname === "/dashboard/profile" ? brandColor : "#334155"
                      }}
                    >
                      <span style={{ color: pathname === "/dashboard/profile" ? brandColor : "#94A3B8" }}><FiUser size={20} /></span>
                      My Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Fixed Drawer Footer */}
              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  © 2026 BSP CCONTINENTAL
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}