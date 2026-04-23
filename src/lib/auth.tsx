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
import { loadStats } from "./store";

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

const MIGRATED_KEY = "btb1_migrated_to_supabase_v1";

async function migrateLocalProgress(userId: string) {
  if (!supabase) return;
  try {
    if (localStorage.getItem(MIGRATED_KEY) === userId) return;
    const stats = loadStats();
    // Upsert one row of progress
    await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        correct: stats.correct,
        wrong: stats.wrong,
        xp: stats.xp,
        streak_days: stats.streakDays,
        last_practice_date: stats.lastPracticeDate,
        per_word: stats.perWord,
        per_category: stats.perCategory,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (stats.evaluations.length > 0) {
      await supabase.from("evaluation_results").insert(
        stats.evaluations.map((e) => ({
          user_id: userId,
          date: e.date,
          score: e.score,
          total: e.total,
          level: e.level,
        })),
      );
    }
    localStorage.setItem(MIGRATED_KEY, userId);
  } catch (err) {
    // Don't block auth flow on migration errors — table columns may differ.
    console.warn("Progress migration skipped:", err);
  }
}

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
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer migration to avoid blocking the listener callback
        setTimeout(() => migrateLocalProgress(sess.user.id), 0);
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
    // Safe default for SSR / before provider mounts
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
