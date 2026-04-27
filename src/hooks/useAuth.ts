import { useCallback } from "react";
import axiosClient from "@/api/axiosClient";
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
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/validation/auth.schemas";

export function useAuth() {
  const store = useAuthStore();

  /**
   * Sign in: get token → attach to axios → fetch profile → store both.
   * Pages call this only — never touch auth.api.ts directly.
   */
  const signIn = useCallback(
    async (credentials: LoginFormValues) => {
      const { access_token } = await apiLogin(credentials);
      // Set header directly so /auth/me is authenticated immediately
      // (store.login is async state update — localStorage may not be ready in time)
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      const user = await getProfile();
      store.login(access_token, user);
    },
    [store],
  );

  /**
   * Register: creates account only.
   * Does NOT auto-login — backend requires email verification first.
   */
  const signUp = useCallback(
    async (payload: Omit<RegisterFormValues, "confirmPassword">) => {
      return await apiRegister(payload);
    },
    [],
  );

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

  const sendForgotPassword = useCallback(
    async (payload: ForgotPasswordFormValues) => {
      return await apiForgotPassword(payload);
    },
    [],
  );

  const sendResetPassword = useCallback(
    async (payload: Omit<ResetPasswordFormValues, "confirmPassword">) => {
      return await apiResetPassword(payload);
    },
    [],
  );

  const sendResendVerification = useCallback(async (email: string) => {
    return await apiResendVerification(email);
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