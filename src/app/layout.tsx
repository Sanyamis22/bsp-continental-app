import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NextAuthProvider from "../providers/NextAuthProvider"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BSP CCONTINENTAL PVT LTD | Financial & Property Compliance Services",
  description: "BSP CCONTINENTAL PVT LTD is a next generation financial consultancy & property compliance service provider dedicated to investors or loan applicants to secure financial and property related decisions.",
  keywords: [
    "BSP CCONTINENTAL",
    "Financial Consultancy",
    "Property Compliance",
    "Credit Score Management",
    "Loan Readiness",
    "Property Verification",
    "Chhattisgarh Property Vetting"
  ],
  openGraph: {
    title: "BSP CCONTINENTAL PVT LTD | Financial & Property Compliance Services",
    description: "BSP CCONTINENTAL PVT LTD is a next generation financial consultancy & property compliance service provider dedicated to investors or loan applicants to secure financial and property related decisions.",
    siteName: "BSP CCONTINENTAL PVT LTD",
    images: [
      {
        url: "/images/Bsp Ccontinental financial logo PNG (1).png",
        width: 1200,
        height: 630,
        alt: "BSP CCONTINENTAL Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BSP CCONTINENTAL PVT LTD | Financial & Property Compliance Services",
    description: "BSP CCONTINENTAL PVT LTD is a next generation financial consultancy & property compliance service provider dedicated to investors or loan applicants to secure financial and property related decisions.",
    images: ["/images/Bsp Ccontinental financial logo PNG (1).png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "light" }} 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth bg-slate-50`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}