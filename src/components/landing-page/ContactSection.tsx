"use client";

import { FiArrowRight } from "react-icons/fi";
import ContactForm from "@/components/landing-page/ContactForm";

export default function ContactSection() {
  return (
    <section id="contact" className="py-10 sm:py-14 bg-[#F8FAFC] text-slate-900 select-none antialiased border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Main Container */}
        <div className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12">
          
          {/* ─── LEFT COLUMN: Dark Green Advisory Desk ─── */}
          <div className="lg:col-span-5 bg-[#052516] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
                CONTACT BSP CCONTINENTAL
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black uppercase tracking-tight text-white leading-[1.08]">
                TALK TO THE <br />
                RIGHT TEAM.
              </h2>

              <p className="text-xs sm:text-[13px] text-emerald-100/75 font-medium max-w-sm leading-relaxed">
                Share your requirement and receive a clear next step from our advisory team.
              </p>
            </div>

            {/* Compact Action Cards */}
            <div className="space-y-3 pt-2">
              {/* Call Action Card */}
              <a
                href="tel:9575059137"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
              >
                <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                  <FiArrowRight />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                    CALL THE ADVISORY DESK
                  </span>
                  <p className="text-xs text-emerald-200/90 font-semibold">
                    +91 95750 59137
                  </p>
                </div>
              </a>

              {/* Email Action Card */}
              <a
                href="mailto:bspccontinental@gmail.com"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
              >
                <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                  <FiArrowRight />
                </div>
                <div className="space-y-0.5 truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                    EMAIL YOUR REQUIREMENT
                  </span>
                  <p className="text-xs text-emerald-200/90 font-semibold truncate">
                    bspccontinental@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Compact Consultation Form ─── */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-xl w-full mx-auto space-y-4">
              
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F1E11]">
                  Request a consultation
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Fields marked * are required.
                </p>
              </div>

              <ContactForm />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}