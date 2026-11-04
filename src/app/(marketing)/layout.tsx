import type { ReactNode } from "react";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen bg-slate-50 pt-24">{children}</main>
      <Footer />
    </>
  );
}
