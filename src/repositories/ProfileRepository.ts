import connectDB from "@/lib/db";
import Profile from "@/models/Profile";
import type { ProfileDTO } from "@/types/user";

export const ProfileRepository = {
  async findByEmail(email: string) {
    await connectDB();
    return Profile.findOne({ email });
  },

  async upsertByEmail(email: string, fields: Pick<ProfileDTO, "phone" | "panCard" | "identificationNo">) {
    await connectDB();
    return Profile.findOneAndUpdate(
      { email },
      { $set: fields },
      { new: true, upsert: true, runValidators: true }
    );
  },
};
