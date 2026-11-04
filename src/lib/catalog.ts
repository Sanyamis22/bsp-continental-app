/**
 * The sellable services and their STARTING prices.
 * Live prices are stored in Mongo and edited from the super admin panel (see PricingService);
 * these defaults only apply until a price has been saved for that service.
 */
export const SERVICE_CATALOG = [
  { slug: "property-compliance", name: "Property Compliance", defaultAmountInr: 1599 },
  { slug: "cibil-management", name: "CIBIL Score Management", defaultAmountInr: 996 },
  { slug: "financial-consulting", name: "Financial Consultancy", defaultAmountInr: 5999 },
] as const;

export type ServiceSlug = (typeof SERVICE_CATALOG)[number]["slug"];

export const MIN_PRICE_INR = 1;
export const MAX_PRICE_INR = 1_000_000;
