/** One sellable service whose price the super admin controls. */
export interface ServicePriceDTO {
  slug: string;
  name: string;
  /** Whole rupees. Razorpay receives amountInr * 100 paise. */
  amountInr: number;
  updatedAt?: string;
  updatedBy?: string;
}
