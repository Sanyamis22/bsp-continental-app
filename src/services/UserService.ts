import { UserRepository } from "@/repositories/UserRepository";
import { RequestRepository } from "@/repositories/RequestRepository";
import type { UserDTO } from "@/types/user";

export const UserService = {
  /** Registered users with how many requests each has submitted (admin directory). */
  async listForAdmin(): Promise<UserDTO[]> {
    const [users, counts] = await Promise.all([UserRepository.listForAdmin(), RequestRepository.countsByEmail()]);
    return users.map((u) => ({
      _id: String(u._id),
      name: u.name,
      email: u.email,
      phone: u.phone || undefined,
      role: u.role || "user",
      createdAt: u.createdAt?.toISOString(),
      totalRequests: counts.get(u.email) ?? 0,
    }));
  },
};
