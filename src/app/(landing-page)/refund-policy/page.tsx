"use client";

import React from "react";
import Link from "next/link";
import { FiShield, FiFileText } from "react-icons/fi";

export default function RefundPolicyPage() {
  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. TOP HERO BANNER (MATCHES ALL OTHER PAGES) ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 sm:px-12 lg:px-20 border-b border-emerald-950/70">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2.5px] bg-[#f3c251]" />
            <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              LEGAL COMPLIANCE & GOVERNANCE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
            REFUND & CANCELLATION POLICY.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/85 font-normal max-w-2xl leading-relaxed">
            BSP CONTINENTAL PRIVATE LIMITED • Official terms, client rights, processing timelines, and operational parameters.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-200/70">
            <span>Effective Date: 07/09/2026</span>
            <span>•</span>
            <span>CIN: U72900CT2020PTC010373</span>
          </div>
        </div>
      </section>

      {/* ─── 2. POLICY DOCUMENT CONTENT (CLEAN & READABLE 7XL CONTAINER) ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800 space-y-2">
            <p className="font-bold text-[#052516] uppercase tracking-wide">
              BSP CONTINENTAL PRIVATE LIMITED
            </p>
            <p className="font-normal text-slate-600">
              (“Company”, “we”, “us” or “our”) provides professional financial consultancy, credit score management, property compliance, loan-readiness and related advisory services. This Refund & Cancellation Policy explains the terms applicable to payments made by customers (“Client”, “you” or “your”) for our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              1. Scope of the Policy
            </h2>
            <p className="text-slate-600 font-normal">
              This policy applies to all services purchased or availed through BSP CONTINENTAL PRIVATE LIMITED, including services provided through our website, digital platforms, payment gateways, email, telephone, or other approved communication channels.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              2. Service Confirmation
            </h2>
            <p className="text-slate-600 font-normal">
              A service shall be considered confirmed once the Company receives the applicable payment and the Client has accepted the relevant service terms. Depending upon the nature of the service, work may commence immediately after payment confirmation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              3. Cancellation by Client
            </h2>
            <p className="text-slate-600 font-normal">
              The Client may request cancellation of a service by submitting a written cancellation request through the Company’s official communication channel. Cancellation requests received before commencement of the service may be considered for a refund, subject to applicable administrative or processing charges. Once the Company has commenced the service, including consultation, document review, verification, analysis, report preparation, application assistance, or other professional work, the amount paid may become non-refundable, either fully or partially, depending upon the stage of work completed.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              4. Refund Eligibility
            </h2>
            <p className="text-slate-600 font-normal">
              A refund may be considered in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-normal">
              <li>Payment has been received but the Company has not commenced the agreed service.</li>
              <li>The Company is unable to provide the service for reasons attributable solely to the Company.</li>
              <li>Duplicate payment has been made for the same service.</li>
              <li>Any other situation specifically approved by the Company after reviewing the circumstances.</li>
            </ul>
            <p className="text-slate-600 font-normal pt-1">
              Where a refund is approved, the refundable amount shall normally be processed through the original payment method.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              5. Non-Refundable Services
            </h2>
            <p className="text-slate-600 font-normal">
              Payments may not be refundable after the Company has commenced work involving any of the following:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-normal">
              <li>Financial or loan consultation;</li>
              <li>Credit report/CIBIL review or dispute assistance;</li>
              <li>Loan eligibility or loan-readiness assessment;</li>
              <li>Property title or document review;</li>
              <li>Property search, survey or compliance-related work;</li>
              <li>Preparation of reports, applications, proposals or documentation;</li>
              <li>Debt restructuring or consolidation advisory;</li>
              <li>Professional consultation already provided;</li>
              <li>Customized research, analysis or advisory work;</li>
              <li>Services involving third-party charges, government fees, professional fees or other external expenses.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              6. Loan & Financial Consultancy Disclaimer
            </h2>
            <p className="text-slate-600 font-normal">
              Payment for consultancy or loan-assistance services does <strong>not constitute a guarantee of loan approval, sanction, disbursement, credit-limit enhancement, restructuring approval or any other decision</strong> by a bank, NBFC, financial institution or third party. Any decision relating to loan sanction, credit assessment, interest rate, security, documentation or disbursement shall remain solely with the concerned financial institution. Therefore, rejection or non-approval of a loan by a bank, NBFC or other financial institution shall not, by itself, create an automatic right to a refund where the Company has already performed the agreed consultancy or advisory services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              7. Property Compliance Services
            </h2>
            <p className="text-slate-600 font-normal">
              For property-related services, once the Company has commenced document verification, title review, search work, survey coordination, report preparation or related professional services, the applicable professional charges may become non-refundable. The Company does not guarantee the outcome of any property transaction, registration, mutation, title dispute, government record, court proceeding or third-party verification.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              8. Credit Score & Dispute Services
            </h2>
            <p className="text-slate-600 font-normal">
              For credit score management and dispute-related services, fees paid for professional review, analysis, documentation, dispute preparation, submission assistance or follow-up services may be non-refundable once the relevant work has commenced. The Company does not guarantee a particular CIBIL/credit score improvement or acceptance of a dispute by any credit information company, bank, NBFC or other institution.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              9. Third-Party Charges
            </h2>
            <p className="text-slate-600 font-normal">
              Government fees, statutory charges, registration charges, professional fees, survey charges, legal fees, search fees, banking charges, payment gateway charges or other third-party expenses, wherever applicable, may be non-refundable once incurred or paid to the concerned third party.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              10. Refund Processing
            </h2>
            <p className="text-slate-600 font-normal">
              Where a refund is approved, the Company will normally initiate the refund within <strong>7–15 business days</strong> from the date of approval, subject to the processing time of the bank, payment gateway or financial institution. The Company may request reasonable transaction details required for processing the refund.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              11. Cancellation by the Company
            </h2>
            <p className="text-slate-600 font-normal">
              The Company reserves the right to cancel or discontinue a service where:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-normal">
              <li>The Client provides materially incorrect, incomplete or misleading information;</li>
              <li>Required documents or information are not provided;</li>
              <li>The requested service is outside the Company’s scope;</li>
              <li>The service cannot legally or practically be provided;</li>
              <li>The Client engages in fraudulent, unlawful or abusive activities; or</li>
              <li>Continuation of the engagement may expose the Company to legal, regulatory or reputational risk.</li>
            </ul>
            <p className="text-slate-600 font-normal pt-1">
              Where cancellation is initiated by the Company and the Client has paid for services that have not yet been performed, the Company may provide an appropriate refund after deducting any legitimate costs already incurred.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              12. No Refund for Incorrect Information Provided by Client
            </h2>
            <p className="text-slate-600 font-normal">
              The Client is responsible for providing complete, accurate and genuine information and documents. The Company shall not be responsible for any loss, delay, rejection or additional expense arising from incorrect, incomplete, misleading or concealed information provided by the Client or from decisions taken by banks, NBFCs, government authorities, credit bureaus, property owners or other third parties.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              13. Force Majeure
            </h2>
            <p className="text-slate-600 font-normal">
              The Company shall not be liable for delays or inability to provide services caused by circumstances beyond its reasonable control, including government restrictions, system failures, technical issues, natural disasters, regulatory changes, third-party platform failures or other force majeure events. Refunds in such circumstances, if applicable, shall be considered based on the service already performed and actual costs incurred.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              14. Payment Gateway Charges
            </h2>
            <p className="text-slate-600 font-normal">
              Where applicable, payment gateway, transaction or processing charges may be deducted from the refundable amount if such charges have actually been incurred and are non-recoverable by the Company.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              15. Grievance & Refund Requests
            </h2>
            <p className="text-slate-600 font-normal">
              For cancellation, refund or service-related complaints, the Client may contact BSP CONTINENTAL PRIVATE LIMITED through the Company’s official customer-support or grievance channel. The Client should provide:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-normal">
              <li>Full Name;</li>
              <li>Registered mobile number / email;</li>
              <li>Transaction / payment reference number;</li>
              <li>Service purchased;</li>
              <li>Date of payment; and</li>
              <li>Specific reason for cancellation / refund request.</li>
            </ul>
            <p className="text-slate-600 font-normal pt-1">
              The Company will review the request and communicate its decision within a reasonable period.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#052516]">
              16. Governing Law
            </h2>
            <p className="text-slate-600 font-normal">
              This policy shall be governed by and interpreted in accordance with the applicable laws of India. Any dispute shall be subject to the jurisdiction of the competent courts having jurisdiction over the Company’s registered office in Bilaspur (C.G.).
            </p>
          </div>

          {/* Corporate Entity Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 font-mono text-xs text-slate-800 space-y-2">
            <p className="font-bold text-sm text-[#052516]">BSP CONTINENTAL PRIVATE LIMITED</p>
            <p>CIN: U72900CT2020PTC010373</p>
            <p>Registered Office: Shop No OAS – 4, Super Market Complex, Agrasen Chowk, Bilaspur (C.G.) 495001</p>
            <p>Email: bspccontinental@gmail.com | Phone: 09575905173</p>
            <p className="text-slate-500 pt-1">Website: www.bspccontinental.com • Last Updated: 06/09/2026</p>
          </div>

        </div>
      </section>

      {/* ─── 3. START WITH CLARITY CTA BANNER (STANDARD) ─── */}
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