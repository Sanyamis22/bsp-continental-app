"use client";

import HomeSection from "@/components/landing-page/HomeSection";
import AboutSection from "@/components/landing-page/AboutSection";
import ServicesSection from "@/components/landing-page/ServicesSection";
import HowItWorksSection from "@/components/landing-page/HowItWorksSection";
import WhyChooseSection from "@/components/landing-page/WhyChooseSection";
import ContactSection from "@/components/landing-page/ContactSection";
import { FaWhatsapp } from "react-icons/fa";

export default function LandingPage() {
  const whatsappUrl = "https://wa.me/919575059137?text=Hello%20BSP%20Continental,%20I%20need%20consulting%20support.";

  return (
    <div className="w-full bg-[#0A2615] selection:bg-[#217044] selection:text-white m-0 p-0 overflow-x-hidden">
      {/* Main Content */}
      <main className="w-full m-0 p-0 block bg-white">
        <HomeSection />
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <ContactSection />
      </main>


      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl sm:text-3xl shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/30"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
}