'use client';

import React, { useEffect, useState } from 'react';
import { 
  FiArrowLeft, FiClock, FiFileText, FiShield, 
  FiBriefcase, FiRefreshCw, FiExternalLink, FiUser, 
  FiPhone, FiMail, FiFilter, FiSend, FiMessageSquare, 
  FiCheckCircle, FiXCircle, FiTrash2
} from 'react-icons/fi';
import Link from 'next/link';
import type { RequestDTO, RequestDocumentDTO, RequestStatus } from "@/types/request";
import { errorMessage } from "@/types/api";

export default function RequestsView({ initialStatus }: { initialStatus: RequestStatus }) {

  const [allRequests, setAllRequests] = useState<RequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatusTab, setCurrentStatusTab] = useState<string>(initialStatus);
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('In Review');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/requests');
      const result = await response.json();
      if (response.ok && result.success) {
        setAllRequests(result.data || []);
      }
    } catch (err) {
      console.error('Fetch Master Ledger Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const openActionDrawer = (req: RequestDTO) => {
    setActiveReplyId(req._id);
    setReplyStatus(req.status === 'Pending' ? 'In Review' : req.status);
    setReplyMessage(req.adminReply?.message || '');
    setReplyFile(null);
  };

  // 🚀 INSTANT REMOVE / SHIFT DISPATCHER
  const handleDecisionDispatch = async (requestId: string) => {
    setIsSubmittingReply(true);

    let uploadedAdminDoc = { name: '', url: '' };

    // Upload Response Document to S3 if attached
    if (replyFile) {
      try {
        const uploadPayload = new FormData();
        uploadPayload.append('file', replyFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadPayload
        });

        const uploadResult = await uploadRes.json();
        if (uploadRes.ok && uploadResult.success) {
          uploadedAdminDoc = {
            name: uploadResult.name || replyFile.name,
            url: uploadResult.fileUrl || uploadResult.url
          };
        }
      } catch (uploadErr) {
        alert("S3 Storage upload failed: " + errorMessage(uploadErr));
        setIsSubmittingReply(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: replyStatus,
          adminMessage: replyMessage,
          adminDocument: uploadedAdminDoc.url ? uploadedAdminDoc : undefined
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert(`Request marked as [${replyStatus}] and shifted!`);

        // ⚡ INSTANT REMOVE FROM CURRENT VIEW STATE
        setAllRequests(prev =>
          prev.map(item =>
            item._id === requestId
              ? {
                  ...item,
                  status: replyStatus,
                  adminReply: {
                    message: replyMessage,
                    document: uploadedAdminDoc.url ? uploadedAdminDoc : item.adminReply?.document
                  }
                }
              : item
          )
        );

        setActiveReplyId(null);
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (err) {
      alert('Error updating decision state');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Dynamic state filter based on active Tab and Category
  const displayedRequests = allRequests.filter(req => {
    const matchesStatus = (req.status || 'Pending') === currentStatusTab;
    const matchesService = serviceFilter === 'ALL' || req.serviceType === serviceFilter;
    return matchesStatus && matchesService;
  });

  const countByStatus = (statusName: string) => allRequests.filter(r => (r.status || 'Pending') === statusName).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3 font-sans">
        <FiRefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Requests Studio...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 antialiased py-8 md:py-12 px-4 md:px-8 font-sans flex flex-col items-center select-none">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                <FiArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-black text-slate-950 uppercase tracking-tight">
                  ADMIN MASTER DESK
                </h1>
                <p className="text-xs font-bold text-slate-400">
                  Active Requests in Current Tab: <span className="text-indigo-600 font-black">{displayedRequests.length}</span>
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchMasterData} disabled={loading} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-2xl uppercase tracking-wider transition-all cursor-pointer">
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Ledger</span>
          </button>
        </div>

        {/* Status Tab Counters (Active Tabs System) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'Pending', label: 'Pending Requests', count: countByStatus('Pending') },
            { id: 'In Review', label: 'In Review Desk', count: countByStatus('In Review') },
            { id: 'Approved', label: 'Approved Archive', count: countByStatus('Approved') },
            { id: 'Rejected', label: 'Rejected Archive', count: countByStatus('Rejected') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentStatusTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                currentStatusTab === tab.id 
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-indigo-600' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${currentStatusTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`}>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${currentStatusTab === tab.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>{tab.count}</span>
              </div>
              <p className={`text-xl font-black ${currentStatusTab === tab.id ? 'text-white' : 'text-slate-900'}`}>{tab.count} <span className="text-xs font-normal text-slate-400">items</span></p>
            </button>
          ))}
        </div>

        {/* Service Sub-Filter */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => setServiceFilter('ALL')} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer ${serviceFilter === 'ALL' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400'}`}>All Services</button>
            <button onClick={() => setServiceFilter('Property Vetting')} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${serviceFilter === 'Property Vetting' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'}`}><FiShield size={13} /> Property Paper Check</button>
            <button onClick={() => setServiceFilter('Loan Rejection Solution')} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${serviceFilter === 'Loan Rejection Solution' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'}`}><FiBriefcase size={13} /> Loan Solution</button>
          </div>
        </div>

        {/* Request Cards Listing */}
        {displayedRequests.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <FiFileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800 uppercase">No Requests in [{currentStatusTab}]</h3>
            <p className="text-xs text-slate-400 font-medium">Is tab me filhal koi application entry nahi hai.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {displayedRequests.map((req) => (
              <div key={req._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 hover:border-slate-200 transition-all">
                
                {/* Badge Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      req.serviceType === 'Property Vetting' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {req.serviceType === 'Property Vetting' ? <FiShield size={13} /> : <FiBriefcase size={13} />}
                      {req.serviceType === 'Property Vetting' ? 'Property Paper Check' : 'Loan Solution'}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                      req.status === 'In Review' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      ● {req.status || 'Pending'}
                    </span>
                  </div>

                  <button 
                    onClick={() => openActionDrawer(req)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-black text-[10px] rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                  >
                    <FiMessageSquare size={13} /> Action / Dispatch Decision
                  </button>
                </div>

                {/* Details Payload */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-[9px] text-slate-400 font-black uppercase block">CLIENT IDENTITY</span>
                    <p className="font-black text-slate-900 flex items-center gap-2"><FiUser size={14} className="text-indigo-600" /> {req.userName || 'Anonymous'}</p>
                    <p className="font-bold text-slate-600 flex items-center gap-2 font-mono text-[11px]"><FiMail size={13} className="text-slate-400" /> {req.userEmail || 'N/A'}</p>
                    {req.userPhone && <p className="font-bold text-slate-600 flex items-center gap-2 font-mono text-[11px]"><FiPhone size={13} className="text-slate-400" /> {req.userPhone}</p>}
                  </div>

                  <div className="md:col-span-8 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-[9px] text-slate-400 font-black uppercase block">PAYLOAD DETAILS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {req.details?.ownerName && <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Owner Name</span><p className="font-bold text-slate-900">{req.details?.ownerName}</p></div>}
                      {req.details?.propertyLocation && <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Location / Khasra No</span><p className="font-bold text-slate-900">{req.details?.propertyLocation}</p></div>}
                      {req.details?.bankName && <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Bank Name</span><p className="font-bold text-slate-900">{req.details?.bankName}</p></div>}
                      {(req.details?.loanAmount ?? 0) > 0 && <div><span className="text-[9px] text-slate-400 font-bold block uppercase">Loan Amount</span><p className="font-bold text-slate-900 font-mono">₹{req.details?.loanAmount?.toLocaleString('en-IN')}</p></div>}
                    </div>

                    {req.documentsList && req.documentsList.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-slate-400 font-black uppercase block">Client Papers ({req.documentsList.length}):</span>
                        {req.documentsList.map((doc, idx) => (
                          <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl text-[10px] font-bold text-indigo-600 hover:bg-slate-100 transition-all">
                            <FiFileText size={12} /> <span className="truncate max-w-[130px]">{doc.name}</span> <FiExternalLink size={11} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sent Admin Response Preview */}
                {req.adminReply?.message && (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
                    <span className="text-[9px] font-black text-indigo-400 uppercase block">DISPATCHED RESPONSE & ATTACHED FILE</span>
                    <p className="text-xs font-bold text-slate-200">"{req.adminReply.message}"</p>
                    {req.adminReply.document?.url && (
                      <div className="pt-1">
                        <a href={req.adminReply?.document?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all">
                          <FiFileText size={12} /> View Sent Action Document <FiExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* REPLY DRAWER MODAL */}
                {activeReplyId === req._id && (
                  <div className="bg-slate-950 text-white p-6 rounded-3xl space-y-4 animate-fadeIn border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h4 className="text-xs font-black uppercase text-indigo-400">SELECT ACTION STATUS & SEND FILE</h4>
                      <button onClick={() => setActiveReplyId(null)} className="text-slate-400 hover:text-white text-xs font-bold">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400">Target Status</label>
                        <select value={replyStatus} onChange={(e) => setReplyStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none">
                          <option value="In Review">In Review (Investigation)</option>
                          <option value="Approved">Approved (Send to Approved Tab)</option>
                          <option value="Rejected">Rejected (Send to Rejected Tab)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400">Attach PDF Paper</label>
                        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setReplyFile(e.target.files?.[0] ?? null)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Action Guidance Message</label>
                      <textarea rows={3} placeholder="Client ke liye action message likhein..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none resize-none" />
                    </div>

                    <button onClick={() => handleDecisionDispatch(req._id)} disabled={isSubmittingReply} className={`w-full font-black text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${replyStatus === 'Rejected' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                      {isSubmittingReply ? 'Processing...' : (replyStatus === 'Rejected' ? <><FiTrash2 size={14} /> Confirm Reject & Shift Tab</> : <><FiSend size={14} /> Confirm & Shift Tab</>)}
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}