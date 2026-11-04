export type UserRole = "user" | "admin";

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole | string;
  createdAt?: string;
  totalRequests?: number;
  status?: string;
}

export interface ProfileDTO {
  email: string;
  phone?: string;
  panCard?: string;
  identificationNo?: string;
}
