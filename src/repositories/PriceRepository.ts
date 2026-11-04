import connectDB from "@/lib/db";
import ServicePrice from "@/models/ServicePrice";

export const PriceRepository = {
  async listAll() {
    await connectDB();
    return ServicePrice.find({}).lean();
  },

  async upsert(slug: string, amountInr: number, updatedBy: string) {
    await connectDB();
    return ServicePrice.findOneAndUpdate(
      { slug },
      { $set: { amountInr, updatedBy } },
      { new: true, upsert: true, runValidators: true }
    ).lean();
  },
};
