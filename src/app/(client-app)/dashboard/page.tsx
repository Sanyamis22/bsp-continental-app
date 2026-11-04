'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiGrid, FiShield, FiTrendingUp, FiZap } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WHATSAPP_URL = 'https://wa.me/919575959137';

const SLIDES = [
  {
    tag: 'CIBIL SCORE MANAGEMENT',
    title: 'IMPROVE YOUR CREDIT PROFILE',
    desc: 'CIBIL analysis, dispute support, and structured guidance.',
    img: '/images/Structured credit planning with expert guidance.png',
    link: '/dashboard/credit-score-management',
  },
  {
    tag: 'PROPERTY COMPLIANCE',
    title: 'PROTECT THE PROPERTY BEHIND YOUR LOAN',
    desc: 'Title verification, search & survey reports, and dispute audit.',
    img: '/images/Premiumproperty.png',
    link: '/dashboard/property-compliance',
  },
  {
    tag: 'FINANCIAL CONSULTING',
    title: 'FINANCIAL CLARITY & STRONGER DECISIONS',
    desc: 'Strategic guidance for secured loans, MSME capital, and DPR/CMA files.',
    img: '/images/Strategic Financial Guidance for Indian Businesses.png',
    link: '/dashboard/finance',
  },
];

const SERVICES = [
  { href: '/dashboard/property-compliance', title: 'Property Compliance', desc: 'Legal Verification & Document Registry Audit', icon: FiShield },
  { href: '/dashboard/credit-score-management', title: 'Credit Score Management', desc: 'CIBIL Fix & Dispute Bureau Advisory', icon: FiTrendingUp },
  { href: '/dashboard/finance', title: 'Financial Consultancy', desc: 'Strategic Business Advisory & Planning', icon: FiBriefcase },
];

export default function DashboardPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const go = (delta: number) => setCurrentSlide((prev) => (prev + delta + SLIDES.length) % SLIDES.length);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 md:p-8">
      <Card className="flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2.5 text-xl font-black tracking-tight uppercase sm:text-2xl">
            <span className="rounded-2xl bg-accent p-2 text-primary">
              <FiZap size={18} />
            </span>
            BSP Continental <span className="text-primary">Financial</span>
          </h1>
          <p className="text-xs font-semibold text-muted-foreground">
            Property Verification, Credit Score Advisory & Financial Consultants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline' })}>
            <FaWhatsapp className="text-emerald-600" /> WhatsApp Support
          </a>
          <Badge variant="success" className="hidden gap-2 uppercase sm:inline-flex">
            <span className="size-2 animate-pulse rounded-full bg-primary" /> Live desk
          </Badge>
        </div>
      </Card>

      <section aria-roledescription="carousel" aria-label="Featured services" className="group/slider space-y-2.5">
        <div className="relative overflow-hidden rounded-3xl bg-[#062415] shadow-lg">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {SLIDES.map((slide, index) => (
              <div key={slide.tag} className="relative aspect-[16/9] w-full shrink-0 overflow-hidden md:aspect-[980/260]" aria-hidden={index !== currentSlide}>
                <Image src={slide.img} alt={slide.title} fill sizes="(min-width: 1152px) 1152px, 100vw" priority={index === 0} className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent sm:bg-gradient-to-r sm:from-[#051f12] sm:via-[#051f12]/85 sm:to-transparent" />
                <div className="absolute inset-0 z-10 flex max-w-xl flex-col justify-end space-y-2 p-5 sm:justify-center sm:p-8">
                  <span className="flex items-center gap-2 font-mono text-[10px] font-black tracking-[0.2em] text-[#f3c251] sm:text-xs">
                    <span className="h-0.5 w-5 bg-[#f3c251]" /> {slide.tag}
                  </span>
                  <h2 className="text-base leading-tight font-black tracking-tight text-white uppercase sm:text-2xl md:text-3xl">{slide.title}</h2>
                  <p className="line-clamp-2 hidden text-sm font-medium text-emerald-100/90 sm:block">{slide.desc}</p>
                  <div className="pt-2">
                    <Link href={slide.link} tabIndex={index === currentSlide ? 0 : -1} className={cn(buttonVariants({ variant: 'accent' }), 'uppercase tracking-wider')}>
                      Explore module <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="ghost" size="icon" aria-label="Previous slide" onClick={() => go(-1)}
            className="absolute top-1/2 left-3 z-20 -translate-y-1/2 bg-black/40 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover/slider:opacity-100 hover:bg-black/70 hover:text-white focus-visible:opacity-100">
            <FiArrowLeft />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Next slide" onClick={() => go(1)}
            className="absolute top-1/2 right-3 z-20 -translate-y-1/2 bg-black/40 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover/slider:opacity-100 hover:bg-black/70 hover:text-white focus-visible:opacity-100">
            <FiArrowRight />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.tag}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={currentSlide === index}
              onClick={() => setCurrentSlide(index)}
              className={cn('h-2 cursor-pointer rounded-full transition-all duration-300', currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-border')}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 px-1 text-xs font-black tracking-widest text-muted-foreground uppercase">
          <FiGrid className="text-primary" /> Core advisory solutions
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Link key={service.href} href={service.href} className="group block h-full rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none">
              <Card className="h-full min-h-47.5 justify-between p-6 transition-all duration-300 group-hover:border-primary group-hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="rounded-2xl border border-primary/20 bg-accent p-3.5 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon size={22} />
                  </span>
                  <Badge variant="success" className="font-mono">{String(i + 1).padStart(2, '0')}</Badge>
                </div>
                <div className="space-y-1.5 pt-4">
                  <h3 className="text-base leading-snug font-black tracking-tight uppercase transition-colors group-hover:text-primary">{service.title}</h3>
                  <p className="text-xs font-semibold text-muted-foreground">{service.desc}</p>
                </div>
                <span className="flex items-center gap-2 pt-4 text-xs font-extrabold text-primary transition-transform group-hover:translate-x-1.5">
                  Explore service <FiArrowRight />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-3xl bg-[#052516] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">
        <div className="pointer-events-none absolute top-0 right-0 size-60 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative z-10 space-y-1.5">
          <span className="font-mono text-[11px] font-bold tracking-widest text-[#f3c251] uppercase">Need assistance?</span>
          <h3 className="text-lg font-black tracking-tight uppercase sm:text-xl">Start with clarity. Connect via WhatsApp.</h3>
          <p className="max-w-xl text-sm leading-relaxed text-emerald-100/80">
            Connect with our Bilaspur consulting team for title checks, pre-underwriting dossiers, and institutional debt consulting at +91 9575959137.
          </p>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'relative z-10 shrink-0 uppercase tracking-wider')}>
          <FaWhatsapp /> WhatsApp us now
        </a>
      </section>

      <a
        href={`${WHATSAPP_URL}?text=Hello%20BSP%20Continental,%20I%20need%20assistance%20with%20my%20loan/property%20file.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-5 bottom-20 z-50 flex size-14 items-center justify-center rounded-full border-2 border-emerald-300/60 bg-primary text-primary-foreground shadow-2xl transition-transform hover:bg-primary/90 active:scale-90 md:right-8 md:bottom-8"
      >
        <FaWhatsapp className="size-7" />
      </a>
    </div>
  );
}
