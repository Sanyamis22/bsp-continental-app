import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({ listAll: vi.fn(), upsert: vi.fn() }));
vi.mock("@/repositories/PriceRepository", () => ({ PriceRepository: repo }));

import { PricingService } from "@/services/PricingService";

beforeEach(() => {
  repo.listAll.mockReset().mockResolvedValue([]);
  repo.upsert.mockReset().mockResolvedValue({});
});

describe("PricingService", () => {
  it("falls back to catalog defaults until a price is saved", async () => {
    const list = await PricingService.list();
    expect(list.map((p) => [p.slug, p.amountInr])).toEqual([
      ["property-compliance", 1599],
      ["cibil-management", 996],
      ["financial-consulting", 5999],
    ]);
  });

  it("uses the saved price over the default", async () => {
    repo.listAll.mockResolvedValue([{ slug: "property-compliance", amountInr: 2499, updatedBy: "admin", updatedAt: new Date() }]);
    expect(await PricingService.priceForService("Property Compliance")).toBe(2499);
    expect(await PricingService.priceForService("CIBIL Score Management")).toBe(996);
  });

  it("returns null for an unknown service", async () => {
    expect(await PricingService.priceForService("Free Stuff")).toBeNull();
  });

  it.each([0, -5, 1.5, 1_000_001, Number.NaN])("rejects invalid price %s", async (bad) => {
    await expect(PricingService.update("property-compliance", bad, "admin")).rejects.toMatchObject({ status: 400 });
    expect(repo.upsert).not.toHaveBeenCalled();
  });

  it("rejects an unknown service slug", async () => {
    await expect(PricingService.update("nope", 100, "admin")).rejects.toMatchObject({ status: 400 });
  });

  it("saves a valid price and records who changed it", async () => {
    await PricingService.update("cibil-management", 1200, "admin@x.com");
    expect(repo.upsert).toHaveBeenCalledWith("cibil-management", 1200, "admin@x.com");
  });
});
