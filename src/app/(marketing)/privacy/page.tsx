"use client";

import React from "react";
import Link from "next/link";
import { FiShield, FiLock, FiCheckSquare } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. TOP HERO BANNER ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 sm:px-12 lg:px-20 border-b border-emerald-950/70">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2.5px] bg-[#f3c251]" />
            <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              DATA PROTECTION & GOVERNANCE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
            PRIVACY & DATA PROTECTION POLICY.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/85 font-normal max-w-2xl leading-relaxed">
            BSP CONTINENTAL PRIVATE LIMITED • Official framework for collecting, processing, securing, and sharing client financial & property records.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-200/70">
            <span>Effective Date: 06/09/2026</span>
            <span>•</span>
            <span>CIN: U72900CT2020PTC010373</span>
          </div>
        </div>
      </section>

      {/* ─── 2. POLICY DOCUMENT CONTENT ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800 space-y-2">
            <p className="font-bold text-[#052516] uppercase tracking-wide">
              BSP CONTINENTAL PRIVATE LIMITED
            </p>
            <p className="font-normal text-slate-600">
              (“BSP Continental”, “Company”, “we”, “us” or “our”) respects the privacy and confidentiality of information provided by its clients, visitors, and business partners. This Data Protection & Privacy Policy explains how we collect, use, store, protect, and where necessary, share information in connection with our financial consultancy, credit score management, property compliance, loan-readiness, and related professional services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              1. Information We May Collect
            </h2>
            <div className="space-y-3 text-slate-600 font-normal">
              <p><strong>A. Personal Information:</strong> Full name, contact phone number, email address, residential/business address, and professional records.</p>
              <p><strong>B. Financial Information:</strong> Income details, bank account statements, existing liabilities, ITR filings, GST accounts, and balance sheets voluntarily provided for loan-readiness assessments.</p>
              <p><strong>C. Credit Information:</strong> Authorized bureau reports (CIBIL, Experian, CRIF), credit history, dispute notices, and overdue settlement data.</p>
              <p><strong>D. Property Records:</strong> Title deeds, sub-registrar search extracts, registry documents, Khasra/B-1 records, and municipal receipts for compliance vetting.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              2. Purpose of Data Collection
            </h2>
            <p className="text-slate-600 font-normal">
              Data is collected exclusively to conduct pre-underwriting checks, review credit bureau errors, formulate restructuring dossiers, execute property compliance searches, communicate project updates, and adhere to statutory audit and compliance requirements.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              3. Consent for Data Sharing
            </h2>
            <p className="text-slate-600 font-normal">
              Information is shared only with strictly authorized third parties essential for executing requested assignments. These entities include scheduled Banks, NBFCs, Credit Information Companies, Revenue Registrars, Legal Counsels, Chartered Accountants, Surveyors, and certified Payment Gateways (Razorpay).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              4. No Commercial Sale of Personal Data
            </h2>
            <p className="text-slate-600 font-normal">
              BSP CONTINENTAL PRIVATE LIMITED does not sell, rent, or trade client personal or financial information to commercial brokers or third-party marketing networks under any circumstances.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              5. Data Security & Storage Safeguards
            </h2>
            <p className="text-slate-600 font-normal">
              We apply technical, encrypted, and administrative security protocols to protect sensitive records from unauthorized access, breach, or loss. Access is restricted strictly to verified advisory officers handling client files.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              6. Payment Information Security
            </h2>
            <p className="text-slate-600 font-normal">
              Online service transactions are processed directly through 256-bit encrypted third-party payment gateway infrastructure (Razorpay). The Company does not store complete debit/credit card numbers or banking passwords on internal servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              7. Client Rights & Consent Withdrawal
            </h2>
            <p className="text-slate-600 font-normal">
              Clients retain the right to review, update, correct inaccuracies, or formally withdraw consent for non-statutory data processing by writing to our designated grievance officer. Withdrawal may restrict further advisory assistance if data is operationally essential.
            </p>
          </div>

          {/* Grievance & Corporate Entity Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 font-mono text-xs text-slate-800 space-y-2">
            <p className="font-bold text-sm text-[#052516]">BSP CONTINENTAL PRIVATE LIMITED</p>
            <p>CIN: U72900CT2020PTC010373</p>
            <p>Privacy & Grievance Contact: Krisna Gedaam (Founder & CEO)</p>
            <p>Registered Office: Shop No OAS – 4, 2nd Floor, Super Market Complex, Agrasen Chowk, Link Road, Bilaspur (C.G.) 495001</p>
            <p>Email: bspccontinental@gmail.com | Phone: 09575905173</p>
            <p className="text-slate-500 pt-1">Website: www.bspccontinental.com • Last Updated: 06/09/2026</p>
          </div>

        </div>
      </section>

      {/* ─── 3. START WITH CLARITY CTA BANNER ─── */}
      <section className="w-full pb-20 sm:pb-28 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto relative w-full bg-[#052516] text-white py-14 sm:py-20 px-6 sm:px-12 lg:px-16 overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute top-1/2 -right-32 w-[520px] h-[520px] rounded-full border border-[#217044]/25 pointer-events-none -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#217044]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6 text-left">
            <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.24em] text-[#f3c251] block">
              READY FOR THE NEXT STEP?
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white leading-[1.04]">
              START WITH CLARITY.
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/85 font-medium max-w-xl leading-relaxed">
              Discuss your institutional finance, loan-readiness audit or property compliance documentation with our Bilaspur consulting team.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#f3c251] hover:bg-[#e4b443] text-[#052516] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center cursor-pointer"
              >
                REQUEST A CONSULTATION
              </Link>

              <a
                href="tel:9575059137"
                className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 text-center cursor-pointer"
              >
                CALL DESK NOW
              </a>
            </div>

            <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-medium text-emerald-200/70">
              <span className="font-bold uppercase text-white tracking-wider text-[11px]">
                BSP Ccontinental Pvt Ltd
              </span>
              <span className="tracking-wide text-emerald-200/90 font-mono text-[11px] sm:text-xs">
                +91 95750 59137 | +91 95759 59137
              </span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}