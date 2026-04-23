// Sign In / Sign Up / Forgot password modal.
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup" | "forgot" | "newpassword";

export function AuthModal({ open, onOpenChange, initialMode = "login" }: { open: boolean; onOpenChange: (o: boolean) => void; initialMode?: Mode }) {
  const { signIn, signUp, resetPassword, enabled } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function reset() {
    setMsg(null);
    setErr(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setErr(error);
        else onOpenChange(false);
      } else if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) setErr(error);
        else setMsg("Check your email to confirm your account.");
      } else if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) setErr(error);
        else setMsg("Password reset email sent.");
      } else if (mode === "newpassword") {
        const { error } = await supabase!.auth.updateUser({ password });
        if (error) setErr(error.message);
        else { setMsg("Password updated! You are now signed in."); onOpenChange(false); }
      }
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "login" ? "Sign In" : mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Set new password";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {enabled
              ? "Save progress across devices. Guest mode keeps working without an account."
              : "Auth not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode !== "newpassword" && (
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          )}
          {(mode === "login" || mode === "signup" || mode === "newpassword") && (
            <Input
              type="password"
              placeholder={mode === "newpassword" ? "New password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          )}
          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-primary">{msg}</p>}
          <Button type="submit" disabled={busy || !enabled} className="w-full">
            {busy ? "Please wait…" : title}
          </Button>
        </form>
        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          {mode !== "login" && mode !== "newpassword" && (
            <button type="button" onClick={() => { reset(); setMode("login"); }} className="hover:text-foreground underline">
              Have an account? Sign in
            </button>
          )}
          {mode !== "signup" && mode !== "newpassword" && (
            <button type="button" onClick={() => { reset(); setMode("signup"); }} className="hover:text-foreground underline">
              Create account
            </button>
          )}
          {mode !== "forgot" && mode !== "newpassword" && (
            <button type="button" onClick={() => { reset(); setMode("forgot"); }} className="hover:text-foreground underline">
              Forgot password?
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
