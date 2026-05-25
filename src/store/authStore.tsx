import React, { useEffect, useState } from "react";
import { AuthContext, type AuthContextType, type User } from "./authContext";
import { isTokenExpired } from "@/utils/token";
import { getProfile } from "@/api/auth.api";

export type { User, AuthContextType } from "./authContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("token");
      if (!stored || isTokenExpired(stored)) {
        localStorage.removeItem("token");
        return null;
      }
      return stored;
    } catch {
      return null;
    }
  });

  const [user, setUserState] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await getProfile();
          setUserState(profile);
        } catch {
          logout();
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    } catch {
      // ignore localStorage errors
    }
  }, [token]);

  const login = (newToken: string, newUser: User | null = null) => {
    setToken(newToken);
    setUserState(newUser);
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
  };

  const setUser = (u: User | null) => {
    setUserState(u);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    setUser,
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-12 animate-spin rounded-full border-4 border-primary-60 border-t-transparent" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;