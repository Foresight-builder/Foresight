"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextValue {
  user: { id: string; email: string | null } | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // 初始化会话
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setError(error.message);
      }
      const sessUser = data?.session?.user || null;
      setUser(sessUser ? { id: sessUser.id, email: sessUser.email } : null);
      setLoading(false);
    });

    // 监听会话变化
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessUser = session?.user || null;
      setUser(sessUser ? { id: sessUser.id, email: sessUser.email } : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    setError(null);
    try {
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    }
  };

  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    user,
    loading,
    error,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}