import React, { createContext, useContext, useEffect, useState } from 'react'

// Minimal User shape for the auth store. This will be centralized in `src/types` later.
export interface User {
  id: string
  name?: string
  email?: string
  role?: 'user' | 'admin' | string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user?: User | null) => void
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token')
    } catch (e) {
      return null
    }
  })

  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    } catch (e) {
      // ignore localStorage errors
    }
  }, [token])

  const login = (newToken: string, newUser: User | null = null) => {
    setToken(newToken)
    setUserState(newUser)
  }

  const logout = () => {
    setToken(null)
    setUserState(null)
    try {
      localStorage.removeItem('token')
    } catch (e) {
      // ignore
    }
  }

  const setUser = (u: User | null) => {
    setUserState(u)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthStore(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthStore must be used within an AuthProvider')
  return ctx
}

export default AuthProvider
