'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiBell, FiCheck, FiClock, 
  FiExternalLink, FiRefreshCw, FiShield, FiBriefcase, FiUser 
} from 'react-icons/fi';
import Link from 'next/link';
import type { NotificationDTO } from "@/types/notification";

export default function AdminNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      const result = await response.json();
      if (response.ok && result.success) {
        setNotifications(result.data || []);
      }
    } catch (err) {
      console.error('Fetch Admin Notifications Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminNotifications();
    // Auto-poll every 15 seconds to check new submissions in real-time
    const interval = setInterval(fetchAdminNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notif: NotificationDTO) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notif._id })
      });
    } catch (e) {
      console.error(e);
    }
    router.push(notif.targetUrl || '/admin/dashboard/requests');
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3 font-sans">
        <FiRefreshCw className="w-6 h-6 text-[#217044] animate-spin" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Admin Notifications...</span>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 antialiased py-8 md:py-12 px-4 md:px-8 font-sans flex flex-col items-center select-none">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard/requests" className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition-all">
                <FiArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <FiBell size={20} className="text-[#217044]" /> ADMIN NOTIFICATION STUDIO
                </h1>
                <p className="text-xs font-bold text-slate-400">
                  Unread Alerts: <span className="text-rose-600 font-black">{unreadCount}</span> | Total: <span className="text-[#217044] font-black">{notifications.length}</span>
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchAdminNotifications} disabled={loading} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#217044] hover:bg-[#185332] text-white font-black text-xs rounded-2xl uppercase tracking-wider transition-all cursor-pointer shadow-sm">
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Alerts</span>
          </button>
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <FiBell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800 uppercase">No Admin Notifications Found</h3>
            <p className="text-xs text-slate-400">New client applications and vetting requests will appear here instantly.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 flex items-start justify-between gap-4 ${
                  notif.isRead 
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs' 
                    : 'bg-emerald-50/70 border-emerald-200 shadow-xs hover:border-emerald-300 ring-1 ring-emerald-200'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 bg-[#217044]/10 text-[#217044]">
                      <FiShield size={10} />
                      {notif.serviceType || "Vetting Request"}
                    </span>

                    {!notif.isRead && (
                      <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg tracking-wider animate-pulse">NEW SUBMISSION</span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-slate-900">{notif.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{notif.message}</p>
                  
                  <span className="text-[10px] font-bold text-slate-400 font-mono block pt-1">
                    {new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="text-[#217044] self-center p-2 rounded-xl bg-white border border-slate-200">
                  <FiExternalLink size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}