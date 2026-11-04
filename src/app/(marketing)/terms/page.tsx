"use client";

import React from "react";
import Link from "next/link";
import { FiShield, FiFileText } from "react-icons/fi";

export default function TermsPage() {
  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. TOP HERO BANNER (MATCHES ALL OTHER PAGES) ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 sm:px-12 lg:px-20 border-b border-emerald-950/70">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2.5px] bg-[#f3c251]" />
            <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              LEGAL TERMS & GOVERNANCE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
            TERMS & CONDITIONS.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/85 font-normal max-w-2xl leading-relaxed">
            BSP CONTINENTAL PRIVATE LIMITED • General conditions of engagement, regulatory parameters, and service scope.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-200/70">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>CIN: U72900CT2020PTC010373</span>
          </div>
        </div>
      </section>

      {/* ─── 2. TERMS CONTENT (NO-DIBBA OPEN TYPOGRAPHY) ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800 space-y-2">
            <p className="font-bold text-[#052516] uppercase tracking-wide">
              BSP CONTINENTAL PRIVATE LIMITED
            </p>
            <p className="font-normal text-slate-600">
              By accessing, browsing, submitting inquiries, or engaging with services provided by BSP CONTINENTAL PRIVATE LIMITED (“Company”, “We”, “Us”, or “Our”), you electronically agree to be legally bound by these Terms and Conditions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 font-normal">
              By availing any of our financial advisory, CIBIL diagnostics, property compliance, or loan-readiness assessment modules, you affirm that you are of legal age and competent to enter into binding agreements under Indian Contract Law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              2. Nature and Scope of Consulting Services
            </h2>
            <p className="text-slate-600 font-normal">
              BSP CONTINENTAL PRIVATE LIMITED functions exclusively as an independent financial consultancy, loan diagnostic desk, and property compliance verification firm. We provide:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-normal">
              <li>Secured Business Loan & Mortgage Loan file formulation.</li>
              <li>Multi-bureau CIBIL score diagnostics and error dispute support.</li>
              <li>Official revenue registry, khasra verification, and sub-registrar search reports.</li>
              <li>Institutional loan-readiness eligibility audits and restructuring plans.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              3. Regulatory Disclaimer & No Approval Guarantee
            </h2>
            <p className="text-slate-600 font-normal">
              The Company is <strong>neither a bank nor a licensed Non-Banking Financial Company (NBFC)</strong>. Engagement of our consultancy does not constitute a legal or contractual guarantee of loan approval, interest rate concession, or bureau score increment. Final credit sanctions, underwriting eligibility, and security assessments remain the exclusive jurisdiction of the concerned financing institutions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              4. Client Responsibility & Document Integrity
            </h2>
            <p className="text-slate-600 font-normal">
              Clients are strictly liable for the accuracy, legality, and authenticity of all KYC papers, tax records, revenue records, and property deeds provided. The Company holds zero liability for adverse institutional decisions or legal consequences arising from forged, misrepresented, or concealed documentation submitted by the client.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              5. Intellectual Property Rights
            </h2>
            <p className="text-slate-600 font-normal">
              All proprietary materials, digital designs, calculation models, advisory templates, and branding elements across this platform are the sole intellectual property of BSP CONTINENTAL PRIVATE LIMITED. Unauthorized reproduction, modification, or distribution is prohibited under applicable law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              6. Limitation of Liability
            </h2>
            <p className="text-slate-600 font-normal">
              To the maximum extent permitted by law, the Company shall not be liable for any indirect, consequential, or incidental losses arising from lender delays, credit bureau rejection notices, or property ownership title disputes outside our physical verification scope.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              7. Governing Law & Jurisdiction
            </h2>
            <p className="text-slate-600 font-normal">
              These terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Bilaspur, Chhattisgarh.
            </p>
          </div>

          {/* Corporate Entity Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 font-mono text-xs text-slate-800 space-y-2">
            <p className="font-bold text-sm text-[#052516]">BSP CONTINENTAL PRIVATE LIMITED</p>
            <p>CIN: U72900CT2020PTC010373</p>
            <p>Registered Office: Shop No OAS – 4, 2nd Floor, Super Market Complex, Agrasen Chowk, Link Road, Bilaspur (C.G.) 495001</p>
            <p>Email: bspccontinental@gmail.com | Phone: +91 95750 59137</p>
            <p className="text-slate-500 pt-1">Website: www.bspccontinental.com</p>
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