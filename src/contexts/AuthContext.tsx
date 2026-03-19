import React, { createContext, useContext, useState, ReactNode } from "react";
import { AuthState, UserRole } from "@/data/types";

interface AuthContextType {
  auth: AuthState;
  login: (role: UserRole, userId: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    role: "user",
    userId: "",
    userName: "",
  });

  const login = (role: UserRole, userId: string, userName: string) => {
    setAuth({ isAuthenticated: true, role, userId, userName });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: "user", userId: "", userName: "" });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
