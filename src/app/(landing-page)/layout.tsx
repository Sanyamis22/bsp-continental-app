import type { ReactNode } from "react";
import LandingNavbar from "@/components/landing-page/LandingNavbar";
import Footer from "@/components/landing-page/Footer";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen bg-slate-50 pt-24">{children}</main>
      <Footer />
    </>
  );
}
