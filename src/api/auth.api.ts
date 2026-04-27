import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { User } from "@/types";
import type {
  LoginCredentials,
  RegisterPayload,
  TokenResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ResendVerificationPayload,
  MessageResponse,
} from "@/types/auth.types";

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  try {
    const res = await axiosClient.post<TokenResponse>("/auth/login", credentials);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function register(payload: RegisterPayload): Promise<User> {
  try {
    const res = await axiosClient.post<User>("/auth/register", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function getProfile(): Promise<User> {
  try {
    const res = await axiosClient.get<User>("/auth/me");
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/forgot-password", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/reset-password", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export async function resendVerification(payload: ResendVerificationPayload): Promise<MessageResponse> {
  try {
    const res = await axiosClient.post<MessageResponse>("/auth/resend-verification", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}