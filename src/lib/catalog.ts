/** Server-side price list (INR). The client never decides what a service costs. */
export const SERVICE_PRICES_INR: Readonly<Record<string, number>> = {
  "CIBIL Score Management": 996,
  "Property Compliance": 1599,
  "Financial Consultancy": 5999,
};

export function priceForService(service: string): number | null {
  return Object.hasOwn(SERVICE_PRICES_INR, service) ? SERVICE_PRICES_INR[service] : null;
}
