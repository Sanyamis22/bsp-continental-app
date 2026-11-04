import { ProfileRepository } from "@/repositories/ProfileRepository";

export interface ProfileView {
  phone: string;
  panCard: string;
  identificationNo: string;
}

export interface ProfileUpdate {
  phone: string;
  panCard: string;
  identificationNo: string;
}

const key = (email: string) => email.toLowerCase().trim();

export const ProfileService = {
  async get(email: string): Promise<ProfileView> {
    const profile = await ProfileRepository.findByEmail(key(email));
    return {
      phone: profile?.phone || "",
      panCard: profile?.panCard || "",
      identificationNo: profile?.identificationNo || "",
    };
  },

  async update(email: string, input: ProfileUpdate): Promise<void> {
    await ProfileRepository.upsertByEmail(key(email), input);
  },
};
