export type UserRole = "guest" | "user" | "admin";

export type UserStatus = "active" | "suspended" | "pending_verification";

export interface UserPreferences {
  notificationsEnabled?: boolean;
  marketingOptIn?: boolean;
  preferredCurrency?: string;
  preferredLanguage?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole | string;
  status?: UserStatus;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User | null;
}