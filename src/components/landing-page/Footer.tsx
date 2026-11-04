"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const servicesLinks = [
    { title: "Financial Consulting", href: "/services/financial-consulting" },
    { title: "CIBIL Score Management", href: "/services/cibil-management" },
    { title: "Property Compliance", href: "/services/property-compliance" },
  ];

  const companyLinks = [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Track Request", href: "/dashboard/my-requests" },
    { title: "Client Login", href: "/login" },
  ];

  return (
    <footer
      className={`w-full bg-[#083520] text-white pt-14 select-none antialiased transition-all duration-300 ${
        isDashboard ? "lg:pl-64 pb-24 lg:pb-8" : "pb-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-12">
        
        {/* 3 COLUMNS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* CORPORATE DETAILS SECTION */}
          <div className="lg:col-span-6 space-y-3 font-mono text-xs sm:text-[13px] leading-relaxed text-white/90">
            <h2 className="text-base sm:text-lg font-black tracking-wide text-white font-sans uppercase">
              BSP CONTINENTAL PRIVATE LIMITED
            </h2>
            
            <p className="text-[#f3c251] font-bold">
              CIN: U72900CT2020PTC010373
            </p>

            <p className="text-white/80">
              <span className="text-white font-semibold">Registered Office:</span> Shop No OAS - 4, 2nd Floor, Super Market Complex, Agrasen Chowk, Link Road, Bilaspur (C.G.) 495001
            </p>

            <div className="flex flex-wrap items-center gap-x-2 text-white/80 pt-1">
              <span>Email:</span>
              <a href="mailto:bspccontinental@gmail.com" className="text-white hover:text-[#f3c251] transition-colors underline">
                bspccontinental@gmail.com
              </a>
              <span>|</span>
              <span>Phone:</span>
              <a href="tel:9575059137" className="text-white hover:text-[#f3c251] transition-colors">
                +91 95750 59137
              </a>
            </div>

            <p className="text-white/80">
              Website:{" "}
              <a 
                href="https://www.bspccontinental.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#f3c251] hover:underline"
              >
                www.bspccontinental.com
              </a>
            </p>
          </div>

          {/* SERVICES LINKS */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-sm sm:text-base font-bold text-[#f3c251] tracking-wide uppercase font-sans">
              Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/85">
              {servicesLinks.map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="hover:text-[#f3c251] transition-colors block"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-sm sm:text-base font-bold text-[#f3c251] tracking-wide uppercase font-sans">
              Company
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/85">
              {companyLinks.map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="hover:text-[#f3c251] transition-colors block"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-white/80 font-normal">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link>
            <span>|</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund &amp; Cancellation</Link>
            <span>|</span>
            <Link href="/client-consent" className="hover:text-white transition-colors">Client Consent</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Help and Support</Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs sm:text-sm font-bold text-[#f3c251] tracking-wide">
              Secure Finance. Compliant Properties. Sustainable Growth.
            </p>
            <p className="text-xs text-white/70 font-normal font-mono">
              Copyright 2026 BSP CONTINENTAL PRIVATE LIMITED
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}