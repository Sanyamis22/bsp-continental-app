import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/UserRepository";
import { badRequest, notFound } from "@/lib/errors";

const BCRYPT_COST = 12;

export const AuthService = {
  /** Throws if the phone or email already belongs to an account. */
  async assertRegistrable(phone: string, email: string): Promise<void> {
    if (await UserRepository.findByPhoneOrEmail(phone, email)) {
      throw badRequest("This mobile number or email is already registered. Please sign in.");
    }
  },

  async register(input: { name: string; email: string; phone: string; password: string }) {
    if (await UserRepository.findByPhone(input.phone)) {
      throw badRequest("This mobile number is already registered. Please sign in.");
    }
    return UserRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash: await bcrypt.hash(input.password, BCRYPT_COST),
    });
  },

  /** Throws unless a password-reset is possible for this phone (account exists and has a password). */
  async assertResettable(phone: string): Promise<void> {
    const user = await UserRepository.findByPhone(phone);
    if (!user) throw notFound("No account found associated with this mobile number. Please sign up first.");
    if (!user.password) {
      throw badRequest("This account was registered using Google Authentication. Password reset is not supported.");
    }
  },

  async resetPassword(phone: string, newPassword: string): Promise<void> {
    const updated = await UserRepository.setPasswordByPhone(phone, await bcrypt.hash(newPassword, BCRYPT_COST));
    if (!updated) throw notFound("User account not found.");
  },
};
