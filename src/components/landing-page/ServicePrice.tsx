"use client";

import { formatInr, useServicePrices } from "@/hooks/useServicePrices";

/** Live price for a service. Shows a placeholder until loaded; never a stale hardcoded number. */
export default function ServicePrice({ slug, suffix = "", className }: { slug: string; suffix?: string; className?: string }) {
  const prices = useServicePrices();
  const amount = prices?.[slug];

  if (amount === undefined) {
    return <span className={className} aria-busy="true">₹ ···</span>;
  }
  return <span className={className}>{formatInr(amount)}{suffix}</span>;
}
