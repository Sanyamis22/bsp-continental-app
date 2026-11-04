"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  FiFileText, 
  FiArrowRight, 
  FiX, 
  FiLock,
  FiUser,
  FiPhone,
  FiMail,
  FiLayers,
  FiSend,
  FiCheckCircle
} from "react-icons/fi";
import { errorMessage } from "@/types/api";

const originalSubServices = [
  {
    id: "title-verif",
    title: "Title Verification",
    desc: "Examination of ownership chain, registered conveyance deeds, and encumbrance checks."
  },
  {
    id: "owner_verif",
    title: "Ownership Verification",
    desc: "Verification of legal owners against state revenue records and registered deeds."
  },
  {
    id: "fake_owner_detect",
    title: "Fake Ownership Detection",
    desc: "Advanced scrutiny to identify fraudulent impersonations, forged documents, and disputed titles."
  },
  {
    id: "encumbrance_verif",
    title: "Encumbrance Verification",
    desc: "Checking sub-registrar records for active mortgages, liens, or legal dues on the property."
  },
  {
    id: "search_report",
    title: "Search Report Preparation",
    desc: "Comprehensive multi-year sub-registrar index search documentation."
  },
  {
    id: "survey_report",
    title: "Survey Report Preparation",
    desc: "Revenue map and physical land boundary cross-checking assistance."
  },
  {
    id: "risk_assessment",
    title: "Property Risk Assessment",
    desc: "Evaluating title soundness, zoning regulations, and prospective legal risks."
  }
];

export default function PropertyCompliancePage() {
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
    service: "Property Compliance",
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
      alert("Please login first to proceed with property compliance consultation.");
      router.push("/login?callbackUrl=/services/property-compliance");
      return;
    }
    setIsModalOpen(true);
  };

  const handleInquiryAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const inqRes = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service: "Property Compliance",
        }),
      });
      const inqData = await inqRes.json();
      if (!inqRes.ok || !inqData.success) {
        throw new Error(inqData.error || "Failed to submit inquiry details.");
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay gateway failed to load. Please check your connection.");
      }

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "Property Compliance",
          inquiryId: inqData.inquiryId
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id || !orderData.key_id) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "BSP CCONTINENTAL PVT LTD",
        description: "Property Compliance Consultation",
        order_id: orderData.order_id,
        prefill: {
          name: formData.name || session?.user?.name || "Client",
          email: formData.email || session?.user?.email || "client@example.com",
          contact: formData.phone || "9575059137",
        },
        theme: { color: "#217044" },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            setStatusMessage("Verifying transaction...");
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                inquiryId: inqData.inquiryId
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setIsModalOpen(false);
              router.push("/dashboard/property-compliance");
            } else {
              setStatusMessage("Payment verification failed. Please contact our desk.");
            }
          } catch (err) {
            setStatusMessage("Network error during verification.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatusMessage("Payment cancelled. You can retry when ready.");
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
      
      {/* ─── 1. TOP HERO BANNER ─── */}
      <section className="w-full bg-[#052516] text-white pt-28 pb-14 sm:pt-36 sm:pb-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#f3c251]" />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
              Secure Property Before Investment
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Property Compliance Services
          </h1>

          <p className="text-xs sm:text-base text-emerald-100/90 font-normal max-w-2xl leading-relaxed">
            Certified title scrutiny, legal vetting, sub-registrar search reports, and revenue record cross-examination.
          </p>
        </div>
      </section>

      {/* ─── OVERVIEW SECTION (FULL SIZE IMAGE & OVERVIEW DETAILS) ─── */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b border-slate-200 pb-12">
          
          <div className="lg:col-span-6 order-1 lg:order-2 w-full rounded-3xl overflow-hidden shadow-xl border border-emerald-950/10 bg-slate-50 flex items-center justify-center">
            <Image 
              src="/images/ser1.png" 
              alt="Property Compliance Overview" 
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
                Buying or mortgaging a property without proper verification can result in legal disputes and financial loss. We perform comprehensive legal and technical due diligence & proper analysis to ensure every property is genuine and compliant.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheckCircle className="text-[#217044] shrink-0" size={16} />
                <span>Safe Investment</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheckCircle className="text-[#217044] shrink-0" size={16} />
                <span>Legal Protection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheckCircle className="text-[#217044] shrink-0" size={16} />
                <span>Fraud Prevention</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FiCheckCircle className="text-[#217044] shrink-0" size={16} />
                <span>Complete Due Diligence</span>
              </div>
            </div>
          </div>

        </article>

        {/* ─── 2. SERVICES INCLUDE GRID ─── */}
        <article className="space-y-5 border-b border-slate-200 pb-12">
          <span className="text-xs font-mono font-black uppercase tracking-[0.22em] text-[#217044] block">
            SERVICES INCLUDE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {originalSubServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/90 flex items-start gap-4"
              >
                <div className="p-3 bg-emerald-50 text-[#217044] rounded-xl shrink-0 mt-0.5">
                  <FiFileText size={20} />
                </div>
                <div className="space-y-1">
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
              Ready to Secure Your Property?
            </h3>
            <p className="text-xs text-slate-500">
              Submit your property details and documents for verified legal due diligence.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenConsultation}
            className="w-full py-4 px-8 bg-[#217044] hover:bg-[#164e2e] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED FOR CONSULTATION</span>
            <FiArrowRight size={16} />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <FiLock className="text-xs text-[#217044]" />
            <span>Encrypted institutional advisory consultation</span>
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
            <Link className="px-7 py-3 bg-[#f3c251] hover:bg-[#e4b443] text-[#052516] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center cursor-pointer" href="/contact">
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

      {/* ─── 4. INQUIRY MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#217044] block">
                  CONSULTATION INQUIRY
                </span>
                <h3 className="text-lg font-black uppercase text-[#052516]">
                  Property Details Form
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleInquiryAndPay} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FiUser className="text-[#217044]" /> Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-emerald-50/40 transition-all ring-1 ring-slate-200 focus:ring-[#217044]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FiPhone className="text-[#217044]" /> Contact Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 95750 00000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-emerald-50/40 transition-all font-mono ring-1 ring-slate-200 focus:ring-[#217044]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FiMail className="text-[#217044]" /> Gmail Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="client@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-emerald-50/40 transition-all ring-1 ring-slate-200 focus:ring-[#217044]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FiLayers className="text-[#217044]" /> Selected Service
                </label>
                <input
                  type="text"
                  disabled
                  value="Property Compliance"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 text-xs sm:text-sm text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Property Location & Details (Max 100 Characters) *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    formData.message.length === 100 ? "text-rose-600" : "text-slate-400"
                  }`}>
                    {formData.message.length}/100
                  </span>
                </div>
                <textarea
                  name="message"
                  required
                  rows={2}
                  maxLength={100}
                  placeholder="Enter property address, Khasra no. or specific doubts..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#FAFBFD] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-emerald-50/40 transition-all resize-none ring-1 ring-slate-200 focus:ring-[#217044]"
                />
              </div>

              {statusMessage && (
                <p className="text-[11px] font-mono text-center text-amber-800 bg-amber-50 p-2 rounded-lg">
                  {statusMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#217044] hover:bg-[#164e2e] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <FiSend size={15} />
                <span>{loading ? "PROCESSING..." : "SUBMIT & PROCEED TO PAY"}</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <FiLock className="text-xs" /> Secure 256-bit encrypted Razorpay Checkout
              </p>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}