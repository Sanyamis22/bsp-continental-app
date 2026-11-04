"use client";

import { useEffect, useState } from "react";
import type { ServicePriceDTO } from "@/types/pricing";

type PriceMap = Record<string, number>;

let inflight: Promise<PriceMap> | null = null;

async function loadPrices(): Promise<PriceMap> {
  const res = await fetch("/api/prices", { cache: "no-store" });
  const json: { success?: boolean; data?: ServicePriceDTO[] } = await res.json();
  if (!res.ok || !json.data) throw new Error("Could not load prices.");
  return Object.fromEntries(json.data.map((p) => [p.slug, p.amountInr]));
}

/**
 * Live service prices keyed by slug, or null while loading / on failure.
 * Callers must render a placeholder for null instead of a guessed number.
 * ponytail: tiny fetch hook — replace with a TanStack Query hook in Phase 3/4.
 */
export function useServicePrices(): PriceMap | null {
  const [prices, setPrices] = useState<PriceMap | null>(null);

  useEffect(() => {
    let active = true;
    inflight ??= loadPrices().finally(() => {
      inflight = null;
    });
    inflight.then((map) => active && setPrices(map)).catch(() => active && setPrices(null));
    return () => {
      active = false;
    };
  }, []);

  return prices;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
