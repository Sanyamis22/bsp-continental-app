"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    tag: "PROPERTY COMPLIANCE",
    title: "SECURE YOUR PROPERTY\nBEFORE YOU INVEST.",
    description: "Certified legal checks.",
    primaryBtn: { text: "PROPERTY COMPLIANCE", href: "/services/property-compliance" },
    secondaryBtn: { text: "START A CONSULTATION", href: "/contact" },
    image: "/images/Premiumproperty.png",
  },
  {
    tag: "CIBIL SCORE MANAGEMENT",
    title: "FIX YOUR CIBIL &\nBOOST APPROVALS.",
    description: "Expert credit report audits.",
    primaryBtn: { text: "CIBIL MANAGEMENT", href: "/services/cibil-management" },
    secondaryBtn: { text: "REQUEST CONSULTATION", href: "/contact" },
    image: "/images/Structured credit planning with expert guidance.png",
  },
  {
    tag: "FINANCIAL CONSULTING",
    title: "SECURED FINANCING &\nEXPERT ADVISORY.",
    description: "Tailored capital structuring.",
    primaryBtn: { text: "FINANCIAL CONSULTING", href: "/services/financial-consulting" },
    secondaryBtn: { text: "TALK TO AN ADVISOR", href: "/contact" },
    image: "/images/Strategic Financial Guidance for Indian Businesses.png",
  },
  {
    tag: "PROJECT FINANCE ASSISTANCE",
    title: "BE LOAN-READY\nBEFORE YOU APPLY.",
    description: "Professional CMA & project reports.",
    primaryBtn: { text: "CHECK LOAN READINESS", href: "/services/loan-readiness" },
    secondaryBtn: { text: "START CONSULTATION", href: "/contact" },
    image: "/images/ReadywithaStrongLoanApplication.png",
  },
];

export default function HomeSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section 
      id="home" 
      className="relative w-full h-[88vh] min-h-[620px] max-h-[860px] bg-[#062415] text-white overflow-hidden select-none m-0 p-0 flex items-center"
    >
      {/* Background Image Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover object-[80%_center] sm:object-center lg:object-right"
          />
          {/* Readability Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 via-55% to-black/35 sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/90 sm:via-45% sm:to-transparent lg:to-black/35" />
        </motion.div>
      </AnimatePresence>

      {/* Ultra-Transparent Arrow Controls */}
      <div className="absolute inset-y-0 left-2 right-2 sm:left-6 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="pointer-events-auto w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/10 hover:bg-black/35 text-white/70 hover:text-white backdrop-blur-xs border border-white/10 flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <FiChevronLeft />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="pointer-events-auto w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/10 hover:bg-black/35 text-white/70 hover:text-white backdrop-blur-xs border border-white/10 flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center py-16 sm:py-20">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Category Header (Tag) - Ab aur bada kar diya hai */}
              <div className="flex items-center gap-3.5">
                <span className="w-10 sm:w-14 h-[3.5px] bg-[#f3c251]" />
                <span className="text-base sm:text-lg lg:text-xl font-mono font-black uppercase tracking-[0.3em] text-[#f3c251]">
                  {slide.tag}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white leading-[1.06] whitespace-pre-line drop-shadow-md">
                {slide.title}
              </h1>

              {/* Description - Bilkul chota aur compact */}
              <p className="text-xs sm:text-sm text-emerald-100/75 font-medium max-w-lg leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  href={slide.primaryBtn.href}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#f3c251] hover:bg-[#e4b443] text-[#062415] text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  {slide.primaryBtn.text}
                </Link>

                <Link
                  href={slide.secondaryBtn.href}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/40 hover:border-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 text-center backdrop-blur-xs"
                >
                  {slide.secondaryBtn.text}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}