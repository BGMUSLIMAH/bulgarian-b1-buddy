// Sign In / Sign Up / Forgot password modal.
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup" | "forgot";

export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { signIn, signUp, resetPassword, enabled } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
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
      } else {
        const { error } = await resetPassword(email);
        if (error) setErr(error);
        else setMsg("Password reset email sent.");
      }
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "login" ? "Sign In" : mode === "signup" ? "Create account" : "Reset password";

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
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {mode !== "forgot" && (
            <Input
              type="password"
              placeholder="Password"
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
          {mode !== "login" && (
            <button type="button" onClick={() => { reset(); setMode("login"); }} className="hover:text-foreground underline">
              Have an account? Sign in
            </button>
          )}
          {mode !== "signup" && (
            <button type="button" onClick={() => { reset(); setMode("signup"); }} className="hover:text-foreground underline">
              Create account
            </button>
          )}
          {mode !== "forgot" && (
            <button type="button" onClick={() => { reset(); setMode("forgot"); }} className="hover:text-foreground underline">
              Forgot password?
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
