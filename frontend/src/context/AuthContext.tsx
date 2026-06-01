"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (sessionToken: string, sessionUser: User) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "user";

const setSessionStorage = (token: string | null, user: User | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    setSessionStorage(null, null);
    delete api.defaults.headers.common.Authorization;
  };

  const normalizeUser = (user: any) => {
    const id = user.id || user._id;
    return {
      ...user,
      id,
      role: user.role?.toLowerCase(),
    };
  };

  const refreshProfile = async () => {
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null);
    if (!activeToken) return;

    try {
      const response = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      const profile = response.data?.data;
      if (profile) {
        const normalizedProfile = normalizeUser(profile);
        setUser(normalizedProfile);
        setSessionStorage(activeToken, normalizedProfile);
      }
    } catch {
      logout();
    }
  };

  const login = async (sessionToken: string, sessionUser: User) => {
    const normalizedUser = normalizeUser(sessionUser);
    setToken(sessionToken);
    setUser(normalizedUser);
    setSessionStorage(sessionToken, normalizedUser);
    api.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedUser = localStorage.getItem(AUTH_USER_KEY);

    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(normalizeUser(parsedUser));
        } catch {
          setUser(null);
        }
      }
      refreshProfile().finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      refreshProfile,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}
