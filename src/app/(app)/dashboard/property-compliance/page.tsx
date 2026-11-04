'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiUpload, 
  FiX, 
  FiCheck, 
  FiShield, 
  FiAlertCircle, 
  FiLock, 
  FiLogIn,
  FiFile, 
  FiPaperclip
} from 'react-icons/fi';
import type { RequestDTO, RequestDocumentDTO } from "@/types/request";
import { errorMessage } from "@/types/api";

const SERVICES_LIST = [
  { id: "title_verif", name: "Title Verification" },
  { id: "owner_verif", name: "Ownership Verification" },
  { id: "fake_owner_detect", name: "Fake Ownership Detection" },
  { id: "encumbrance_verif", name: "Encumbrance Verification" },
  { id: "search_report", name: "Search Report Preparation" },
  { id: "survey_report", name: "Survey Report Preparation" },
  { id: "risk_assessment", name: "Property Risk Assessment" }
];

const REQUIRED_DOCUMENTS = [
  { id: "registry", label: "Registry / Sale Deed Copy", required: false, note: "Main property ownership document (Optional)" },
  { id: "khasra", label: "Khasra / Khatauni / B-1 Copy", required: false, note: "Revenue / land record paper (Optional)" },
  { id: "layout_map", label: "Layout Map / Site Plan / Agreement", required: false, note: "Plot layout or seller agreement (Optional)" }
];

export default function PropertyVettingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    ownerName: '',
    userPhone: '',
    propertyLocation: '',
    customMessage: ''
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<RequestDocumentDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, msg: '' });

  useEffect(() => {
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, ownerName: session?.user?.name ?? "" }));
    }
  }, [session]);

  const handleServiceToggle = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((item) => item !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleCategorizedFileUpload = (e: React.ChangeEvent<HTMLInputElement>, categoryLabel: string) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const mapped = files.map(file => ({
      category: categoryLabel,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      fileObject: file
    }));

    setSelectedFiles(prev => [...prev, ...mapped]);
    e.target.value = ''; 
  };

  const removeFileFromQueue = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVettingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      setSubmitStatus({
        success: false,
        msg: 'Please login to submit your request!'
      });
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (selectedServices.length === 0) {
      setSubmitStatus({
        success: false,
        msg: 'Please select at least one Property Compliance service!'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, msg: '' });

    const finalUploadedUrls = [];
    let uploadFailed = false;

    for (const fileItem of selectedFiles) {
      try {
        const uploadPayload = new FormData();
        uploadPayload.append('file', fileItem.fileObject as File);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadPayload
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || `Upload failed`);

        finalUploadedUrls.push({ 
          category: fileItem.category,
          name: result.name || fileItem.name, 
          url: result.fileUrl || result.url, 
          size: fileItem.size 
        });

      } catch (err) {
        uploadFailed = true;
        setIsSubmitting(false);
        setSubmitStatus({ success: false, msg: `Upload failed: ${errorMessage(err)}` });
        break;
      }
    }

    if (uploadFailed) return;

    try {
      const dbResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.ownerName || session.user.name || "Owner",
          userEmail: session.user.email,
          userPhone: formData.userPhone,
          serviceType: "Property Vetting",
          details: {
            ownerName: formData.ownerName,
            propertyLocation: formData.propertyLocation,
            selectedServices: selectedServices,
            customMessage: formData.customMessage
          },
          documentsList: finalUploadedUrls,
          status: "Pending"
        })
      });

      const dbResult = await dbResponse.json();
      if (!dbResponse.ok || !dbResult.success) throw new Error(dbResult.message || "DB transaction fault.");

      setIsSubmitting(false);
      setSubmitStatus({ success: true, msg: 'Property Compliance request submitted! Redirecting to your requests...' });

      setFormData({ ownerName: '', userPhone: '', propertyLocation: '', customMessage: '' });
      setSelectedFiles([]);
      setSelectedServices([]);

      // Redirecting to dashboard/my-requests as requested
      setTimeout(() => router.push('/dashboard/my-requests'), 1500);

    } catch (dbError) {
      setIsSubmitting(false);
      setSubmitStatus({ success: false, msg: `Database error: ${errorMessage(dbError)}` });
    }
  };

  // ─── UNAUTHENTICATED VIEW ───
  if (status === 'unauthenticated') {
    return (
      <div className="w-full min-h-screen bg-[#FAFBFD] text-slate-900 antialiased pb-12 px-4 sm:px-6 md:px-8 font-sans select-none transition-all duration-300">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          
          <div className="relative overflow-hidden rounded-3xl bg-[#062415] text-white p-6 sm:p-10 shadow-lg min-h-[220px] flex flex-col justify-end">
            <Image
              src="/images/Premiumproperty.png"
              alt="Property Compliance"
              fill
              priority
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062415] via-[#062415]/85 to-transparent" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#f3c251]" />
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#f3c251]">
                  LEGAL VETTING & LAND RECORDS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Property Compliance Desk
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed font-normal">
                Secure your property investments. Upload registry and Khasra records for certified title search and legal verification.
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
                To submit legal property deeds and track due-diligence reports, please sign in to your applicant portal.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link 
                href="/login?callbackUrl=/dashboard/property-compliance" 
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
            src="/images/Premiumproperty.png"
            alt="Property Compliance"
            fill
            priority
            className="object-cover object-[80%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/85 via-50% to-black/35 sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/90 sm:via-55% sm:to-transparent" />

          <div className="relative z-10 p-5 sm:p-8 md:p-10 space-y-2 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#f3c251]" />
              <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.24em] text-[#f3c251]">
                LEGAL TITLE SEARCH & REVENUE AUDIT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
              PROTECT THE PROPERTY BEHIND YOUR LOAN.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 font-normal leading-relaxed max-w-lg">
              Title verification, search and survey reports, mortgage legal assistance, and dispute-resolution support.
            </p>
          </div>
        </section>

        {/* Status Notification */}
        {submitStatus.msg && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm ${
            submitStatus.success ? 'bg-emerald-50 text-emerald-950' : 'bg-rose-50 text-rose-700'
          }`}>
            {submitStatus.success ? <FiCheck className="text-[#217044] w-5 h-5 shrink-0" /> : <FiAlertCircle className="text-rose-600 w-5 h-5 shrink-0" />}
            <p className="flex-1">{submitStatus.msg}</p>
          </div>
        )}

        {/* CATEGORY TILES */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Select Verifications Needed
            </span>
            <span className="text-[11px] font-mono font-bold text-[#217044]">
              {selectedServices.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SERVICES_LIST.map((service) => {
              const isSelected = selectedServices.includes(service.name);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceToggle(service.name)}
                  className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[90px] shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#217044] text-white'
                      : 'bg-white text-slate-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold opacity-60">
                      VETTING
                    </span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-white text-[#217044]' : 'bg-slate-100 text-transparent'
                    }`}>
                      <FiCheck size={10} strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight leading-snug">
                    {service.name}
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
              Asset Due-Diligence Application
            </h2>
            <p className="text-xs text-slate-500">
              Submit your property coordinates and legal records directly for document verification.
            </p>
          </div>

          <form onSubmit={handleVettingSubmit} className="space-y-8">
            
            {/* Step 1: Input Fields */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-[#217044] block">
                1. Owner & Location Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Owner / Applicant Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter owner name"
                    className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 transition-all shadow-2xs"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Mobile Contact Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 95759 59137"
                    className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 font-mono transition-all shadow-2xs"
                    value={formData.userPhone}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  />
                </div>

                <div className="col-span-full space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Property Location & Khasra Coordinates</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Khasra #210/4, Sector-4 Bilaspur"
                    className="w-full bg-[#FAFBFD] rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-emerald-50/40 transition-all shadow-2xs"
                    value={formData.propertyLocation}
                    onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Document Uploads (All Optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#217044] block">
                  2. Document Uploads (Optional)
                </span>
                <span className="text-[10px] font-mono text-slate-400">PDF, PNG, JPG accepted</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const uploadedForThisDoc = selectedFiles.filter(f => f.category === doc.label);
                  const isUploaded = uploadedForThisDoc.length > 0;

                  return (
                    <div key={doc.id} className="p-5 rounded-2xl bg-[#FAFBFD] hover:bg-emerald-50/30 transition-all flex flex-col justify-between shadow-2xs space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <FiFile className="text-[#217044]" size={18} />
                          <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">OPTIONAL</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.label}</h4>
                        <p className="text-[10px] text-slate-500 font-normal leading-relaxed">{doc.note}</p>
                      </div>

                      <label className="cursor-pointer bg-white hover:bg-[#217044] hover:text-white text-[#217044] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs text-center">
                        <FiUpload size={13} />
                        <span>{isUploaded ? "Add More" : "Upload File"}</span>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.png,.jpg,.jpeg" 
                          className="hidden" 
                          onChange={(e) => handleCategorizedFileUpload(e, doc.label)} 
                          disabled={isSubmitting} 
                        />
                      </label>

                      {isUploaded && (
                        <div className="space-y-1.5 pt-1">
                          {uploadedForThisDoc.map((file, fileIdx) => {
                            const globalIdx = selectedFiles.findIndex(f => f === file);
                            return (
                              <div key={fileIdx} className="bg-white px-3.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs">
                                <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                                  <FiPaperclip className="text-[#217044] shrink-0" size={12} />
                                  <span className="truncate text-[10px]">{file.name}</span>
                                </div>
                                <button type="button" onClick={() => removeFileFromQueue(globalIdx)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer">
                                  <FiX size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Remarks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">Custom Remarks / Special Doubts (Optional)</label>
              <textarea
                rows={3}
                placeholder="Property square footage, seller history, specific legal doubts..."
                className="w-full bg-[#FAFBFD] rounded-2xl p-4 text-xs font-medium text-slate-900 outline-none focus:bg-emerald-50/40 resize-none transition-all shadow-2xs"
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#217044] hover:bg-[#185332] text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading Papers & Submitting...' : <><FiUpload size={16} /> Submit Property Papers For Verification</>}
            </button>

          </form>
        </section>

        {/* BOTTOM CLARITY CTA BANNER */}
        <section className="relative overflow-hidden bg-[#052516] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f3c251]">
              NEED PROPERTY TITLE CLARIFICATION?
            </span>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
              Consult Our Revenue Documentation Desk
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-normal max-w-xl">
              Assistance available Monday to Saturday (10:00 AM – 7:00 PM). Connect with our Bilaspur consulting desk.
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