import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { User } from "@/types";
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/validation/auth.schemas";
import type { TokenResponse, MessageResponse } from "@/types/api.types";

export async function login(credentials: LoginFormValues): Promise<TokenResponse> {
  try {
    const res = await axiosClient.post<TokenResponse>("/auth/login", credentials);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function register(payload: Omit<RegisterFormValues, "confirmPassword">): Promise<User> {
  try {
    const res = await axiosClient.post<User>("/auth/register", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Special registration for Admins
 * POST /auth/admin/register
 */
export async function registerAdmin(payload: Omit<RegisterFormValues, "confirmPassword">): Promise<User> {
  try {
    const res = await axiosClient.post<User>("/auth/admin/register", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Get current user profile
 * GET /users/me (As per API spec)
 */
export async function getProfile(): Promise<User> {
  try {
    const res = await axiosClient.get<User>("/users/me");
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Update current user profile
 * PUT /users/me
 */
export async function updateProfile(payload: Partial<User>): Promise<User> {
  try {
    const res = await axiosClient.put<User>("/users/me", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function forgotPassword(payload: ForgotPasswordFormValues): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/forgot-password", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function resetPassword(payload: Omit<ResetPasswordFormValues, "confirmPassword">): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/reset-password", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function resendVerification(email: string): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/resend-verification", { email });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function verifyOtp(payload: { email: string; otp: string }): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/verify-otp", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function googleAuth(token: string, mode: "login" | "register" = "login"): Promise<TokenResponse> {
  try {
    const res = await axiosClient.post<TokenResponse>("/auth/google", { token, mode }); // 👈 add mode
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}