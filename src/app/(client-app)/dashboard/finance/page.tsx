'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Target, 
  Briefcase, 
  FileSpreadsheet, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "919575059137";

const financeServices = [
  {
    id: "project-finance-assistance",
    title: "Project Finance Assistance",
    subtitle: "Pre-Approval & Loan Readiness",
    icon: Target,
    directHref: "/dashboard/loan-solution",
    points: [
      "File Health & CIBIL Pre-Audit",
      "Gap & Rejection Risk Elimination",
      "Banking Ratio Optimization (FOIR/DSCR)"
    ]
  },
  {
    id: "msme-business-finance",
    title: "MSME & Business Finance",
    subtitle: "Secured Working Capital & Term Loans",
    icon: Briefcase,
    waMessage: "Hello BSP CCONTINENTAL PVT LTD, I would like to make an inquiry regarding MSME & Business Finance.",
    points: [
      "CC / OD / Trade Credit Limits",
      "Business Expansion Advisory",
      "Lender Rate Negotiation"
    ]
  },
  {
    id: "project-finance",
    title: "Project Finance (DPR & CMA)",
    subtitle: "Industrial & Plant Funding",
    icon: FileSpreadsheet,
    waMessage: "Hello BSP CCONTINENTAL PVT LTD, I would like to make an inquiry regarding Project Finance (DPR & CMA Report).",
    points: [
      "Detailed Project Report (DPR) Preparation",
      "CMA Data & Cashflow Financials",
      "Equipment & Plant Machinery Loans"
    ]
  },
  {
    id: "mortgage-loan",
    title: "Mortgage Loan (LAP)",
    subtitle: "Asset Backed Property Funding",
    icon: Building,
    waMessage: "Hello BSP CCONTINENTAL PVT LTD, I would like to make an inquiry regarding Mortgage Loans (LAP).",
    points: [
      "Loan Against Commercial / Residential Property",
      "High LTV Processing Support",
      "Title Check & Fast Disbursement"
    ]
  }
];

function TileLink({ href, external, children }: { href: string; external: boolean; children: ReactNode }) {
  const className = "group block h-full rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function FinancePage() {
  return (
    <div className="w-full min-h-screen bg-[#FAFBFD] text-slate-900 antialiased pb-12 px-4 sm:px-6 md:px-8 font-sans select-none transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* ─── 1. TOP HERO BANNER (MATCHES DASHBOARD SLIDER RATIO) ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-[#062415] text-white shadow-xl h-[340px] sm:h-[260px] md:aspect-[980/260] md:h-auto flex flex-col justify-end">
          <Image
            src="/images/Strategic Financial Guidance for Indian Businesses.png"
            alt="Financial Consultancy"
            fill
            priority
            className="object-cover object-[80%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/85 via-50% to-black/35 sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/90 sm:via-55% sm:to-transparent" />

          <div className="relative z-10 p-5 sm:p-8 md:p-10 space-y-2 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#f3c251]" />
              <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
                FINANCIAL ADVISORY & INSTITUTIONAL DEBT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
              FINANCIAL CLARITY. STRONGER DECISIONS.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 font-normal leading-relaxed max-w-lg">
              DPR formulation, CMA structuring, high-ticket working capital limits, and balance sheet gap elimination.
            </p>
          </div>
        </section>

        {/* ─── 2. CORE FINANCIAL MODULES (BORDER-FREE OPEN LUXURY TILES) ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#217044]" />
              Core Financial Modules
            </span>
            <span className="text-[11px] font-mono text-slate-400">Select any module to proceed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financeServices.map((service) => {
              const IconComp = service.icon;
              const isDirectLink = Boolean(service.directHref);
              const targetHref = isDirectLink 
                ? (service.directHref ?? "#")
                : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.waMessage ?? "")}`;

              return (
                <TileLink key={service.id} href={targetHref} external={!isDirectLink}>
                  <Card className="h-full justify-between p-6 transition-all duration-200 group-hover:shadow-md active:scale-[0.99]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-emerald-50 text-[#217044] rounded-2xl group-hover:bg-[#217044] group-hover:text-white transition-all">
                          <IconComp size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#217044] bg-emerald-50 px-3 py-1 rounded-full">
                          {isDirectLink ? "Direct Application" : "WhatsApp Inquiry"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-[#052516] uppercase tracking-tight group-hover:text-[#217044] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs font-bold text-[#217044] mt-0.5">
                          {service.subtitle}
                        </p>
                      </div>

                      <ul className="space-y-2 pt-2">
                        {service.points.map((pt) => (
                          <li key={pt} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-[#217044] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 flex items-center justify-between text-xs font-black text-[#217044]">
                      <span>{isDirectLink ? "Apply & Start Readiness" : "Inquire On WhatsApp"}</span>
                      <div className="p-1.5 rounded-xl bg-emerald-50 group-hover:bg-[#217044] group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Card>
                </TileLink>
              );
            })}
          </div>
        </section>

        {/* ─── 3. SIGNATURE BOTTOM CLARITY CTA BANNER (CALL DESK REMOVED) ─── */}
        <section className="relative overflow-hidden bg-[#052516] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f3c251]">
              NEED ASSISTANCE?
            </span>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
              Start With Clarity.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-normal max-w-xl">
              Connect with our Bilaspur consulting team for title checks, pre-underwriting dossiers, and institutional debt consulting.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <Link href="/dashboard/contact" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "uppercase tracking-wider")}>
              Contact Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}