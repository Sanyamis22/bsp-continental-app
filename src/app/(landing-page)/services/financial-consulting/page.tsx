"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  FiArrowRight, 
  FiLock,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiPieChart,
  FiBriefcase,
  FiDollarSign
} from "react-icons/fi";
import { errorMessage } from "@/types/api";
import { formatInr, useServicePrices } from "@/hooks/useServicePrices";
import InquiryDialog from "@/components/landing-page/InquiryDialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const servicesInclude = [
  "Loan Eligibility Assessment",
  "Debt Consolidation",
  "Loan Restructuring",
  "Financial Profile Review",
  "Income Analysis",
  "Documentation Preparation",
  "CMA DATA Preparation",
  "Project Report Preparation",
  "Bank Guarantee",
  "Bank Solvency",
  "Govt Subsidy Guidance",
  "Interest Rate Negotiation",
  "End-to-End Loan Processing",
];

const benefits = [
  "Higher Loan Approval Chances",
  "Reduced EMI Burden",
  "Better Financial Planning",
  "Strong Loan Profile",
  "Higher Loan Approval Rate",
  "Better Interest Rates",
  "Faster Processing",
  "Professional Financial Guidance",
];

const modulesList = [
  {
    title: "Secured Business Loan Assistance",
    desc: "Institutional capital structuring, working capital facilities, balance sheet diagnostics, and lender compliance.",
    icon: <FiDollarSign size={20} />
  },
  {
    title: "Mortgage Loan Assistance",
    desc: "Pre-underwriting documentation checks, collateral property vetting, and structured Loan Against Property (LAP).",
    icon: <FiBriefcase size={20} />
  },
  {
    title: "Project Finance & CMA Preparation",
    desc: "DPR formulation, multi-year projected CMA data formulation, subsidy assessment, and bank committee alignment.",
    icon: <FiPieChart size={20} />
  }
];

export default function FinancialConsultingPage() {
  const prices = useServicePrices();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    phone: "",
    email: session?.user?.email || "",
    service: "Financial Consultancy",
    message: ""
  });

  // 💳 Load Razorpay script dynamically on client side
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 100) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenConsultation = () => {
    if (!isLoggedIn) {
      alert("Please login first to submit financial consulting request.");
      router.push("/login?callbackUrl=/services/financial-consulting");
      return;
    }
    setIsModalOpen(true);
  };

  // 💳 Real Razorpay Payment Trigger & Form Submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      // 1. Call backend inquiry endpoint to create database record and generate Razorpay Order
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service: "Financial Consultancy",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize inquiry payment order.");
      }

      // 2. Create the Razorpay order server-side (amount comes from the stored inquiry)
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: data.inquiryId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id || !orderData.key_id) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      // 3. Open Real Razorpay Payment Gateway Popup
      if (typeof window !== "undefined" && window.Razorpay) {
        const options: RazorpayOptions = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "BSP Continental Pvt Ltd",
          description: "Financial Consultancy Advisory Fee",
          order_id: orderData.order_id,
          handler: async function (response: RazorpaySuccessResponse) {
            try {
              await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  inquiryId: data.inquiryId
                }),
              });
            } catch (err) {
              console.error("Verification notice:", err);
            }

            // Success -> Redirect to /dashboard/finance
            setIsModalOpen(false);
            setLoading(false);
            router.push("/dashboard/finance");
            router.refresh();
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#217044",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      } else {
        throw new Error("Razorpay SDK failed to load. Check your internet connection.");
      }

    } catch (err) {
      setLoading(false);
      setStatusMessage(errorMessage(err) || "Something went wrong.");
    }
  };

  return (
    <main className="w-full bg-[#FAFBFD] text-slate-900 select-none antialiased pt-0 m-0">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <section className="relative w-full bg-[#052516] text-white pt-28 pb-16 sm:pt-32 sm:pb-20 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-35">
          <Image
            src="/images/Strategic Financial Guidance for Indian Businesses.png"
            alt="Financial Consultancy"
            fill
            priority
            className="object-cover object-right"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#051f12] via-[#051f12]/95 via-45% to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#f3c251]" />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              FINANCIAL CONSULTANCY
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            PREPARE BEFORE YOU APPLY.
          </h1>

          <p className="text-xs sm:text-base text-emerald-100/90 font-normal max-w-2xl leading-relaxed">
            We assist business owners in obtaining secured financing from Banks, NBFCs, and Financial Institutions. Our experts analyse financial profiles and recommend the most suitable lending options with competitive terms.
          </p>

          <div className="pt-2">
            <Button type="button" size="lg" variant="accent" onClick={handleOpenConsultation} className="uppercase tracking-wider">
              START CONSULTATION
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 2. DETAILED SPECIFICATION BREAKDOWN ─── */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        
        {/* Overview Section */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b border-slate-200 pb-12">
          
          <div className="lg:col-span-6 order-1 lg:order-2 w-full rounded-3xl overflow-hidden shadow-xl border border-emerald-950/10 bg-slate-50 flex items-center justify-center">
            <Image
              src="/images/ser3.png"
              alt="Strategic Financial Consulting Overview"
              width={1000}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
            <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
              OVERVIEW
            </span>
            <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              <p>
                We assist business owners to obtaining secured financing from Banks, NBFCs, and Financial Institutions. Our experts analyse the client&apos;s financial profile and recommend the most suitable lending options with competitive terms.
              </p>
              <p>
                Many loan applications fail due to poor financial planning. Our Financial Consulting and Loan Readiness Program prepares borrowers to become lender-ready by improving eligibility, restructuring liabilities, and strengthening financial documentation.
              </p>
            </div>
          </div>

        </article>

        {/* 3 Core Scope Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-slate-200 pb-12">
          {modulesList.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#217044] flex items-center justify-center">
                {m.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                {m.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Services Include */}
        <article className="space-y-5 border-b border-slate-200 pb-12">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            SERVICES INCLUDE
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {servicesInclude.map((serviceItem, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#217044] shrink-0" />
                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  {serviceItem}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* Benefits Section */}
        <article className="space-y-5 border-b border-slate-200 pb-12">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            BENEFITS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <FiCheckCircle className="text-[#217044] text-lg shrink-0" />
                <span className="text-sm font-bold text-slate-800">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* Bottom Consultation Action Box */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4 max-w-xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase text-[#052516]">
              Ready to Structure Your Financing?
            </h3>
            <p className="text-xs text-slate-500">
              Submit your financial details for expert review and preparation before approaching banking channels.
            </p>
          </div>

          <Button type="button" size="lg" onClick={handleOpenConsultation} className="w-full uppercase tracking-wider">
            <span>PROCEED FOR CONSULTATION</span>
            <FiArrowRight size={16} />
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <FiLock className="text-xs text-[#217044]" />
            <span>Encrypted institutional financial advisory consultation</span>
          </div>
        </div>

      </section>

      {/* ─── 3. CLARITY CTA BANNER ─── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 pb-20">
        <div className="relative w-full bg-[#052516] text-white py-12 px-8 sm:px-12 overflow-hidden rounded-3xl shadow-xl space-y-6 text-left">
          <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251] block">
            READY FOR THE NEXT STEP?
          </span>

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            START WITH CLARITY.
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/85 font-medium max-w-xl leading-relaxed">
            Discuss your institutional finance, loan-readiness audit or property compliance documentation with our Bilaspur consulting team.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }), "uppercase tracking-wider text-center")}
            >
              REQUEST A CONSULTATION
            </Link>
            <a
              href="tel:9575059137"
              className="px-7 py-3 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 text-center cursor-pointer"
            >
              CALL DESK NOW
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-medium text-emerald-200/70">
            <span className="font-bold uppercase text-white tracking-wider text-[11px]">
              BSP Continental Pvt Ltd
            </span>
            <span className="tracking-wide text-emerald-200/90 font-mono text-[11px] sm:text-xs">
              +91 95750 59137 | +91 95759 59137
            </span>
          </div>
        </div>
      </section>

      <InquiryDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Financial Advisory Details Form"
        nameLabel="Full Name"
        messageLabel="Financial Query / Loan Details"
        messagePlaceholder="Mention loan amount required, property collateral, or business details..."
        values={formData}
        onChange={handleChange}
        onSubmit={handleInquirySubmit}
        loading={loading}
        statusMessage={statusMessage}
        loadingLabel="INITIALIZING PAYMENT..."
        submitLabel={`SUBMIT & PAY ${prices?.["financial-consulting"] !== undefined ? formatInr(prices["financial-consulting"]) : "..."}`}
      />

    </main>
  );
}