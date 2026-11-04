'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiShield, 
  FiUpload, 
  FiCheckCircle, 
  FiFileText, 
  FiCreditCard, 
  FiCheck,
  FiLock,
  FiLogIn,
  FiX,
  FiPaperclip
} from 'react-icons/fi';
import { errorMessage } from "@/types/api";

const CORE_SERVICES = [
  "CIBIL Report Audit & Analysis",
  "Credit Score Restoration",
  "CRIF & Experian Dispute Filing",
  "Loan Rejection Resolution"
];

export default function CreditScoreManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setForm] = useState({
    fullName: session?.user?.name || '',
    phone: '',
    panNumber: '',
    dob: '',
    customMessage: '',
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panCardFile, setPanCardFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleServiceToggle = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((item) => item !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileToS3 = async (file: File | null, label: string) => {
    if (!file) return null;
    const uploadPayload = new FormData();
    uploadPayload.append('file', file);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: uploadPayload,
    });

    const result = await uploadRes.json();
    if (uploadRes.ok && result.success) {
      return {
        name: `${label} - ${file.name}`,
        url: result.fileUrl || result.url,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        docType: label,
      };
    } else {
      throw new Error(`${label} upload failed.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      alert('Please login to submit your request!');
      router.push('/login');
      return;
    }

    if (selectedServices.length === 0) {
      alert('Please select at least one advisory service!');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const uploadedDocs = await Promise.all([
        uploadFileToS3(aadhaarFront, 'Aadhaar Card Front'),
        uploadFileToS3(aadhaarBack, 'Aadhaar Card Back'),
        uploadFileToS3(panCardFile, 'PAN Card Front'),
      ]);

      const validDocs = uploadedDocs.filter(Boolean);

      const payload = {
        userName: formData.fullName || session?.user?.name || 'Verified Applicant',
        userEmail: session?.user?.email,
        userPhone: formData.phone,
        serviceType: 'CIBIL Audit',
        details: {
          panNumber: formData.panNumber,
          dateOfBirth: formData.dob,
          selectedServices: selectedServices,
          customMessage: formData.customMessage,
        },
        documentsList: validDocs,
        status: 'Pending',
      };

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessMsg('Your Credit Score Application has been successfully submitted! Redirecting...');
        setTimeout(() => router.push('/dashboard/my-requests'), 2000);
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Submission error: ' + errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── UNAUTHENTICATED VIEW ───
  if (status === 'unauthenticated') {
    return (
      <div className="w-full min-h-screen bg-[#FAFBFD] text-slate-900 antialiased pb-12 px-4 sm:px-6 md:px-8 font-sans select-none transition-all duration-300">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          
          <div className="relative overflow-hidden rounded-3xl bg-[#062415] text-white p-6 sm:p-10 shadow-lg min-h-[220px] flex flex-col justify-end">
            <Image
              src="/images/Structured credit planning with expert guidance.png"
              alt="CIBIL Score Management"
              fill
              priority
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062415] via-[#062415]/85 to-transparent" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#f3c251]" />
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251]">
                  CIBIL & BUREAU RESOLUTION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Credit Score Management Desk
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed font-normal">
                Fix credit report errors, resolve CIBIL disputes, and systematically rebuild your loan approval eligibility.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-[#217044] rounded-2xl flex items-center justify-center mx-auto">
              <FiLock size={24} />
            </div>
            
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                Login Required to Request Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                To submit identity documents and initiate bureau audit checks, please sign in to your applicant portal.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link 
                href="/login?callbackUrl=/dashboard/credit-score-management" 
                className="bg-[#217044] hover:bg-[#185332] text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <FiLogIn size={15} />
                <span>Login to Request Service</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED VIEW ───
  return (
    <div className="w-full min-h-screen bg-[#FAFBFD] text-slate-900 antialiased pb-12 px-4 sm:px-6 md:px-8 font-sans select-none transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* TOP HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-[#062415] text-white shadow-xl h-[340px] sm:h-[260px] md:aspect-[980/260] md:h-auto flex flex-col justify-end">
          <Image
            src="/images/Structured credit planning with expert guidance.png"
            alt="Credit Score Management"
            fill
            priority
            className="object-cover object-[80%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/85 via-50% to-black/35 sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/90 sm:via-55% sm:to-transparent" />

          <div className="relative z-10 p-5 sm:p-8 md:p-10 space-y-2 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#f3c251]" />
              <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
                BUREAU DISPUTE & HEALTH RESTORATION
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
              IMPROVE YOUR CREDIT PROFILE WITH A CLEAR PLAN.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 font-normal leading-relaxed max-w-lg">
              Fix bureau record discrepancies, correct CIBIL/Experian overdue flags, and prepare your file for institutional credit.
            </p>
          </div>
        </section>

        {/* CATEGORY TILES */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Select Advisory Modules
            </span>
            <span className="text-[11px] font-mono font-bold text-[#217044]">
              {selectedServices.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CORE_SERVICES.map((serviceName, idx) => {
              const isSelected = selectedServices.includes(serviceName);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleServiceToggle(serviceName)}
                  className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[90px] shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#217044] text-white'
                      : 'bg-white text-slate-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold opacity-60">
                      MODULE 0{idx + 1}
                    </span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-white text-[#217044]' : 'bg-slate-100 text-transparent'
                    }`}>
                      <FiCheck size={10} strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight leading-snug">
                    {serviceName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FORM & UPLOAD */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
              <FiShield className="text-[#217044]" size={22} />
              Application & Identity Details
            </h2>
            <p className="text-xs text-slate-500">
              Please provide precise identity records to initiate bureaucratic verification.
            </p>
          </div>

          {successMsg ? (
            <div className="bg-emerald-50 p-6 rounded-2xl text-center space-y-2">
              <FiCheckCircle className="w-10 h-10 text-[#217044] mx-auto" />
              <h3 className="text-xs font-black text-[#217044] uppercase">{successMsg}</h3>
              <p className="text-xs text-slate-500 font-medium">Redirecting to your requests ledger...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Personal Details */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#217044] block">
                  1. Applicant Particulars
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Legal Name (as per documents)</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Legal Name"
                      className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Mobile Contact</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 95759 59137"
                      className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 font-mono transition-all shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500">PAN Card Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      required
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={(e) => setForm({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 uppercase outline-none focus:bg-emerald-50/40 font-mono transition-all shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Upload Row (Optional) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[#217044] block">
                    2. Identity Proofs (Optional)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">PDF, PNG, JPG accepted</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Aadhaar Front */}
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] hover:bg-emerald-50/30 transition-all flex flex-col justify-between shadow-2xs space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FiFileText className="text-[#217044]" size={18} />
                        <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">OPTIONAL</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">Aadhaar Card (Front)</h4>
                      <p className="text-[10px] text-slate-500 font-normal leading-relaxed">Official Government Issued Front Copy</p>
                    </div>

                    <label className="cursor-pointer bg-white hover:bg-[#217044] hover:text-white text-[#217044] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs text-center">
                      <FiUpload size={13} />
                      <span className="truncate">{aadhaarFront ? "Change File" : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => setAadhaarFront(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {aadhaarFront && (
                      <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs">
                        <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                          <FiPaperclip className="text-[#217044] shrink-0" size={12} />
                          <span className="truncate text-[10px]">{aadhaarFront.name}</span>
                        </div>
                        <button type="button" onClick={() => setAadhaarFront(null)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer">
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Aadhaar Back */}
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] hover:bg-emerald-50/30 transition-all flex flex-col justify-between shadow-2xs space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FiFileText className="text-[#217044]" size={18} />
                        <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">OPTIONAL</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">Aadhaar Card (Back)</h4>
                      <p className="text-[10px] text-slate-500 font-normal leading-relaxed">Address Record Reverse Side</p>
                    </div>

                    <label className="cursor-pointer bg-white hover:bg-[#217044] hover:text-white text-[#217044] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs text-center">
                      <FiUpload size={13} />
                      <span className="truncate">{aadhaarBack ? "Change File" : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => setAadhaarBack(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {aadhaarBack && (
                      <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs">
                        <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                          <FiPaperclip className="text-[#217044] shrink-0" size={12} />
                          <span className="truncate text-[10px]">{aadhaarBack.name}</span>
                        </div>
                        <button type="button" onClick={() => setAadhaarBack(null)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer">
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PAN Card Front */}
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] hover:bg-emerald-50/30 transition-all flex flex-col justify-between shadow-2xs space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FiCreditCard className="text-[#217044]" size={18} />
                        <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">OPTIONAL</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">PAN Card</h4>
                      <p className="text-[10px] text-slate-500 font-normal leading-relaxed">Tax Document Identity Face</p>
                    </div>

                    <label className="cursor-pointer bg-white hover:bg-[#217044] hover:text-white text-[#217044] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs text-center">
                      <FiUpload size={13} />
                      <span className="truncate">{panCardFile ? "Change File" : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => setPanCardFile(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {panCardFile && (
                      <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs">
                        <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                          <FiPaperclip className="text-[#217044] shrink-0" size={12} />
                          <span className="truncate text-[10px]">{panCardFile.name}</span>
                        </div>
                        <button type="button" onClick={() => setPanCardFile(null)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer">
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Step 3: Remarks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500">Remarks / Past Rejection Details (Optional)</label>
                <textarea
                  name="customMessage"
                  rows={3}
                  value={formData.customMessage}
                  onChange={handleChange}
                  placeholder="Briefly describe loan rejections or credit score concerns..."
                  className="w-full bg-[#FAFBFD] rounded-2xl p-4 text-xs font-medium text-slate-900 outline-none focus:bg-emerald-50/40 resize-none transition-all shadow-2xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#217044] hover:bg-[#185332] text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading Documents & Submitting...' : <><FiUpload size={16} /> Submit Credit Application</>}
              </button>

            </form>
          )}

        </section>

        {/* BOTTOM CLARITY CTA BANNER */}
        <section className="relative overflow-hidden bg-[#052516] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f3c251]">
              HAVE QUESTIONS ABOUT YOUR SCORE?
            </span>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
              Consult Our Bureau Advisory Desk
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-normal max-w-xl">
              Assistance available Monday to Saturday (10:00 AM – 7:00 PM). Connect with our Bilaspur consulting team.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#f3c251] hover:bg-[#e4b443] text-[#052516] font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              Contact Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}