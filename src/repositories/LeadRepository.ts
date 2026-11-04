import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import Contact from "@/models/Contact";

export interface NewInquiry {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  amount: number;
}

export interface NewContact {
  name: string;
  phone: string;
  service: string;
  city: string;
  preferredContact: string;
  message: string;
}

export const LeadRepository = {
  async createInquiry(input: NewInquiry) {
    await connectDB();
    return Inquiry.create({ ...input, paymentStatus: "Pending" });
  },

  async createContact(input: NewContact) {
    await connectDB();
    return Contact.create(input);
  },

  async listAll() {
    await connectDB();
    const [inquiries, contacts] = await Promise.all([
      Inquiry.find({}).sort({ createdAt: -1 }),
      Contact.find({}).sort({ createdAt: -1 }),
    ]);
    return { inquiries, contacts };
  },

  async findInquiry(id: string) {
    await connectDB();
    return Inquiry.findById(id);
  },

  async findInquiryByOrder(id: string, orderId: string) {
    await connectDB();
    return Inquiry.findOne({ _id: id, orderId });
  },
};
