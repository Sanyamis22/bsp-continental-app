'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiTrendingUp, 
  FiArrowRight, 
  FiArrowLeft, 
  FiMessageSquare, 
  FiX, 
  FiShield, 
  FiSend,
  FiZap, 
  FiBriefcase, 
  FiGrid,
  FiPhoneCall,
  FiMessageCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import type { ChatMessage } from "@/types/chat";

export default function DashboardPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [placeholderText, setPlaceholderText] = useState('★ Ask Customer Support...');
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3 EXACT SLIDES USING LANDING PAGE PREMIUM ASSETS
  const slides = [
    { 
      tag: "CIBIL SCORE MANAGEMENT",
      title: "IMPROVE YOUR CREDIT PROFILE",
      desc: "CIBIL analysis, dispute support, and structured guidance.",
      img: "/images/Structured credit planning with expert guidance.png",
      link: "/dashboard/credit-score-management"
    },
    { 
      tag: "PROPERTY COMPLIANCE",
      title: "PROTECT THE PROPERTY BEHIND YOUR LOAN",
      desc: "Title verification, search & survey reports, and dispute audit.",
      img: "/images/Premiumproperty.png",
      link: "/dashboard/property-compliance"
    },
    { 
      tag: "FINANCIAL CONSULTING",
      title: "FINANCIAL CLARITY & STRONGER DECISIONS",
      desc: "Strategic guidance for secured loans, MSME capital, and DPR/CMA files.",
      img: "/images/Strategic Financial Guidance for Indian Businesses.png",
      link: "/dashboard/finance"
    }
  ];

  useEffect(() => {
    const placeholders = [
      '★ Ask Customer Support...',
      '⚡ Need Credit Audit Help?',
      '★ Query Property Vetting...'
    ];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setPlaceholderText(placeholders[currentIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const nextSlide = (e: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const sendMessage = async (textToSend?: string) => {
    const currentQuery = textToSend || input;
    if (!currentQuery.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: currentQuery };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const queryLower = currentQuery.toLowerCase();
    if (
      queryLower.includes('contact') || 
      queryLower.includes('number') || 
      queryLower.includes('phone') || 
      queryLower.includes('call') || 
      queryLower.includes('mobile') ||
      queryLower.includes('sampark')
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: '📞 AAP HUMSE SEEDHE CONTACT KAR SAKTE HAIN:\n\n• Phone/WhatsApp: +91 9575959137\n• Email: bspccontinental@gmail.com\n• Office: Shop No OAS 4, Super Market Complex, 2nd Floor, Agrasen Chowk, Bilaspur (C.G.)' 
          }
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: 'Aap direct WhatsApp kar sakte hain: +91 9575959137 par support team se baat karne ke liye.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // ✅ One Click: WhatsApp Opens | Double Click: Admin Login Opens
  const handleSupportIconClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      router.push('/admin/login'); // Double Click -> Admin Login
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        // Single Click -> Open WhatsApp Direct Chat (9575959137)
        window.open('https://wa.me/919575959137?text=Hello%20BSP%20Continental,%20I%20need%20assistance%20with%20my%20loan/property%20file.', '_blank');
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const quickActions = [
    { label: '🏢 Services Overview', text: 'Aap log kaun-kaun si services provide karte hain?' },
    { label: '🛡️ Property Vetting Details', text: 'Property legal verification ke baare me bataiye.' },
    { label: '📊 CIBIL & Credit Support', text: 'Credit Score Management ke baare me batao.' },
    { label: '📞 Contact Support', text: 'Official contact details aur mobile number share karein.' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 antialiased py-6 px-4 sm:px-6 md:px-8 font-sans select-none transition-all duration-300">
      
      {/* Centered Max Container */}
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-[#217044]/10 text-[#217044] border border-[#217044]/20 shadow-xs">
                <FiZap size={18} />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                BSP CONTINENTAL <span className="text-[#217044]">FINANCIAL</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-bold pl-0.5">
              Property Verification, Credit Score Advisory & Financial Consultants
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/919575959137" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#217044] border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xs"
            >
              <FaWhatsapp size={16} className="text-emerald-600" />
              <span>WhatsApp Support</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 bg-[#217044]/10 border border-[#217044]/20 px-3.5 py-2 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#217044] animate-pulse" />
              <span className="text-[11px] font-black text-[#217044] uppercase tracking-wider">
                Live Desk
              </span>
            </div>
          </div>
        </div>

        {/* ─── 1. HERO SLIDER ─── */}
        <section className="space-y-2.5 relative group/slider">
          <div className="relative overflow-hidden rounded-3xl shadow-lg bg-[#062415]">
            <div 
              className="flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 relative aspect-[16/9] md:aspect-[980/260] overflow-hidden">
                  <img 
                    src={slide.img} 
                    alt={slide.title} 
                    className="w-full h-full object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/85 sm:to-transparent" />

                  <div className="absolute inset-0 z-10 flex flex-col justify-end sm:justify-center p-5 sm:p-8 max-w-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-[2px] bg-[#f3c251]" />
                      <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.2em] text-[#f3c251]">
                        {slide.tag}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                      {slide.title}
                    </h2>

                    <p className="hidden sm:block text-xs sm:text-sm text-emerald-100/90 font-medium line-clamp-2 leading-relaxed">
                      {slide.desc}
                    </p>

                    <div className="pt-2">
                      <Link 
                        href={slide.link} 
                        className="inline-flex items-center gap-2 bg-[#f3c251] hover:bg-[#e4b443] text-[#062415] font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Explore Module <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={prevSlide} 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/70 text-white rounded-2xl flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover/slider:opacity-100 z-20 cursor-pointer shadow-md"
            >
              <FiArrowLeft size={16} />
            </button>
            <button 
              type="button"
              onClick={nextSlide} 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/70 text-white rounded-2xl flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover/slider:opacity-100 z-20 cursor-pointer shadow-md"
            >
              <FiArrowRight size={16} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 pt-1">
            {slides.map((_, index) => (
              <button 
                key={index} 
                type="button"
                onClick={() => setCurrentSlide(index)} 
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === index ? 'w-8 h-2 bg-[#217044]' : 'w-2 h-2 bg-slate-300'
                }`} 
              />
            ))}
          </div>
        </section>

        {/* ─── 2. CORE SERVICES GRID ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FiGrid className="text-[#217044]" /> Core Advisory Solutions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            
            {/* Property Compliance */}
            <Link href="/dashboard/property-compliance" className="block group h-full">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:border-[#217044] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full min-h-[190px] active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 rounded-2xl bg-[#217044]/10 text-[#217044] border border-[#217044]/20 group-hover:bg-[#217044] group-hover:text-white transition-all shadow-xs">
                    <FiShield size={22} />
                  </span>
                  <span className="text-xs font-black text-[#217044] bg-[#217044]/10 px-3 py-1 rounded-xl font-mono">
                    01
                  </span>
                </div>
                
                <div className="space-y-1.5 pt-4">
                  <h4 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight group-hover:text-[#217044] transition-colors leading-snug">
                    Property Compliance
                  </h4>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    Legal Verification & Document Registry Audit
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-extrabold text-[#217044] group-hover:translate-x-1.5 transition-transform">
                  <span>Explore Service</span>
                  <FiArrowRight size={14} />
                </div>
              </div>
            </Link>

            {/* Credit Score Management */}
            <Link href="/dashboard/credit-score-management" className="block group h-full">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:border-[#217044] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full min-h-[190px] active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 rounded-2xl bg-[#217044]/10 text-[#217044] border border-[#217044]/20 group-hover:bg-[#217044] group-hover:text-white transition-all shadow-xs">
                    <FiTrendingUp size={22} />
                  </span>
                  <span className="text-xs font-black text-[#217044] bg-[#217044]/10 px-3 py-1 rounded-xl font-mono">
                    02
                  </span>
                </div>
                
                <div className="space-y-1.5 pt-4">
                  <h4 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight group-hover:text-[#217044] transition-colors leading-snug">
                    Credit Score Management
                  </h4>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    CIBIL Fix & Dispute Bureau Advisory
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-extrabold text-[#217044] group-hover:translate-x-1.5 transition-transform">
                  <span>Explore Service</span>
                  <FiArrowRight size={14} />
                </div>
              </div>
            </Link>

            {/* Financial Consultancy */}
            <Link href="/dashboard/finance" className="block group h-full">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:border-[#217044] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full min-h-[190px] active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 rounded-2xl bg-[#217044]/10 text-[#217044] border border-[#217044]/20 group-hover:bg-[#217044] group-hover:text-white transition-all shadow-xs">
                    <FiBriefcase size={22} />
                  </span>
                  <span className="text-xs font-black text-[#217044] bg-[#217044]/10 px-3 py-1 rounded-xl font-mono">
                    03
                  </span>
                </div>
                
                <div className="space-y-1.5 pt-4">
                  <h4 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight group-hover:text-[#217044] transition-colors leading-snug">
                    Financial Consultancy
                  </h4>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    Strategic Business Advisory & Planning
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-extrabold text-[#217044] group-hover:translate-x-1.5 transition-transform">
                  <span>Explore Service</span>
                  <FiArrowRight size={14} />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* ─── 3. BOTTOM CTA BANNER ─── */}
        <section className="relative overflow-hidden bg-[#052516] text-white p-6 sm:p-8 rounded-3xl border border-emerald-950 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full border border-[#217044]/30 pointer-events-none -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#217044]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#f3c251]">
              NEED ASSISTANCE?
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
              Start With Clarity. Connect via WhatsApp.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              Connect with our Bilaspur consulting team for title checks, pre-underwriting dossiers, and institutional debt consulting at +91 9575959137.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919575959137"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-[#f3c251] hover:bg-[#e4b443] text-[#052516] font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <FaWhatsapp size={16} /> WhatsApp Us Now
            </a>
          </div>
        </section>

      </div>

      {/* Floating Action Button (1 Click: WhatsApp | Double Click: Admin Login) */}
      <div className="fixed md:right-8 md:bottom-8 right-5 bottom-20 z-50 font-sans flex flex-col items-end">
        <button 
          onClick={handleSupportIconClick} 
          title="Single click: Open WhatsApp (+91 9575959137) | Double click: Admin Login"
          className="h-14 w-14 bg-[#217044] hover:bg-[#185332] text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-emerald-300/60 transform active:scale-90 transition-all cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <FaWhatsapp className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 text-white" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        </button>
      </div>

    </div>
  );
}