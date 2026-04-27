import { useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  resendVerification as apiResendVerification,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  LoginCredentials,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ResendVerificationPayload,
} from "@/types/auth.types";

export function useAuth() {
  const store = useAuthStore();

  /**
   * Sign in: get token → attach to store → fetch profile → update store.
   * Pages call this only — never touch auth.api.ts directly.
   */
  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      const { access_token } = await apiLogin(credentials);

      // Temporarily store token so axiosClient interceptor sends it with /auth/me
      store.login(access_token, null);

      const user = await getProfile();
      store.login(access_token, user);
    },
    [store],
  );

  /**
   * Register: creates account only.
   * Does NOT auto-login — backend requires email verification first.
   */
  const signUp = useCallback(async (payload: RegisterPayload) => {
    return await apiRegister(payload);
  }, []);

  /**
   * Logout: clears token + user from store and localStorage.
   */
  const signOut = useCallback(() => {
    store.logout();
  }, [store]);

  /**
   * Refresh stored user profile from server.
   * Useful after profile edits.
   */
  const refreshProfile = useCallback(async () => {
    const user = await getProfile();
    store.setUser(user);
  }, [store]);

  const sendForgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    return await apiForgotPassword(payload);
  }, []);

  const sendResetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    return await apiResetPassword(payload);
  }, []);

  const sendResendVerification = useCallback(async (payload: ResendVerificationPayload) => {
    return await apiResendVerification(payload);
  }, []);

  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,

    // Actions
    signIn,
    signOut,
    signUp,
    refreshProfile,
    sendForgotPassword,
    sendResetPassword,
    sendResendVerification,
  };
}

export default useAuth;