import { useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse, User } from "@/types";

export function useAuth() {
  const store = useAuthStore();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = (await apiLogin({ email, password })) as AuthResponse;
      if (res?.token) {
        store.login(res.token, res.user);
      }
      return res;
    },
    [store],
  );

  const signUp = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const res = (await apiRegister(payload)) as AuthResponse;
      if (res?.token) {
        store.login(res.token, res.user);
      }
      return res;
    },
    [store],
  );

  const fetchProfile = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await getProfile();
      store.setUser(profile);
      return profile;
    } catch (err) {
      return null;
    }
  }, [store]);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    logout: store.logout,
    setUser: store.setUser,
    signIn,
    signUp,
    fetchProfile,
  };
}

export default useAuth;
