import connectDB from "@/lib/db";
import User from "@/models/User";

export const UserRepository = {
  /** Directory view for admins. The password hash is never selected. */
  async listForAdmin() {
    await connectDB();
    return User.find({}, "name email phone role createdAt").sort({ createdAt: -1 }).lean();
  },

  async findByPhone(phone: string) {
    await connectDB();
    return User.findOne({ phone });
  },

  async findByPhoneOrEmail(phone: string, email: string) {
    await connectDB();
    return User.findOne({ $or: [{ phone }, { email }] });
  },

  async create(input: { name: string; email: string; phone: string; passwordHash: string }) {
    await connectDB();
    return User.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.passwordHash,
      role: "user",
      hasReceivedTermsPdf: false,
    });
  },

  async setPasswordByPhone(phone: string, passwordHash: string) {
    await connectDB();
    return User.findOneAndUpdate({ phone }, { password: passwordHash });
  },
};
