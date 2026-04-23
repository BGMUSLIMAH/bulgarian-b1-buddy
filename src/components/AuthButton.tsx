// Navbar Sign In button / logged-in user pill with logout.
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";

export function AuthButton() {
  const { user, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">…</span>;
  }

  if (user) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-xs">
        <span className="max-w-[140px] truncate font-medium" title={user.email ?? ""}>
          {user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground"
          title="Sign out"
        >
          ↩
        </button>
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Sign In
      </button>
      <AuthModal open={open} onOpenChange={setOpen} />
    </>
  );
}
