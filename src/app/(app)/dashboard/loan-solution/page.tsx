'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiFileText, FiUpload, FiX, FiCheck, FiUser, FiDollarSign, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import type { RequestDTO, RequestDocumentDTO } from "@/types/request";
import { errorMessage } from "@/types/api";

export default function LoanSolutionPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    applicantName: session?.user?.name || '',
    userPhone: '',
    bankName: '',
    loanAmount: '',
    monthlyIncome: '',
    rejectionReason: '',
    customMessage: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<RequestDocumentDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, msg: '' });

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const mapped = files.map(file => ({
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

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, msg: '' });

    const finalUploadedUrls = [];
    let uploadFailed = false;

    // 1. AWS Upload
    if (selectedFiles.length > 0) {
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
    }

    if (uploadFailed) return;

    // 2. Central API Store (/api/requests)
    try {
      const dbResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.applicantName || session?.user?.name || "Anonymous Applicant",
          userEmail: session?.user?.email || "user@cginfrax.com",
          userPhone: formData.userPhone,
          serviceType: "Loan Rejection Solution",
          details: {
            bankName: formData.bankName,
            loanAmount: Number(formData.loanAmount) || 0,
            monthlyIncome: Number(formData.monthlyIncome) || 0,
            rejectionReason: formData.rejectionReason,
            customMessage: formData.customMessage
          },
          documentsList: finalUploadedUrls,
          status: "Pending"
        })
      });

      const dbResult = await dbResponse.json();
      if (!dbResponse.ok || !dbResult.success) throw new Error(dbResult.message || "DB transaction fault.");

      setIsSubmitting(false);
      setSubmitStatus({ success: true, msg: 'Loan Rejection Appeal Submitted Successfully!' });

      setFormData({ applicantName: '', userPhone: '', bankName: '', loanAmount: '', monthlyIncome: '', rejectionReason: '', customMessage: '' });
      setSelectedFiles([]);

      setTimeout(() => router.push('/dashboard/my-requests'), 1500);
    } catch (dbError) {
      setIsSubmitting(false);
      setSubmitStatus({ success: false, msg: `Database error: ${errorMessage(dbError)}` });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 py-8 md:py-16 px-4 md:px-8 font-sans flex flex-col justify-start items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest">
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">LOAN CLEARANCE ENGINE</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase">LOAN REJECTION SOLUTION APPEAL</h2>
          <p className="text-xs text-slate-400 font-bold max-w-xl">Attach bank rejection slips and salary records for fast clearance.</p>
        </div>

        {submitStatus.msg && (
          <div className={`border-l-4 p-4 rounded-xl flex items-center gap-3 text-xs font-bold bg-white ${submitStatus.success ? 'text-slate-800 border-rose-500' : 'text-rose-600 border-rose-500'}`}>
            {submitStatus.success ? <FiCheck className="text-emerald-600" /> : <FiAlertCircle className="text-rose-600" />}
            <p>{submitStatus.msg}</p>
          </div>
        )}

        <form onSubmit={handleLoanSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Applicant Name</label>
                <input required type="text" placeholder="Full name as per PAN" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.applicantName} onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
                <input required type="tel" placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.userPhone} onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Bank Name</label>
                <input required type="text" placeholder="e.g. SBI, HDFC" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Loan Amount (₹)</label>
                <input required type="number" placeholder="e.g. 500000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.loanAmount} onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Monthly Income (₹)</label>
                <input required type="number" placeholder="e.g. 65000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.monthlyIncome} onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Rejection Reason Stated</label>
                <input type="text" placeholder="e.g. Low CIBIL / Vintage" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold" value={formData.rejectionReason} onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase">Case Remarks Note</label>
              <textarea rows={3} placeholder="Bank rejection slip notes..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium resize-none" value={formData.customMessage} onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })} />
            </div>
          </div>

          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <label className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-7 flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                <FiUpload className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-black">Select Rejection Papers</span>
                <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFileSelection} disabled={isSubmitting} />
              </label>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold">
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <button type="button" onClick={() => removeFileFromQueue(idx)} className="text-rose-600"><FiX /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-rose-600 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider">
              {isSubmitting ? 'Uploading...' : 'Submit Loan Appeal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}