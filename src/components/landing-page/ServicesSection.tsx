"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiShield, 
  FiPieChart,
  FiFileText,
  FiDollarSign
} from "react-icons/fi";
import ServicePrice from "@/components/landing-page/ServicePrice";

// ─── 3 CORE SERVICES ───
const services = [
  {
    number: "01",
    title: "Property Compliance",
    tagline: "Title & Legal Verification",
    icon: <FiShield className="text-xl" />,
    items: [
      "Title Deed Verification",
      "Search Reports & Survey Reports",
      "Mortgage Legal Assistance",
      "Dispute Resolutions",
    ],
    link: "/services/property-compliance",
  },
  {
    number: "02",
    title: "CIBIL Score Management",
    tagline: "Credit Health & Dispute Filing",
    icon: <FiTrendingUp className="text-xl" />,
    items: [
      "CIBIL Score Analysis",
      "CIBIL Score Improvement",
      "CIBIL Errors & Disputes Handling",
    ],
    link: "/services/cibil-management",
  },
  {
    number: "03",
    title: "Financial Consulting",
    tagline: "Corporate & Capital Advisory",
    icon: <FiPieChart className="text-xl" />,
    items: [
      "Secured Business Loan Assistance",
      "Mortgage Loan Assistance",
      "Project Finance Assistance",
    ],
    link: "/services/financial-consulting",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function ServicesCombinedSection() {
  return (
    <div className="w-full select-none antialiased">
      
      {/* ─── PART 1: 3 SERVICES ARCHITECTURAL CARDS ─── */}
      <section id="services" className="pt-16 pb-16 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="text-left max-w-4xl space-y-2.5"
          >
            <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
              OUR SERVICES
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#0F1E11] leading-[1.08]">
              PROPERTY COMPLIANCE, <br />
              STRUCTURED AROUND YOU.
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide max-w-2xl leading-relaxed pt-0.5">
              One integrated service structure for certified title vetting, credit restoration, and institutional capital structuring.
            </p>
          </motion.div>

          {/* 3 Cards Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {services.map((item) => (
              <motion.div
                key={item.number}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(33,112,68,0.12)] hover:border-[#217044] transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#217044]/5 rounded-bl-full pointer-events-none group-hover:bg-[#217044]/10 transition-colors" />

                <div className="space-y-5">
                  {/* Icon & Number Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#217044]/10 text-[#217044] group-hover:bg-[#217044] group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono font-black text-[#f3c251] tracking-wider px-2.5 py-1 rounded-lg bg-[#f3c251]/15 border border-[#f3c251]/35">
                      {item.number}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-[#217044] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-bold text-[#f3c251] uppercase tracking-wider mt-0.5">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Service Items List */}
                  <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                    {item.items.map((subItem, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-snug">
                        <FiCheckCircle className="text-[#217044] shrink-0 text-sm mt-0.5" />
                        <span>{subItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Button */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={item.link}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#217044] hover:bg-[#164e2e] text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 group/btn"
                  >
                    <span>INQUIRY NOW</span>
                    <FiArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ─── PART 2: SPECIAL SERVICES (PROPERTY COMPLIANCE, CIBIL, FINANCIAL CONSULTING) ─── */}
      <section className="relative w-full bg-[#032012] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-emerald-950">
        
        {/* Background Aesthetics */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#07361f] rounded-full blur-3xl opacity-40 pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#217044]/15 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              SPECIAL SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Box 1: Property Compliance */}
            <div className="bg-[#052d1b]/90 border border-emerald-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#f3c251]/50 transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-[#f3c251] flex items-center justify-center text-2xl">
                  <FiFileText />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    Property Compliance
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                    Title deed scrutiny, revenue survey checks, sub-registrar search reports, and boundary dispute vetting.
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-emerald-500/20">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">In Just</span>
                  <ServicePrice slug="property-compliance" suffix="/-" className="text-3xl font-black font-mono text-[#f3c251]" />
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/services/property-compliance"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#f3c251] hover:bg-[#e5b33d] text-[#052516] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  <span>INQUIRY NOW</span>
                  <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            {/* Box 2: CIBIL Score Management */}
            <div className="bg-[#052d1b]/90 border border-emerald-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#f3c251]/50 transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-[#f3c251] flex items-center justify-center text-2xl">
                  <FiTrendingUp />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    CIBIL Score Management
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                    Multi-bureau report diagnostics, error identification, credit dispute resolution, and score restoration strategy.
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-emerald-500/20">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">In Just</span>
                  <ServicePrice slug="cibil-management" suffix="/-" className="text-3xl font-black font-mono text-[#f3c251]" />
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/services/cibil-management"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#f3c251] hover:bg-[#e5b33d] text-[#052516] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  <span>INQUIRY NOW</span>
                  <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            {/* Box 3: Financial Consulting */}
            <div className="bg-[#052d1b]/90 border border-emerald-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#f3c251]/50 transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-[#f3c251] flex items-center justify-center text-2xl">
                  <FiDollarSign />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    Financial Consulting
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                    Secured business loans, mortgage financing, CMA data formulation, and comprehensive project reports preparation.
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-emerald-500/20">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">In Just</span>
                  <ServicePrice slug="financial-consulting" suffix="/-" className="text-3xl font-black font-mono text-[#f3c251]" />
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/services/financial-consulting"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#f3c251] hover:bg-[#e5b33d] text-[#052516] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  <span>INQUIRY NOW</span>
                  <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}