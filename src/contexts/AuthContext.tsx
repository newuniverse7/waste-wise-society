import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/data/types";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  society: string;
  flat: string;
  phone: string;
  avatar_url: string | null;
  points: number;
  carbon_saved: number;
}

export interface AuthSnapshot {
  isAuthenticated: boolean;
  loading: boolean;
  role: UserRole;
  userId: string;
  userName: string;
  email: string;
  profile: Profile | null;
}

interface AuthContextType {
  auth: AuthSnapshot;
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  const loadProfileAndRole = async (uid: string) => {
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((prof as Profile) ?? null);
    if (roles && roles.length > 0) {
      const priority: UserRole[] = ["admin", "worker", "user"];
      const found = priority.find((p) => roles.some((r: { role: string }) => r.role === p));
      setRole(found ?? "user");
    } else {
      setRole("user");
    }
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // defer to avoid deadlocks
        setTimeout(() => loadProfileAndRole(sess.user.id), 0);
      } else {
        setProfile(null);
        setRole("user");
      }
    });

    // Then fetch existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        loadProfileAndRole(sess.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user?.id) await loadProfileAndRole(user.id);
  };

  const auth: AuthSnapshot = {
    isAuthenticated: !!session,
    loading,
    role,
    userId: user?.id ?? "",
    userName: profile?.full_name || user?.email?.split("@")[0] || "",
    email: user?.email ?? "",
    profile,
  };

  return (
    <AuthContext.Provider value={{ auth, session, user, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
