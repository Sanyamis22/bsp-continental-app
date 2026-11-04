import { PriceRepository } from "@/repositories/PriceRepository";
import { MAX_PRICE_INR, MIN_PRICE_INR, SERVICE_CATALOG } from "@/lib/catalog";
import { badRequest } from "@/lib/errors";
import type { ServicePriceDTO } from "@/types/pricing";

/** Single source of truth for what each service costs: Mongo override, else catalog default. */
export const PricingService = {
  async list(): Promise<ServicePriceDTO[]> {
    const saved = new Map((await PriceRepository.listAll()).map((p) => [p.slug, p]));
    return SERVICE_CATALOG.map((service) => {
      const row = saved.get(service.slug);
      return {
        slug: service.slug,
        name: service.name,
        amountInr: row?.amountInr ?? service.defaultAmountInr,
        updatedAt: row?.updatedAt?.toISOString(),
        updatedBy: row?.updatedBy || undefined,
      };
    });
  },

  /** Price for a service by its display name (what the inquiry form sends); null if unknown. */
  async priceForService(name: string): Promise<number | null> {
    const match = (await PricingService.list()).find((p) => p.name === name);
    return match ? match.amountInr : null;
  },

  async update(slug: string, amountInr: number, adminId: string): Promise<ServicePriceDTO> {
    if (!SERVICE_CATALOG.some((s) => s.slug === slug)) throw badRequest("Unknown service.");
    if (!Number.isInteger(amountInr) || amountInr < MIN_PRICE_INR || amountInr > MAX_PRICE_INR) {
      throw badRequest(`Price must be a whole number between ₹${MIN_PRICE_INR} and ₹${MAX_PRICE_INR.toLocaleString("en-IN")}.`);
    }
    await PriceRepository.upsert(slug, amountInr, adminId);
    const updated = (await PricingService.list()).find((p) => p.slug === slug);
    return updated as ServicePriceDTO;
  },
};
