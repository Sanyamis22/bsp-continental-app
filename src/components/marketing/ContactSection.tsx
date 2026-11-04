"use client";

import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    serviceRequired: "",
    cityDistrict: "",
    preferredContact: "",
    message: "",
    agreeToContact: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <section id="contact" className="py-10 sm:py-14 bg-[#F8FAFC] text-slate-900 select-none antialiased border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Main Container */}
        <div className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12">
          
          {/* ─── LEFT COLUMN: Dark Green Advisory Desk ─── */}
          <div className="lg:col-span-5 bg-[#052516] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3c251] block">
                CONTACT BSP CCONTINENTAL
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black uppercase tracking-tight text-white leading-[1.08]">
                TALK TO THE <br />
                RIGHT TEAM.
              </h2>

              <p className="text-xs sm:text-[13px] text-emerald-100/75 font-medium max-w-sm leading-relaxed">
                Share your requirement and receive a clear next step from our advisory team.
              </p>
            </div>

            {/* Compact Action Cards */}
            <div className="space-y-3 pt-2">
              {/* Call Action Card */}
              <a
                href="tel:9575059137"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
              >
                <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                  <FiArrowRight />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                    CALL THE ADVISORY DESK
                  </span>
                  <p className="text-xs text-emerald-200/90 font-semibold">
                    +91 95750 59137
                  </p>
                </div>
              </a>

              {/* Email Action Card */}
              <a
                href="mailto:bspccontinental@gmail.com"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e3b25] hover:bg-[#134d31] transition-all duration-200 group border border-emerald-800/40"
              >
                <div className="w-8 h-8 rounded-full bg-[#f3c251] text-[#052516] flex items-center justify-center shrink-0 text-sm font-bold group-hover:scale-105 transition-transform">
                  <FiArrowRight />
                </div>
                <div className="space-y-0.5 truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                    EMAIL YOUR REQUIREMENT
                  </span>
                  <p className="text-xs text-emerald-200/90 font-semibold truncate">
                    bspccontinental@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Compact Consultation Form ─── */}
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
                    <option value="financial-consulting">Financial Consulting</option>
                    <option value="loan-readiness">Loan Readiness Assessment</option>
                    <option value="cibil-management">CIBIL Score Management</option>
                    <option value="property-compliance">Property Compliance & Title Search</option>
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

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0A3D24] hover:bg-[#052516] text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    SUBMIT REQUIREMENT
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-slate-400 font-medium">
                  Do not request PAN, Aadhaar, bank statements or credit reports in this public form.
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}