"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const steps = [
  {
    number: "01",
    title: "SHARE YOUR REQUIREMENT",
    desc: "Tell us the financial, loan or property-compliance support you need.",
  },
  {
    number: "02",
    title: "INITIAL ASSESSMENT",
    desc: "We review the situation, available information and immediate priorities.",
  },
  {
    number: "03",
    title: "PREPARE THE PATH",
    desc: "Documents, readiness gaps and compliance actions are structured clearly.",
  },
  {
    number: "04",
    title: "GUIDED NEXT STEPS",
    desc: "You receive practical guidance for the appropriate next action.",
  },
];

export default function HowItWorksSection() {
  return (
    <section 
      id="how-it-works" 
      className="py-16 sm:py-24 bg-white text-[#0F1E11] select-none antialiased border-b border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left max-w-4xl space-y-3"
        >
          <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
            HOW IT WORKS
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#0F1E11] leading-[1.08]">
            A CLEARER PATH, <br />
            FROM REQUIREMENT TO NEXT STEP.
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-medium tracking-wide max-w-2xl leading-relaxed pt-1">
            A structured advisory process designed to reduce confusion and improve preparedness.
          </p>
        </motion.div>

        {/* ─── DESKTOP: Horizontal Step Flow with Spinning Hover Effect ─── */}
        <div className="hidden lg:grid grid-cols-4 gap-6 items-start">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.number} 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="relative flex flex-col items-start pr-4 group cursor-pointer"
            >
              
              {/* Gold Circle + Arrow Indicator */}
              <div className="w-full flex items-center justify-between mb-8">
                {/* Hover par circle ghumega aur thoda zoom hoga */}
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-full bg-[#f3c251] text-[#0A2615] font-black text-sm flex items-center justify-center shadow-md ring-4 ring-[#f3c251]/20"
                >
                  {step.number}
                </motion.div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 flex justify-center text-[#f3c251] text-2xl px-2 group-hover:translate-x-2 transition-transform duration-300">
                    <FiArrowRight />
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="space-y-2.5">
                <h3 className="text-[15px] font-black uppercase tracking-tight text-[#0F1E11] group-hover:text-[#217044] transition-colors leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* ─── MOBILE: Nadiya / River Timeline Flow ─── */}
        <div className="lg:hidden relative pl-6 space-y-8">
          
          {/* Continuous Vertical River Flow Line */}
          <div className="absolute top-4 bottom-8 left-[39px] w-[2px] bg-gradient-to-b from-[#f3c251] via-[#217044] to-[#f3c251] -translate-x-1/2" />

          {steps.map((step, idx) => (
            <motion.div 
              key={step.number} 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative flex items-start gap-5"
            >
              
              {/* Gold Disc */}
              <motion.div 
                whileTap={{ scale: 0.92, rotate: 180 }}
                className="relative z-10 w-12 h-12 rounded-full bg-[#f3c251] text-[#0A2615] font-black text-xs flex items-center justify-center shrink-0 shadow-md ring-4 ring-white"
              >
                {step.number}
              </motion.div>

              {/* Step Info */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-sm font-black uppercase tracking-tight text-[#0F1E11] leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom CTA (Phone Numbers Removed) */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-start">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#0A2615] hover:bg-[#217044] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
          >
            REQUEST A CONSULTATION
          </Link>
        </div>

      </div>
    </section>
  );
}