"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPhone, FiCreditCard, FiShield, FiCheckCircle } from "react-icons/fi";
import { errorMessage } from "@/types/api";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    panCard: "",
    identificationNo: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const brandColor = "#4933e6";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok && data.user) {
        setFormData({
          phone: data.user.phone || "",
          panCard: data.user.panCard || "",
          identificationNo: data.user.identificationNo || ""
        });
      }
    } catch (err) {
      setError("Failed to stream parameters data ledger.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update operation failed.");
      
      setMessage("Parameters synchronized inside database storage ledger!");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <p className="text-sm font-black tracking-widest text-slate-400 animate-pulse uppercase">Syncing Safe Session Context Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center pt-24 pb-24 px-4 select-none">
      <div className="w-full max-w-[460px] bg-white rounded-[2rem] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100">
        
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black uppercase" style={{ color: brandColor }}>
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{session?.user?.name || "Client Access"}</h1>
            <p className="text-xs font-bold text-slate-400 font-mono mt-0.5 lowercase">{session?.user?.email}</p>
          </div>
        </div>

        {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">{message}</div>}
        {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Registered Phone</label>
            <div className="relative flex items-center">
              <input type="tel" placeholder="Enter Mobile Contact" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-5 pr-12 text-xs font-bold text-black focus:outline-none focus:bg-white focus:border-black transition-all" />
              <FiPhone className="absolute right-4 text-slate-400 text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">PAN Verification Identity</label>
            <div className="relative flex items-center">
              <input type="text" maxLength={10} placeholder="ABCDE1234F" value={formData.panCard} onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-5 pr-12 text-xs font-bold text-black uppercase focus:outline-none focus:bg-white focus:border-black transition-all" />
              <FiCreditCard className="absolute right-4 text-slate-400 text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Aadhaar Card Logs Reference</label>
            <div className="relative flex items-center">
              <input type="text" maxLength={12} placeholder="12-Digit Identification Identity" value={formData.identificationNo} onChange={(e) => setFormData({ ...formData, identificationNo: e.target.value.replace(/\s/g, "") })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-5 pr-12 text-xs font-bold text-black focus:outline-none focus:bg-white focus:border-black transition-all" />
              <FiShield className="absolute right-4 text-slate-400 text-sm" />
            </div>
          </div>

          <button type="submit" disabled={updating} className="w-full text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer" style={{ backgroundColor: brandColor }}>
            <FiCheckCircle size={13} />
            <span>{updating ? "SYNCHRONIZING SECURE NODE..." : "SAVE PROFILE DATA"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}