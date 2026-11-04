import connectDB from "@/lib/db";
import User from "@/models/User";

export const UserRepository = {
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
