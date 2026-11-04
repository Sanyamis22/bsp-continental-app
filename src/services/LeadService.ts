import { LeadRepository, type NewContact } from "@/repositories/LeadRepository";
import { PricingService } from "@/services/PricingService";
import { badRequest } from "@/lib/errors";

export const LeadService = {
  /** The price is always read server-side from PricingService; the caller never supplies an amount. */
  async submitInquiry(input: { name: string; phone: string; email: string; service: string; message: string }) {
    const amount = await PricingService.priceForService(input.service);
    if (amount === null) throw badRequest("Unknown service.");
    return LeadRepository.createInquiry({ ...input, amount });
  },

  submitContact(input: NewContact) {
    return LeadRepository.createContact(input);
  },

  listAll() {
    return LeadRepository.listAll();
  },
};
