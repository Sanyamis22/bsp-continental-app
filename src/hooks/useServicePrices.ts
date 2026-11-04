"use client";

import { usePrices } from "@/hooks/queries";
import type { ServicePriceDTO } from "@/types/pricing";

type PriceMap = Record<string, number>;

function toMap(data: ServicePriceDTO[] | undefined): PriceMap | null {
  if (!data) return null;
  return Object.fromEntries(data.map((p) => [p.slug, p.amountInr]));
}

/**
 * Live service prices keyed by slug, or null while loading / on failure.
 * Callers must render a placeholder for null instead of a guessed number.
 */
export function useServicePrices(): PriceMap | null {
  const { data, isError } = usePrices();
  if (isError) return null;
  return toMap(data);
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
