"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const reasons = [
  {
    title: "INTEGRATED GUIDANCE",
    desc: "Financial readiness and property compliance considered together.",
  },
  {
    title: "DOCUMENT-FIRST APPROACH",
    desc: "Practical preparation built around the information and documents required.",
  },
  {
    title: "LOCAL UNDERSTANDING",
    desc: "Service designed around the needs of clients across Chhattisgarh.",
  },
  {
    title: "CLEAR COMMUNICATION",
    desc: "Structured updates and understandable next-step guidance.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function WhyChooseSection() {
  return (
    <section 
      id="why-choose-us" 
      className="py-16 sm:py-24 bg-white text-[#0F1E11] select-none antialiased border-b border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="text-left max-w-4xl space-y-2.5"
        >
          <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
            WHY CHOOSE BSP CCONTINENTAL
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#0F1E11] leading-[1.08]">
            CLARITY BEFORE COMMITMENT.
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-medium tracking-wide max-w-2xl leading-relaxed pt-0.5">
            Advisory support shaped around preparation, compliance and understandable next actions.
          </p>
        </motion.div>

        {/* 2x2 Grid Cards with Gold Left Border Bar */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {reasons.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 pl-8 sm:pl-10 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(243,194,81,0.12)] transition-all flex flex-col justify-center overflow-hidden group cursor-default"
            >
              {/* Left Solid Gold Accent Bar */}
              <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-[#f3c251] rounded-r-full group-hover:w-2 transition-all duration-300" />

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#0F1E11] group-hover:text-[#217044] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}