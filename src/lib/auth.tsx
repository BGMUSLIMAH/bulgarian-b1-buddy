// Auth context — wraps Supabase auth state and exposes simple helpers.
// Guest mode: when not signed in, the rest of the app continues to use
// localStorage (via src/lib/store.ts) exactly as before.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseEnabled } from "./supabase";
import { syncFromSupabase } from "./store";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  enabled: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(supabaseEnabled);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    // Set up listener BEFORE getSession (per Supabase guidance)
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        // Defer to avoid blocking the listener callback.
        // syncFromSupabase pulls Supabase data, merges with localStorage,
        // and writes the winner back to both — fixing cross-device sync.
        setTimeout(() => syncFromSupabase(), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Auth not configured" };
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    return error ? { error: error.message } : {};
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Auth not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) return { error: "Auth not configured" };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      enabled: supabaseEnabled,
      signUp,
      signIn,
      resetPassword,
      signOut,
    }),
    [user, session, loading, signUp, signIn, resetPassword, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      session: null,
      loading: false,
      enabled: false,
      signUp: async () => ({ error: "Not ready" }),
      signIn: async () => ({ error: "Not ready" }),
      resetPassword: async () => ({ error: "Not ready" }),
      signOut: async () => {},
    };
  }
  return ctx;
}
