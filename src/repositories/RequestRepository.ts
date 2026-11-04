import connectDB from "@/lib/db";
import Request from "@/models/Request";
import type { CreateRequestInput, RequestStatus } from "@/types/request";

export const RequestRepository = {
  async list(filter: { userEmail?: string }) {
    await connectDB();
    return Request.find(filter).sort({ createdAt: -1 });
  },

  async create(input: CreateRequestInput & { userName: string; userEmail: string }) {
    await connectDB();
    return Request.create({ ...input, userPhone: input.userPhone ?? "", status: "Pending" });
  },

  async applyDecision(
    id: string,
    update: {
      status: RequestStatus;
      adminReply?: { message: string; document: { name?: string; url?: string }; updatedAt: Date };
    }
  ) {
    await connectDB();
    return Request.findByIdAndUpdate(id, update, { new: true });
  },
};
