"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiFileText, 
  FiTrendingUp, 
  FiShield, 
  FiPieChart, 
  FiHelpCircle, 
  FiPhone,
  FiSend,
  FiCheck
} from "react-icons/fi";

/* ─── REUSABLE CLARITY CTA BANNER ─── */
function ClarityCtaBanner() {
  return (
    <div className="relative w-full bg-[#052516] text-white py-14 sm:py-20 px-6 sm:px-12 lg:px-16 select-none antialiased overflow-hidden rounded-3xl shadow-2xl border border-emerald-950/60">
      <div className="absolute top-1/2 -right-32 w-[520px] h-[520px] rounded-full border border-[#217044]/25 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 -right-56 w-[700px] h-[700px] rounded-full border border-[#217044]/15 pointer-events-none -translate-y-1/2" />
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
            BSP Continental Pvt Ltd
          </span>
          <span className="tracking-wide text-emerald-200/90 font-mono text-[11px] sm:text-xs">
            +91 95750 59137 | +91 95759 59137
          </span>
        </div>
      </div>
    </div>
  );
}

const tags = ["ELIGIBILITY REVIEW", "DOCUMENT READINESS", "FILE STRUCTURING"];

const snapshotPoints = [
  "Eligibility assessment",
  "Document checklist",
  "Application readiness",
  "Guided next steps",
];

const services = [
  {
    id: "financial-consulting",
    number: "01",
    title: "Financial Consulting",
    tagline: "Corporate & Business Capital",
    icon: <FiPieChart className="text-2xl" />,
    items: [
      "Secured Business Loan Assistance",
      "Mortgage Loan Assistance",
      "MSME & Business Finance",
      "Project Finance",
      "DPR & CMA Preparation",
    ],
    inquiryLink: "/dashboard/financial-consulting",
    overviewPara1:
      "Specialized financial guidance engineered for MSMEs, corporate entities, and entrepreneurs across Chhattisgarh looking to structure institutional debt effectively.",
    overviewPara2:
      "We prepare thorough institutional documentation, align operational cash flows, and manage DPR/CMA preparations before your application reaches underwriting channels.",
    scopeItems: [
      "Secured Business Loan Assistance",
      "Mortgage Loan Assistance",
      "MSME and Business Finance",
      "Project Finance",
      "DPR and CMA Preparation",
    ],
    documents: [
      "3 Years Audited Financial Statements & ITRs",
      "Last 12 Months Operating Bank Statements",
      "Business Registration (GST, Udyam, MOA/AOA)",
      "Existing Sanction Letters & Loan Repayment Tracks",
      "Proposed Collateral / Property Documents",
    ],
    processSteps: [
      "Requirement Intake",
      "Financial Review & Ratios Assessment",
      "CMA / DPR Preparation",
      "Guided Next Steps to Banking Desk",
    ],
    deliverables:
      "Complete loan preparation docket, professionally vetted CMA data report, debt eligibility summary, and a step-by-step submission checklist.",
    faqs: [
      {
        q: "What is the typical turnaround time for CMA & DPR preparation?",
        a: "Standard CMA and project report formulations are delivered within 4 to 6 business days after receiving clean, reconciled accounting data.",
      },
      {
        q: "Does BSP Continental guarantee loan sanctions?",
        a: "No. As per strict compliance, we guarantee documentation accuracy, eligibility assessment, and file readiness. Bank sanction depends solely on lender underwriting.",
      },
    ],
  },
  {
    id: "loan-readiness",
    number: "02",
    title: "Loan Readiness",
    tagline: "Eligibility & Dispute Resolution",
    icon: <FiFileText className="text-2xl" />,
    items: [
      "Loan Eligibility Assessment",
      "Pre-Application File Review",
      "Loan Restructuring",
      "Debt Consolidation",
      "Loan Difficulties & Rejection Resolution",
    ],
    inquiryLink: "/dashboard/loan-readiness",
    overviewPara1:
      "Comprehensive diagnostic screening for retail, MSME, and mortgage loan applicants who want to eliminate rejection risks beforehand.",
    overviewPara2:
      "We audit eligibility metrics, assess past rejection reasons, and provide practical debt-consolidation frameworks before approaching any institutional lender.",
    scopeItems: [
      "Loan Eligibility Assessment",
      "Pre-Application File Review",
      "Loan Restructuring",
      "Debt Consolidation",
      "Loan Difficulties and Rejection Resolution",
    ],
    documents: [
      "Applicant & Co-applicant KYC (PAN, Government Issued Photo Identity)",
      "Income Proof (Salary Slips / 3-Year ITR Computations)",
      "Detailed Statements for All Active Debt Lines",
      "Previous Rejection or Inquiry Letters (if any)",
    ],
    processSteps: [
      "Requirement Analysis",
      "FOIR & Burden Assessment",
      "Debt Optimization Preparation",
      "Guided Submission Readiness",
    ],
    deliverables:
      "An executive Loan Readiness Audit Report identifying credit friction points, debt-to-income benchmarks, and recommended file structuring steps.",
    faqs: [
      {
        q: "How do you help with past loan rejections?",
        a: "We perform a forensic file review to locate technical mismatches, high inquiries, or banking transaction anomalies that triggered the rejection, providing actionable correction steps.",
      },
      {
        q: "Is this service suitable for home loans and LAP?",
        a: "Yes. It covers secured retail home loans, loan against property, and unsecured commercial debt structures.",
      },
    ],
  },
  {
    id: "cibil-management",
    number: "03",
    title: "CIBIL Score Management",
    tagline: "Credit Restoration & Disputes",
    icon: <FiTrendingUp className="text-2xl" />,
    items: [
      "CIBIL Score Analysis",
      "Credit Report Audit",
      "Credit Score Improvement",
      "Credit Report Error Identification",
      "CIBIL, CRIF & Experian Dispute Assistance",
    ],
    inquiryLink: "/dashboard/cibil-management",
    overviewPara1:
      "Targeted credit profile assessment and dispute facilitation across all four major credit bureaus in India (CIBIL, CRIF, Experian, Equifax).",
    overviewPara2:
      "We help identify erroneous defaults, outdated settled remarks, and identity mismatches, structuring a viable path toward long-term credit health.",
    scopeItems: [
      "CIBIL Score Analysis",
      "Credit Report Audit",
      "Credit Score Improvement",
      "Credit Report Error Identification",
      "CIBIL, CRIF and Experian Dispute Assistance",
    ],
    documents: [
      "Updated Full Credit Bureau Reports (CIBIL/CRIF)",
      "Government Issued Identity Documentation",
      "Loan Closure NOCs / Settlement Certificates (if disputed)",
      "Bank Account Statements reflecting disputed payments",
    ],
    processSteps: [
      "Report Intake",
      "Dispute & DPD Assessment",
      "Dispute Dossier Preparation",
      "Bureau Follow-up Guidance",
    ],
    deliverables:
      "Line-by-line Bureau Discrepancy Audit, error-correction escalation templates, and a 6-month score enhancement roadmap.",
    faqs: [
      {
        q: "Can you remove genuine default entries from CIBIL?",
        a: "No advisory can alter legitimate payment histories. We challenge inaccurate data, uncredited payments, duplicate accounts, and missing closure NOCs.",
      },
      {
        q: "How soon do dispute resolutions reflect in scores?",
        a: "Bureau disputes typically process within 30 to 45 days after the lender confirms reconciliation.",
      },
    ],
  },
  {
    id: "property-compliance",
    number: "04",
    title: "Property Compliance Services",
    tagline: "Secure Property Before Investment",
    icon: <FiShield className="text-2xl" />,
    items: [
      "Title Verification",
      "Ownership Verification",
      "Fake Ownership Detection",
      "Encumbrance Verification",
      "Search Report Preparation",
    ],
    inquiryLink: "/dashboard/property-compliance",
    overviewPara1:
      "Buying or mortgaging a property without proper verification can result in legal disputes and financial loss. We perform comprehensive legal and technical due diligence & proper analysis to ensure every property is genuine and compliant.",
    overviewPara2:
      "Designed for property buyers, builders, and mortgage borrowers seeking complete clarity on ownership authenticity, municipal diversions, and encumbrances.",
    scopeItems: [
      "Title Verification",
      "Ownership Verification",
      "Fake Ownership Detection",
      "Encumbrance Verification",
      "Search Report Preparation",
      "Survey Report Preparation",
      "Property Risk Assessment",
    ],
    documents: [
      "Registered Sale Deed / Title Deed Copy",
      "Chain Documents (Prior 13–30 Years Deeds)",
      "Updated Khasra, B-1, and Kishtabandi Khatauni",
      "Nazul Lease / Diversion Records (if applicable)",
      "Municipal Approved Map & Current Tax Receipts",
    ],
    processSteps: [
      "Document Intake",
      "Sub-Registrar & Revenue Assessment",
      "Title Chain Verification",
      "Search Report Delivery",
    ],
    deliverables:
      "Certified 13–30 Year Search and Survey Legal Opinion Report detailing ownership continuity, encumbrance findings, and compliance status. Benefits: Safe Investment, Legal Protection, Fraud Prevention, Complete Due Diligence.",
    faqs: [
      {
        q: "What areas of Chhattisgarh are covered?",
        a: "We provide comprehensive land record and sub-registrar verification across Bilaspur, Raipur, Durg, Korba, and surrounding districts.",
      },
      {
        q: "Does this cover agricultural land diversion checks?",
        a: "Yes. We verify agricultural diversion status, Nazul clearance, and SDM/Collector approval records.",
      },
    ],
  },
];

const containerVariants = {
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
  const [activeTab, setActiveTab] = useState(services[0].id);
  const currentService = services.find((s) => s.id === activeTab) || services[0];

  const handleCardClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById("detailed-breakdown");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full select-none antialiased bg-[#FAFBFD]">
      
      {/* ─── PART 1: TOP HERO BANNER ─── */}
      <section className="relative w-full bg-[#052516] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-emerald-950">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#217044]/20 rounded-full blur-3xl opacity-40 pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute top-1/2 -right-24 w-[520px] h-[520px] rounded-full border border-[#217044]/20 pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 -right-48 w-[680px] h-[680px] rounded-full border border-[#217044]/10 pointer-events-none -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="order-1 lg:order-1 lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 bg-[#07331f]/60">
                <Image
                  src="/images/ser1.png"
                  alt="BSP Continental Loan Readiness & Services"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#052516]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#052516]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[11px] font-mono text-emerald-200 uppercase tracking-widest font-bold">
                    Direct Advisory Desk • Bilaspur
                  </p>
                </div>
              </div>
            </div>

            <div className="order-2 lg:order-2 lg:col-span-7 flex flex-col items-start space-y-6">
              <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.24em] text-[#f3c251] block">
                LOAN READINESS CONSULTING
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-black uppercase tracking-tight text-white leading-[1.05]">
                PREPARE BEFORE <br />
                YOU APPLY.
              </h1>

              <p className="text-sm sm:text-base text-emerald-100/85 font-medium max-w-xl leading-relaxed">
                Assess eligibility, organize verified legal documents, and address readiness gaps before approaching an institutional lender.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full bg-[#0a331f]/80 border border-emerald-500/25 text-[11px] font-mono font-bold tracking-wider text-emerald-100/90 shadow-inner"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {snapshotPoints.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#0a331f]/60 border border-emerald-500/15 rounded-xl px-3 py-2 text-[11px] font-semibold text-emerald-100/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f3c251] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#services-grid"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#f3c251] hover:bg-[#e5b33d] text-[#052516] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center cursor-pointer"
                >
                  EXPLORE SERVICES
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 text-center cursor-pointer"
                >
                  TALK TO CONSULTANT
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PART 2: THE 4 SERVICES ARCHITECTURAL CARDS ─── */}
      <section id="services-grid" className="pt-16 pb-20 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
              FINANCIAL GUIDANCE, <br />
              STRUCTURED AROUND YOU.
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide max-w-2xl leading-relaxed pt-0.5">
              One integrated service structure for financial readiness, loan diagnostics, and property compliance in Bilaspur and Chhattisgarh.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 items-stretch"
          >
            {services.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <motion.div
                  key={item.number}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => handleCardClick(item.id)}
                  className={`bg-white rounded-3xl p-7 border shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(33,112,68,0.12)] hover:border-[#217044] transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer min-h-[460px] ${
                    isSelected ? "border-[#217044] ring-2 ring-[#217044]/25" : "border-slate-200/90"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#217044]/5 rounded-bl-full pointer-events-none group-hover:bg-[#217044]/10 transition-colors" />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[#217044]/10 text-[#217044] group-hover:bg-[#217044] group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                        {item.icon}
                      </div>
                      <span className="text-xs font-mono font-black text-[#f3c251] tracking-wider px-3 py-1 rounded-lg bg-[#f3c251]/15 border border-[#f3c251]/35">
                        {item.number}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-[#217044] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider">
                        {item.tagline}
                      </p>
                    </div>

                    <ul className="space-y-3 pt-3 border-t border-slate-100">
                      {item.items.map((subItem, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600 leading-snug">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#217044] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                            <FiCheck strokeWidth={3} />
                          </span>
                          <span>{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                    <Link
                      href={item.inquiryLink}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#217044] hover:bg-[#164e2e] text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 group/btn"
                    >
                      <FiSend className="text-xs" />
                      <span>START INQUIRY</span>
                      <FiArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCardClick(item.id)}
                      className="w-full py-2 bg-slate-50 hover:bg-emerald-50/70 text-slate-600 hover:text-[#217044] text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors border border-slate-100"
                    >
                      VIEW AUDIT CRITERIA
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ─── PART 3: DETAILED BENTO BREAKDOWN SYSTEM ─── */}
      <section id="detailed-breakdown" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251] block">
              DETAILED BREAKDOWN
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F1E11] leading-tight">
              {currentService.title} SPECIFICATIONS.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select any card above to view documentation checklist, deliverables and execution steps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                    <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251] block">
                      01 OVERVIEW
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-[#0F1E11]">
                      Explain the service
                    </h3>
                    <div className="space-y-3 text-sm text-slate-600 font-medium leading-relaxed">
                      <p>{currentService.overviewPara1}</p>
                      <p>{currentService.overviewPara2}</p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                    <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251] block">
                      02 WHAT WE REVIEW
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-[#0F1E11]">
                      Scope and documents
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Detailed checklist of items reviewed. Avoid promising approval, score increase, legal outcome or dispute resolution.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/80">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block">
                          Service Scope
                        </span>
                        <ul className="space-y-2">
                          {currentService.scopeItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                              <FiCheckCircle className="text-[#217044] shrink-0 text-sm mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/80">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block">
                          Required Documents
                        </span>
                        <ul className="space-y-2">
                          {currentService.documents.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f3c251] shrink-0 mt-1.5" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251] block">
                        03 PROCESS
                      </span>
                      <h3 className="text-xl font-black tracking-tight text-[#0F1E11]">
                        Four clear steps
                      </h3>
                      <p className="text-xs font-mono text-emerald-800 font-bold">
                        Requirement → Assessment → Preparation → Guided next step.
                      </p>
                      
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        {currentService.processSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                            <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-600 shrink-0">
                              0{idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251] block">
                        04 DELIVERABLES
                      </span>
                      <h3 className="text-xl font-black tracking-tight text-[#0F1E11]">
                        What the client receives
                      </h3>
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-900/10 text-xs sm:text-sm font-semibold text-[#062415] leading-relaxed">
                        {currentService.deliverables}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                    <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251] block">
                      05 FREQUENTLY ASKED QUESTIONS
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-[#0F1E11]">
                      Answer before the inquiry
                    </h3>

                    <div className="space-y-3 pt-1">
                      {currentService.faqs.map((faq, idx) => (
                        <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center gap-2 font-black text-sm text-[#0F1E11]">
                            <FiHelpCircle className="text-[#217044] shrink-0 text-base" />
                            <span>{faq.q}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pl-6">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
              <div className="bg-[#052516] text-white rounded-3xl p-7 sm:p-8 space-y-5 shadow-xl border border-emerald-950">
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.22em] text-[#f3c251] block">
                  NEED GUIDANCE?
                </span>

                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                  Speak with the advisory team.
                </h3>

                <div className="space-y-2 text-sm sm:text-base font-semibold text-emerald-200 pt-1">
                  <a href="tel:9575059137" className="flex items-center gap-2.5 hover:text-[#f3c251] transition-colors">
                    <FiPhone className="text-xs text-[#f3c251]" />
                    <span>+91 95750 59137</span>
                  </a>
                  <a href="tel:9575959137" className="flex items-center gap-2.5 hover:text-[#f3c251] transition-colors">
                    <FiPhone className="text-xs text-[#f3c251]" />
                    <span>+91 95759 59137</span>
                  </a>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full py-4 bg-[#f3c251] hover:bg-[#e4b443] text-[#052516] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>REQUEST A CALL BACK</span>
                    <FiArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200/90 space-y-3">
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-slate-400 block">
                  SERVICE NOTICE
                </span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  BSP Continental Pvt Ltd provides independent pre-application consultation, revenue compliance verification, and bureau analysis. We do not provide credit guarantees or issue loans directly.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-[#217044]">
                  <FiCheckCircle />
                  <span>Bilaspur (C.G.) Registered Advisory</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── PART 4: BOTTOM CLARITY CTA BANNER ─── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClarityCtaBanner />
      </section>

    </div>
  );
}