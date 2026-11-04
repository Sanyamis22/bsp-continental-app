"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClarityCtaBanner({
  tag = "READY FOR THE NEXT STEP?",
  title = "START WITH CLARITY.",
  description = "Discuss your financial, loan-readiness or property-compliance requirement with our advisory team.",
  primaryBtnText = "REQUEST A CONSULTATION",
  primaryBtnHref = "/contact",
  secondaryBtnText = "CALL NOW",
  secondaryBtnHref = "tel:9575059137",
  showContactBar = true,
}) {
  return (
    <div className="relative w-full bg-[#052313] text-white py-14 sm:py-20 px-6 sm:px-12 lg:px-16 select-none antialiased overflow-hidden rounded-3xl border border-emerald-950/60 shadow-xl">
      
      {/* ─── Background Concentric Geometry (Right Side Curves) ─── */}
      <div className="absolute top-1/2 -right-32 w-[520px] h-[520px] rounded-full border border-emerald-500/15 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 -right-56 w-[700px] h-[700px] rounded-full border border-emerald-500/10 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 -right-80 w-[880px] h-[880px] rounded-full border border-emerald-500/5 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#0c4427]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6 text-left">
        
        {/* Label Tag */}
        <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.24em] text-[#f3c251] block">
          {tag}
        </span>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white leading-[1.04]">
          {title}
        </h2>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base text-emerald-100/80 font-medium max-w-xl leading-relaxed">
          {description}
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={primaryBtnHref}
            className="px-8 py-3.5 bg-[#f3c251] hover:bg-[#e4b443] text-[#052313] text-xs font-black uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-95 text-center cursor-pointer"
          >
            {primaryBtnText}
          </Link>

          <a
            href={secondaryBtnHref}
            className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/60 hover:border-white text-xs font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 text-center cursor-pointer"
          >
            {secondaryBtnText}
          </a>
        </div>

        {/* Bottom Desk Numbers Line */}
        {showContactBar && (
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-medium text-emerald-200/70">
            <span className="font-bold uppercase text-white tracking-wider text-[11px]">
              BSP Ccontinental Pvt Ltd
            </span>
            <span className="tracking-wide text-emerald-200/90 font-mono text-[11px] sm:text-xs">
              +91 95750 59137 | +91 95759 59137
            </span>
          </div>
        )}

      </div>
    </div>
  );
}