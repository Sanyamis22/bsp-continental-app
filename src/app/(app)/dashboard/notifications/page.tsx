'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiBell, FiCheck, FiClock, 
  FiExternalLink, FiRefreshCw, FiShield, FiBriefcase, FiLock 
} from 'react-icons/fi';
import Link from 'next/link';
import type { NotificationDTO } from "@/types/notification";

export default function UserNotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchUserNotifications = async () => {
    if (!session?.user?.email) return;
    setLoading(true);

    try {
      const response = await fetch('/api/notifications');
      const result = await response.json();
      if (response.ok && result.success) {
        setNotifications(result.data || []);
      }
    } catch (err) {
      console.error('Fetch User Notifications Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserNotifications();
    }
  }, [status, session]);

  const handleNotificationClick = async (notif: NotificationDTO) => {
    // Mark as read in DB
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notif._id })
      });
    } catch (e) {
      console.error(e);
    }
    // Redirect to my-requests page
    router.push(notif.targetUrl || '/dashboard/my-requests');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3 font-sans">
        <FiRefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Notifications...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 antialiased py-8 md:py-14 px-4 md:px-8 font-sans flex flex-col items-center select-none">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-all">
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <button onClick={fetchUserNotifications} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 hover:bg-slate-50 uppercase tracking-wider shadow-3xs cursor-pointer">
            <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Sync Alerts</span>
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1 pb-3 border-b border-slate-200/80">
          <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
            <FiBell className="text-indigo-600" size={22} /> NOTIFICATIONS
          </h2>
          <p className="text-xs text-slate-400 font-bold">
            Admin action responses and status alerts for: <span className="text-indigo-600 font-black">{session?.user?.email}</span>
          </p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <FiBell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800 uppercase">No Notifications Yet</h3>
            <p className="text-xs text-slate-400 font-medium">Jaise hi Admin aapki request par action lega, yahan notification alert dikhega.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 flex items-start justify-between gap-4 ${
                  notif.isRead 
                    ? 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs' 
                    : 'bg-indigo-50/60 border-indigo-200 shadow-xs hover:border-indigo-300 ring-1 ring-indigo-200'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      notif.serviceType === 'Property Vetting' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {notif.serviceType === 'Property Vetting' ? <FiShield size={10} /> : <FiBriefcase size={10} />}
                      {notif.serviceType}
                    </span>

                    {!notif.isRead && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black uppercase rounded-md tracking-wider">NEW</span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-slate-900">{notif.title}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.message}</p>
                  
                  <span className="text-[9px] font-bold text-slate-400 font-mono block pt-1">
                    {new Date(notif.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-indigo-600 self-center">
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