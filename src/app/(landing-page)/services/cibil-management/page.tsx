"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  FiTrendingUp, 
  FiArrowRight, 
  FiX, 
  FiLock,
  FiUser,
  FiPhone,
  FiMail,
  FiSend,
  FiCheck
} from "react-icons/fi";
import { errorMessage } from "@/types/api";
import { useCreateOrder, useSubmitInquiry, useVerifyPayment } from "@/hooks/queries";
import InquiryDialog from "@/components/landing-page/InquiryDialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cibilServices = [
  {
    id: "cibil-analysis",
    title: "CIBIL Score Analysis",
    desc: "Line-by-line audit across bureaus to diagnose repayment history, credit utilization, and negative remarks."
  },
  {
    id: "cibil-improvement",
    title: "CIBIL Score Improvement",
    desc: "Structured debt restructuring and score rebuilding strategy to restore institutional credit eligibility."
  },
  {
    id: "errors-disputes",
    title: "CIBIL Errors & Disputes Handling",
    desc: "Formal reporting dispute support for clerical mismatches, fake accounts, duplicate entries, and pending NOC closures."
  }
];

export default function CibilManagementPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const submitInquiry = useSubmitInquiry();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    phone: "",
    email: session?.user?.email || "",
    service: "CIBIL Score Management",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 100) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
      const existing = document.getElementById("rzp-sdk-loader");
      if (existing) return resolve(true);
      const s = document.createElement("script");
      s.id = "rzp-sdk-loader";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  const handleOpenConsultation = () => {
    if (!isLoggedIn) {
      alert("Please login first to submit credit diagnostic request.");
      router.push("/login?callbackUrl=/services/cibil-management");
      return;
    }
    setIsModalOpen(true);
  };

  const handleInquiryAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const inqData = await submitInquiry.mutateAsync({
        ...formData,
        service: "CIBIL Score Management",
      });

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay gateway failed to load. Please check your connection.");
      }

      const orderData = await createOrder.mutateAsync({
        serviceType: "CIBIL Score Management",
        inquiryId: inqData.inquiryId,
      });
      if (!orderData.order_id || !orderData.key_id) {
        throw new Error("Order creation failed.");
      }

      const options = {
        key: orderData.key_id as string,
        amount: orderData.amount as number,
        currency: (orderData.currency as string) || "INR",
        name: "BSP CCONTINENTAL PVT LTD",
        description: "CIBIL Score Diagnostic Consultation",
        order_id: orderData.order_id as string,
        prefill: {
          name: formData.name || session?.user?.name || "Client",
          email: formData.email || session?.user?.email || "client@example.com",
          contact: formData.phone || "9575059137",
        },
        theme: { color: "#217044" },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            setStatusMessage("Verifying transaction...");
            await verifyPayment.mutateAsync({
              ...response,
              inquiryId: inqData.inquiryId,
            });
            setIsModalOpen(false);
            router.push("/dashboard/credit-score-management");
          } catch (err) {
            setStatusMessage("Payment verification failed. Please contact our desk.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatusMessage("Payment session cancelled.");
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

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
            src="/images/Structured credit planning with expert guidance.png"
            alt="CIBIL Score Management"
            fill
            priority
            className="object-cover object-right"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#051f12] via-[#051f12]/95 via-45% to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#f3c251]" />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              BUREAU DIAGNOSTICS & RESTORATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            CIBIL SCORE MANAGEMENT
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/85 font-normal max-w-xl leading-relaxed">
            Multi-bureau CIBIL analysis, clerical error rectification, and structured financial guidance to restore institutional borrowing readiness.
          </p>
        </div>
      </section>

      {/* ─── 2. DETAILED SPECIFICATION BREAKDOWN ─── */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        
        {/* Overview Article with Full Size Un-cropped Image */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b border-slate-200 pb-12">
          
          <div className="lg:col-span-6 order-1 lg:order-2 w-full rounded-3xl overflow-hidden shadow-xl border border-emerald-950/10 bg-slate-50 flex items-center justify-center">
            <Image 
              src="/images/ser2.png" 
              alt="CIBIL Score Management Overview" 
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
                A low credit score or negative remarks can lead to loan rejections across banks and financial institutions. We perform comprehensive bureau audits and dispute filings to ensure your credit report is accurate and lender-ready.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheck className="text-[#217044] shrink-0" size={16} />
                <span>Bureau Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheck className="text-[#217044] shrink-0" size={16} />
                <span>Error Rectification</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheck className="text-[#217044] shrink-0" size={16} />
                <span>Dispute Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheck className="text-[#217044] shrink-0" size={16} />
                <span>Loan Readiness</span>
              </div>
            </div>
          </div>

        </article>

        {/* Services Include Grid */}
        <article className="space-y-5 border-b border-slate-200 pb-12">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            SERVICES INCLUDE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cibilServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 text-[#217044] rounded-xl w-fit">
                    <FiTrendingUp size={22} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* PROCEED BOX */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4 max-w-xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase text-[#052516]">
              Ready to Improve Your CIBIL Score?
            </h3>
            <p className="text-xs text-slate-500">
              Submit your credit diagnostic inquiry to start expert bureau evaluation.
            </p>
          </div>

          <Button type="button" size="lg" onClick={handleOpenConsultation} className="w-full uppercase tracking-wider">
            <span>PROCEED FOR CONSULTATION</span>
            <FiArrowRight size={16} />
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <FiLock className="text-xs text-[#217044]" />
            <span>Encrypted institutional bureau audit advisory</span>
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
            <Link className={cn(buttonVariants({ variant: "accent", size: "lg" }), "uppercase tracking-wider text-center")} href="/contact">
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
        title="Credit Profile Diagnostics Form"
        nameLabel="Full Name (As per PAN)"
        messageLabel="Brief of Credit Issue / Discrepancy"
        messagePlaceholder="Mention ongoing disputes, closed loan NOC pending or overdue marks..."
        values={formData}
        onChange={handleChange}
        onSubmit={handleInquiryAndPay}
        loading={loading}
        statusMessage={statusMessage}
        loadingLabel="PROCESSING..."
        submitLabel={"SUBMIT & PROCEED TO PAY"}
      />

    </main>
  );
}