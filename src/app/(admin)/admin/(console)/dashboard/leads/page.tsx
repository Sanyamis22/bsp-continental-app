"use client";

import React, { useState, useEffect } from "react";
import { 
  FiRefreshCw, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiFileText,
  FiInbox,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiSearch,
  FiMessageSquare
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import type { InquiryDTO, ContactDTO } from "@/types/lead";

type Lead = Partial<InquiryDTO> &
  Partial<ContactDTO> & {
    _id: string;
    createdAt: string;
    sourceType: string;
    city?: string;
    preferredContact?: string;
  };

export default function AdminDashboardLeads() {
  const [inquiries, setInquiries] = useState<InquiryDTO[]>([]);
  const [contacts, setContacts] = useState<ContactDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Combined and sorted by latest
  const combinedLeads: Lead[] = [
    ...inquiries.map((item) => ({ ...item, sourceType: "Inquiry" })),
    ...contacts.map((item) => ({ ...item, sourceType: "Contact Desk" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter based on active tab
  const tabFiltered: Lead[] = 
    activeTab === "inquiries" 
      ? inquiries.map((i) => ({ ...i, sourceType: "Inquiry" }))
      : activeTab === "contacts" 
      ? contacts.map((c) => ({ ...c, sourceType: "Contact Desk" }))
      : combinedLeads;

  // Filter based on search query
  const displayedLeads = tabFiltered.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q))
    );
  });

  // Analytics Calculation
  const totalRevenue = inquiries
    .filter((i) => i.paymentStatus === "Completed")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 select-none antialiased p-4 sm:p-8 lg:p-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-[2px] bg-[#f3c251]" />
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#217044]">
                CENTRAL ADMIN PANEL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#052516]">
              BSP Continental Leads Desk
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#052516] hover:bg-[#217044] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Syncing..." : "Sync Database"}</span>
          </button>
        </div>

        {/* ─── 4 ANALYTIC KPI CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Total Submissions
              </span>
              <p className="text-3xl font-black font-mono text-[#052516] mt-1">
                {combinedLeads.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#217044] flex items-center justify-center text-xl">
              <FiUsers />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Service Inquiries
              </span>
              <p className="text-3xl font-black font-mono text-amber-700 mt-1">
                {inquiries.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
              <FiFileText />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Contact Messages
              </span>
              <p className="text-3xl font-black font-mono text-[#217044] mt-1">
                {contacts.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#217044] flex items-center justify-center text-xl">
              <FiMessageSquare />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Verified Inflows
              </span>
              <p className="text-3xl font-black font-mono text-[#052516] mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#217044] flex items-center justify-center text-xl">
              <FiDollarSign />
            </div>
          </div>
        </div>

        {/* ─── TABS & SEARCH BAR ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#217044] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Records ({combinedLeads.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-[#217044] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Inquiries ({inquiries.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("contacts")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-[#217044] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Contact Desk ({contacts.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#217044] transition-all"
            />
          </div>
        </div>

        {/* ─── DATA TABLE WITH ONE-CLICK CALL & WHATSAPP ─── */}
        {loading ? (
          <div className="p-20 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-9 h-9 border-4 border-[#217044] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syncing portal data...</p>
          </div>
        ) : displayedLeads.length === 0 ? (
          <div className="p-20 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <FiInbox className="text-5xl text-slate-300 mx-auto" />
            <p className="text-sm font-black text-slate-600 uppercase tracking-tight">No submissions found</p>
            <p className="text-xs text-slate-400">Database me matching records nahi hain.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-slate-200 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Channel / Source</th>
                    <th className="p-4">Applicant Profile</th>
                    <th className="p-4">Target Service</th>
                    <th className="p-4">Client Query / Notes</th>
                    <th className="p-4">Amount / Status</th>
                    <th className="p-4">Direct Action</th>
                    <th className="p-4 pr-6">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {displayedLeads.map((item) => {
                    const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, "") : "";
                    const whatsappNumber = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Channel Badge */}
                        <td className="p-4 pl-6 align-top">
                          <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider font-mono ${
                            item.sourceType === "Inquiry"
                              ? "bg-amber-100 text-amber-900 border border-amber-300/60"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300/60"
                          }`}>
                            {item.sourceType}
                          </span>
                        </td>

                        {/* Client Info */}
                        <td className="p-4 align-top space-y-1">
                          <p className="font-bold text-slate-900 text-sm leading-snug">{item.name}</p>
                          <div className="space-y-0.5 text-slate-500 font-mono text-[11px]">
                            <p className="text-slate-700 font-bold">{item.phone}</p>
                            {item.email && (
                              <p className="truncate max-w-[180px] text-slate-400">{item.email}</p>
                            )}
                            {item.city && (
                              <div className="flex items-center gap-1 text-[#217044]">
                                <FiMapPin size={12} />
                                <span>{item.city}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Service Required */}
                        <td className="p-4 align-top">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg inline-block text-[11px]">
                            {item.service}
                          </span>
                        </td>

                        {/* Message / Query */}
                        <td className="p-4 align-top max-w-xs">
                          <p className="text-slate-600 leading-relaxed line-clamp-3">
                            {item.message || "—"}
                          </p>
                        </td>

                        {/* Amount & Status */}
                        <td className="p-4 align-top">
                          {item.sourceType === "Inquiry" ? (
                            <div className="space-y-1">
                              <span className="font-mono font-black text-slate-900 text-xs">
                                ₹{item.amount || 0}
                              </span>
                              <span className={`block text-[10px] font-bold uppercase font-mono ${
                                item.paymentStatus === "Completed" ? "text-emerald-600" : "text-amber-600"
                              }`}>
                                {item.paymentStatus || "Pending"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500 uppercase">
                              Pref: {item.preferredContact || "Call"}
                            </span>
                          )}
                        </td>

                        {/* One-Click Call & WhatsApp Action */}
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${item.phone}`}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-[#217044] text-[#217044] hover:text-white transition-all shadow-xs"
                              title="Call Client Immediately"
                            >
                              <FiPhone size={15} />
                            </a>

                            <a
                              href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(item.name || "Client")},%20we%20received%20your%20request%20at%20BSP%20Continental.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-green-50 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all shadow-xs"
                              title="Open WhatsApp Chat"
                            >
                              <FaWhatsapp size={15} />
                            </a>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-4 pr-6 align-top whitespace-nowrap text-slate-400 font-mono text-[11px]">
                          <div className="flex items-center gap-1">
                            <FiCalendar />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}