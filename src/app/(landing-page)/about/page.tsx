"use client";

import React from "react";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiShield, 
  FiTrendingUp, 
  FiPieChart,
  FiCompass,
  FiAward
} from "react-icons/fi";

const coreServices = [
  {
    number: "01",
    title: "Property Compliance",
    desc: "Certified title deed scrutiny, sub-registrar search reports, revenue map survey checks, and boundary dispute vetting.",
    href: "/services/property-compliance",
    icon: <FiShield className="text-xl text-[#217044]" />
  },
  {
    number: "02",
    title: "CIBIL Score Management",
    desc: "Line-by-line credit audit across bureaus, clerical discrepancy disputes, and structured credit restoration.",
    href: "/services/cibil-management",
    icon: <FiTrendingUp className="text-xl text-[#f3c251]" />
  },
  {
    number: "03",
    title: "Financial Consulting",
    desc: "Institutional secured business loan assistance, MSME debt structuring, DPR/CMA formulation, and project finance assistance.",
    href: "/services/financial-consulting",
    icon: <FiPieChart className="text-xl text-[#217044]" />
  },
];

const pillars = [
  {
    title: "Transparency & Integrity",
    desc: "Straightforward communication and honest feasibility reports before taking on any assignment.",
  },
  {
    title: "100% Confidential & Secure",
    desc: "Strict enterprise-grade non-disclosure protocols safeguarding personal tax files and registry records.",
  },
  {
    title: "Technology-Enabled Accuracy",
    desc: "Structured automated file diagnostics combined with seasoned human scrutiny.",
  },
  {
    title: "Dedicated Physical Desk",
    desc: "Operating from Agrasen Chowk, Bilaspur for direct physical document examination and client meetings.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. HERO BANNER: CLEAN TYPOGRAPHY (NO IMAGE) ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-16 sm:pt-32 sm:pb-20 px-6 sm:px-12 lg:px-20 border-b border-emerald-950/70">
        <div className="max-w-5xl mx-auto space-y-5">
          
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-[2px] bg-[#f3c251]" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#f3c251]">
              FINTECH &amp; PROPTECH ECOSYSTEM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
            BUILDING TRUST AT THE INTERSECTION OF FINANCE &amp; PROPERTY.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-3xl">
            BSP Continental Pvt. Ltd. is a technology-enabled FinTech and PropTech company founded by <strong className="text-white font-bold">Mr. Krishna Gedam</strong>, dedicated to simplifying financial and property-related challenges for individuals, businesses, and investors.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <span className="inline-block px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-xs font-mono font-bold text-[#f3c251] tracking-wider uppercase">
              Secure Finance • Compliant Properties • Sustainable Growth
            </span>
            <span className="text-xs text-emerald-200/70 font-mono">
              Founded by Mr. Krishna Gedam
            </span>
          </div>

        </div>
      </section>

      {/* ─── 2. SEAMLESS FLOWING EDITORIAL (NO DIBBA / FULL RESPONSIVE) ─── */}
      <div className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto space-y-16">
        
        {/* About Us & Objective */}
        <article className="space-y-4 border-b border-slate-200/80 pb-14">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            ABOUT US &amp; OBJECTIVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#052516]">
            One Integrated Advisory Platform
          </h2>
          <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            <p>
              We bring together Financial Consultancy, Credit Score Management, and Property Compliance under one integrated ecosystem.
            </p>
            <p>
              Our objective is simple — to help our clients make informed financial decisions, improve their financial readiness, access suitable financing opportunities, and undertake property transactions with greater confidence and due diligence.
            </p>
          </div>
        </article>

        {/* Our Approach */}
        <article className="space-y-4 border-b border-slate-200/80 pb-14">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            OUR APPROACH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#052516]">
            Mitigating Risks Before Capital Is Committed
          </h2>
          <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            <p>
              Financial and property decisions are often complex, involving multiple professionals, documents, institutions, and regulatory requirements. A lack of proper preparation or verification can lead to loan rejection, credit-related issues, property disputes, fraudulent transactions, financial losses, and compliance risks.
            </p>
            <p>
              At BSP Continental Pvt Ltd, we aim to bridge these gaps through a combination of professional expertise, structured processes, technology-enabled solutions, and strategic partnerships. From understanding your financial requirements and improving loan readiness to supporting credit-related matters and property due diligence, we strive to provide a coordinated and transparent service experience.
            </p>
          </div>
        </article>

        {/* Vision & Commitment Dual Columns */}
        <article className="space-y-8 border-b border-slate-200/80 pb-14">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            PURPOSE &amp; VALUES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3 border-l-2 border-[#217044] pl-6">
              <div className="flex items-center gap-2 text-[#217044]">
                <FiCompass className="text-xl" />
                <h3 className="text-base font-black uppercase tracking-wide text-slate-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Our vision is to build a trusted Integrated Financial &amp; Property Compliance Ecosystem where financial readiness and property due diligence come together through technology, expertise, and reliable partnerships. We are working towards a future where clients can access financial advisory, credit management, property compliance, and digital solutions through a single trusted platform.
              </p>
            </div>

            <div className="space-y-3 border-l-2 border-[#f3c251] pl-6">
              <div className="flex items-center gap-2 text-amber-600">
                <FiAward className="text-xl" />
                <h3 className="text-base font-black uppercase tracking-wide text-slate-900">
                  Our Commitment
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                At BSP Continental, we believe that better preparation creates better financial decisions. We are committed to delivering services with transparency, professionalism, confidentiality, and a client-centric approach. While every financial or property decision involves its own risks and circumstances, our role is to help clients understand those risks, organize the required information, and make more informed decisions.
              </p>
            </div>
          </div>
        </article>

        {/* Core Capabilities */}
        <article className="space-y-6 border-b border-slate-200/80 pb-14">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            CORE CAPABILITIES
          </span>
          <div className="divide-y divide-slate-100">
            {coreServices.map((svc) => (
              <div key={svc.number} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black text-[#217044]">{svc.number}</span>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{svc.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-7 sm:pl-7 font-normal">
                    {svc.desc}
                  </p>
                </div>
                <Link 
                  href={svc.href}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#217044] hover:text-[#052516] uppercase tracking-wider pl-7 sm:pl-0 shrink-0"
                >
                  <span>Inquiry Now</span>
                  <FiArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </article>

        {/* Institutional Benchmarks */}
        <article className="space-y-6 border-b border-slate-200/80 pb-14">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            THE BENCHMARK
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <FiCheckCircle className="text-lg text-[#217044] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Official Motto Strip */}
        <div className="p-8 rounded-2xl bg-[#052516] text-white text-center space-y-2 shadow-lg border border-emerald-900">
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#f3c251] font-bold">
            BSP CONTINENTAL PVT. LTD.
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Empowering Financial Decisions • Protecting Property Interests • Building Confidence
          </h2>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
          <div>
            <h3 className="text-lg font-black uppercase text-[#052516]">
              Ready for the Next Step?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Discuss your institutional finance, loan audit, or property compliance documentation directly with our Bilaspur team.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-[#217044] hover:bg-[#164e2e] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
          >
            Contact Desk
          </Link>
        </div>

      </div>

    </main>
  );
}