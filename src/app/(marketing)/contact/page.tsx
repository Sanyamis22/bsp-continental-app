"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { errorMessage as toErrorMessage } from "@/types/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    serviceRequired: "",
    cityDistrict: "",
    preferredContact: "",
    message: "",
    agreeToContact: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit contact request.");
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        serviceRequired: "",
        cityDistrict: "",
        preferredContact: "",
        message: "",
        agreeToContact: false,
      });
    } catch (err) {
      setErrorMessage(toErrorMessage(err) || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 select-none antialiased">
      
      {/* ─── 1. CONTACT PAGE HEADER ─── */}
      <section className="pt-28 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase">
            <Link href="/" className="hover:text-slate-900 transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[#052516] font-bold">CONTACT</span>
          </div>

          <span className="text-xs font-mono font-black uppercase tracking-[0.24em] text-[#f3c251] block">
            BSP CONTINENTAL DESK
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#0F1E11] leading-[1.06]">
            START THE CONVERSATION.
          </h1>

          <p className="text-sm sm:text-base text-slate-500 font-medium tracking-wide max-w-2xl">
            Get in touch with our Bilaspur advisory team for loan-readiness evaluation, CIBIL management, and property compliance vetting.
          </p>
        </div>
      </section>

      {/* ─── 2. MAIN BENTO CONTACT FORM SECTION ─── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 bg-white">
            
            {/* ─── LEFT COLUMN: Dark Green Advisory Desk ─── */}
            <div className="lg:col-span-5 bg-[#052516] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
                  CONTACT BSP CONTINENTAL
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black uppercase tracking-tight text-white leading-[1.08]">
                  TALK TO THE <br />
                  RIGHT TEAM.
                </h2>

                <p className="text-xs sm:text-[13px] text-emerald-100/75 font-medium max-w-sm leading-relaxed">
                  Share your requirement and receive a clear, actionable next step directly from our corporate advisory consultants.
                </p>
              </div>

              {/* Action Cards */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:9575059137"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                    <FiPhone />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                      PRIMARY ADVISORY DESK
                    </span>
                    <p className="text-xs text-emerald-200/90 font-semibold font-mono">
                      +91 95750 59137
                    </p>
                  </div>
                </a>

                <a
                  href="tel:9575959137"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                    <FiPhone />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                      ALTERNATIVE LINE
                    </span>
                    <p className="text-xs text-emerald-200/90 font-semibold font-mono">
                      +91 95759 59137
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:bspccontinental@gmail.com"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                    <FiMail />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                      OFFICIAL INQUIRY EMAIL
                    </span>
                    <p className="text-xs text-emerald-200/90 font-semibold truncate">
                      bspccontinental@gmail.com
                    </p>
                  </div>
                </a>
              </div>

              {/* Registered Office Details */}
              <div className="pt-4 border-t border-emerald-900/60 space-y-2">
                <div className="flex items-start gap-2.5 text-xs text-emerald-100/70">
                  <FiMapPin className="text-[#f3c251] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Shop No OAS 4, Super Market Complex, 2nd Floor, Agrasen Chowk, Bilaspur (C.G.) 495001
                  </span>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Structured Consultation Form ─── */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="max-w-xl w-full mx-auto space-y-4">
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F1E11]">
                    Request a consultation
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Fields marked * are required.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 bg-[#052516] text-[#f3c251] rounded-full flex items-center justify-center mx-auto text-xl">
                      <FiCheckCircle />
                    </div>
                    <h4 className="text-base font-black text-[#0F1E11] uppercase tracking-tight">
                      Consultation Request Received
                    </h4>
                    <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting BSP Continental. Our advisory team will review your requirement and reach out via your preferred channel.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-[#052516] underline pt-2 cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* Row 1: Full Name & Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                          FULL NAME *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="Enter your name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#052516] transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                          MOBILE NUMBER *
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          required
                          placeholder="Enter 10-digit number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#052516] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2: Service Required */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                        SERVICE REQUIRED *
                      </label>
                      <select
                        name="serviceRequired"
                        required
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#052516] transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select a service</option>
                        <option value="Financial Consulting">Financial Consulting</option>
                        <option value="CIBIL Score Management">CIBIL Score Management</option>
                        <option value="Property Compliance">Property Compliance &amp; Title Search</option>
                      </select>
                    </div>

                    {/* Row 3: City & Preferred Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                          CITY / DISTRICT *
                        </label>
                        <input
                          type="text"
                          name="cityDistrict"
                          required
                          placeholder="Your location"
                          value={formData.cityDistrict}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#052516] transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                          PREFERRED CONTACT
                        </label>
                        <select
                          name="preferredContact"
                          value={formData.preferredContact}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#052516] transition-colors cursor-pointer"
                        >
                          <option value="">Call or WhatsApp</option>
                          <option value="call">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                        MESSAGE
                      </label>
                      <textarea
                        name="message"
                        rows={2}
                        placeholder="Briefly describe your requirement"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#052516] transition-colors resize-none"
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <input
                        type="checkbox"
                        id="agreeToContact"
                        name="agreeToContact"
                        required
                        checked={formData.agreeToContact}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#052516] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="agreeToContact" className="text-[11px] font-medium text-slate-600 cursor-pointer select-none">
                        I agree to be contacted regarding this inquiry.
                      </label>
                    </div>

                    {/* Error Alert */}
                    {errorMessage && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-semibold">
                        <FiAlertCircle className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#0A3D24] hover:bg-[#052516] text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? "SUBMITTING..." : "SUBMIT REQUIREMENT"}
                      </button>
                    </div>

                    {/* Privacy Disclaimer */}
                    <p className="text-[10px] text-slate-400 font-medium">
                      Do not submit sensitive identification numbers, banking credentials, or proprietary credit reports through this public form.
                    </p>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. OFFICE TIMINGS & CONSULTING POLICY MICRO-CARDS ─── */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
              <FiClock className="text-[#f3c251] text-base" />
              <span>Desk Operating Hours</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Monday to Saturday: 10:00 AM – 7:00 PM <br />
              Sunday: Closed / Prior Appointment Only
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
              <FiCheckCircle className="text-[#217044] text-base" />
              <span>Pre-Application Advisory</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Dedicated file readiness screening and title vetting before initiating formal bank documentation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
              <FaWhatsapp className="text-[#25D366] text-base" />
              <span>Instant WhatsApp Channel</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Prefer messaging? Connect directly on WhatsApp at <span className="font-bold text-slate-800 font-mono">+91 95750 59137</span>.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}