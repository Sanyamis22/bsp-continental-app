"use client";

import React from "react";
import Link from "next/link";
import { FiCheckSquare, FiShield, FiFileText } from "react-icons/fi";

export default function ClientConsentPage() {
  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. TOP HERO BANNER ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 sm:px-12 lg:px-20 border-b border-emerald-950/70">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2.5px] bg-[#f3c251]" />
            <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              LEGAL UNDERTAKING & DECLARATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
            CLIENT CONSENT & TERMS ACCEPTANCE.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/85 font-normal max-w-2xl leading-relaxed">
            BSP CONTINENTAL PRIVATE LIMITED • Formal declaration, regulatory consent parameters, and fiduciary limitations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-200/70">
            <span>CIN: U72900CT2020PTC010373</span>
            <span>•</span>
            <span>Governed by Information Technology Act & Indian Contract Law</span>
          </div>
        </div>
      </section>

      {/* ─── 2. LEGAL DOCUMENT CONTENT ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800 space-y-2">
            <p className="font-bold text-[#052516] uppercase tracking-wide">
              MANDATORY DIGITAL DECLARATION
            </p>
            <p className="font-normal text-slate-600">
              Before submitting files or making fee payments through BSP CONTINENTAL PRIVATE LIMITED, clients electronically confirm adherence to the statutory advisory parameters stated below.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              1. Consent and Declaration
            </h2>
            <p className="text-slate-600 font-normal">
              I/We hereby confirm voluntary engagement with BSP CONTINENTAL PRIVATE LIMITED (“Company”). I/We confirm having read, understood, and accepted the Company’s applicable Terms & Conditions, Privacy Policy, Refund & Cancellation Policy, and Disclaimers prior to availing services. Free and informed consent is granted to collect, verify, and process documents solely for advisory execution.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              2. Accuracy of Information
            </h2>
            <p className="text-slate-600 font-normal">
              I/We declare that all information, revenue deeds, bank statements, and credit files submitted are genuine, true, and complete. The Company assumes no responsibility for financial rejections, administrative delays, or third-party liabilities arising from concealed or fraudulent records provided by the client.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              3. Financial & Loan Consultancy Scope
            </h2>
            <p className="text-slate-600 font-normal">
              Advisory engagement does <strong>not constitute an institutional guarantee of loan sanction, debt disbursement, or interest-rate negotiation</strong>. Lending decisions remain strictly within the sole underwriting discretion of respective scheduled banks, NBFCs, and institutional bodies.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              4. Credit Score & Bureau Rectification
            </h2>
            <p className="text-slate-600 font-normal">
              Authorization is granted to examine credit dossiers across bureaus (CIBIL, CRIF, Experian) exclusively for dispute assistance and analytical diagnostics. No speculative score increment is guaranteed, as bureau actions rely purely on lending institution updates.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              5. Property Compliance Boundaries
            </h2>
            <p className="text-slate-600 font-normal">
              Authorization is granted for sub-registrar archives review and revenue parcel verification. The Company provides legal and documented due diligence but does not guarantee the outcome of civil property litigations, mutation orders, or disputed partition titles.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              6. Fees & Electronic Consent (Section 10A IT Act)
            </h2>
            <p className="text-slate-600 font-normal">
              Digital acceptance via checkboxes, payment authentication, or OTP constitutes a binding legal agreement. Once file diagnostics, legal vetting, or bureau audits commence, professional fees become non-refundable in alignment with the Company’s Refund & Cancellation Policy.
            </p>
          </div>

          {/* Acceptance Checklist Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-[#052516] tracking-wider">
              Summary of Fiduciary Undertakings
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-[#217044] text-base shrink-0 mt-0.5" />
                <span>Acknowledged service scope, non-refundable stages, and independent underwriting authority.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-[#217044] text-base shrink-0 mt-0.5" />
                <span>Voluntary consent for statutory verification under prevailing Privacy standards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-[#217044] text-base shrink-0 mt-0.5" />
                <span>Certified accuracy of all submitted property deeds, identity cards, and financial records.</span>
              </li>
            </ul>
          </div>

          {/* Corporate Entity Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 font-mono text-xs text-slate-800 space-y-2">
            <p className="font-bold text-sm text-[#052516]">BSP CONTINENTAL PRIVATE LIMITED</p>
            <p>CIN: U72900CT2020PTC010373</p>
            <p>Registered Office: Shop No OAS – 4, Super Market Complex, Agrasen Chowk, Bilaspur (C.G.) 495001</p>
            <p>Email: bspccontinental@gmail.com | Phone: 09575905173</p>
          </div>

        </div>
      </section>

      {/* ─── 3. BOTTOM CTA BANNER ─── */}
      <section className="w-full pb-20 sm:pb-28 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto relative w-full bg-[#052516] text-white py-14 sm:py-20 px-6 sm:px-12 lg:px-16 overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute top-1/2 -right-32 w-[520px] h-[520px] rounded-full border border-[#217044]/25 pointer-events-none -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#217044]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6 text-left">
            <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.24em] text-[#f3c251] block">
              NEED ADVISORY ASSISTANCE?
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white leading-[1.04]">
              START WITH CLARITY.
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/85 font-medium max-w-xl leading-relaxed">
              Connect with our Bilaspur desk for certified title checks, pre-underwriting dossiers, and institutional debt consulting.
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
          </div>
        </div>
      </section>

    </main>
  );
}