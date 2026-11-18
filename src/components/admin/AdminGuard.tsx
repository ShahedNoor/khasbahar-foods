"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { isAdmin } from "@/lib/data";
import { auth, firebaseReady } from "@/lib/firebase";

type State = "loading" | "signedOut" | "denied" | "ok";

const NAV = [
  { href: "/admin", label: "Overview", icon: "◆" },
  { href: "/admin/products", label: "Products", icon: "❖" },
  { href: "/admin/delivery", label: "Delivery charges", icon: "➤" },
  { href: "/admin/orders", label: "Orders", icon: "☰" },
];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(firebaseReady ? "loading" : "signedOut");
  const [user, setUser] = useState<User | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(auth(), async (u) => {
      setUser(u);
      if (!u) return setState("signedOut");
      try {
        setState((await isAdmin(u.email)) ? "ok" : "denied");
      } catch {
        setState("denied");
      }
    });
  }, []);

  if (!firebaseReady) return <SetupNeeded />;
  if (state === "loading") return <Centered><p className="text-cream/60">Loading…</p></Centered>;
  if (state === "signedOut") return <Login />;
  if (state === "denied")
    return (
      <Centered>
        <p className="font-display text-3xl">No admin access</p>
        <p className="max-w-sm text-sm text-cream/65">
          {user?.email} is signed in but isn&apos;t on the admin list. Add a document with this email as its ID to the
          <code className="mx-1 rounded bg-cream/10 px-1.5">admins</code> collection in Firestore.
        </p>
        <button onClick={() => signOut(auth())} className="rounded-full border border-cream/30 px-5 py-2 text-sm">Sign out</button>
      </Centered>
    );

  return (
    <div className="min-h-dvh bg-cream text-forest md:grid md:grid-cols-[250px_1fr]">
      <aside className="jali flex flex-col bg-forest text-cream md:sticky md:top-0 md:h-dvh">
        <div className="flex items-center gap-3 px-5 py-6">
          <LogoMark className="h-11" />
          <div className="leading-none">
            <p className="font-caps text-sm tracking-[0.18em] text-gold">KHASBAHAR</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-cream/50">Admin</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map((n) => {
            const on = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${on ? "bg-cream text-forest" : "text-cream/75 hover:bg-cream/10"}`}>
                <span className={on ? "text-gold" : "text-gold/70"}>{n.icon}</span>{n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden space-y-2 px-5 py-6 text-xs text-cream/55 md:block">
          <p className="truncate">{user?.email}</p>
          <div className="flex gap-3">
            <Link href="/" className="underline-offset-4 hover:text-gold hover:underline">View shop ↗</Link>
            <button onClick={() => signOut(auth())} className="underline-offset-4 hover:text-gold hover:underline">Sign out</button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="jali flex min-h-dvh flex-col items-center justify-center gap-5 bg-forest px-4 text-center text-cream">
      <LogoMark className="h-20" />
      {children}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(auth(), new GoogleAuthProvider());
    } catch {
      setError("Google sign-in was cancelled or failed.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth(), email.trim(), password);
    } catch {
      setError("Wrong email or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Centered>
      <div>
        <p className="font-caps text-xl tracking-[0.2em] text-gold">KHASBAHAR FOODS</p>
        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-cream/50">Admin sign in</p>
      </div>
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-[1.75rem] bg-cream p-6 text-left text-forest">
        <button type="button" onClick={google} disabled={busy} className="flex w-full items-center justify-center gap-3 rounded-full border border-forest/20 bg-white py-3 font-medium transition hover:border-forest disabled:opacity-60">
          <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continue with Google
        </button>
        <div className="flex items-center gap-3 py-1 text-xs text-forest/45"><span className="h-px flex-1 bg-forest/15" />or with email<span className="h-px flex-1 bg-forest/15" /></div>
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="text-sm text-gold">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-forest py-3 font-medium text-cream disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </Centered>
  );
}

function SetupNeeded() {
  return (
    <Centered>
      <p className="font-display text-4xl">Connect Firebase first</p>
      <ol className="max-w-lg list-decimal space-y-2 pl-5 text-left text-sm leading-relaxed text-cream/75">
        <li>Create a project at console.firebase.google.com and add a <b>Web app</b>.</li>
        <li>Copy <code className="rounded bg-cream/10 px-1">.env.example</code> to <code className="rounded bg-cream/10 px-1">.env.local</code> and paste the config values.</li>
        <li>Enable <b>Authentication → Google</b> (and Email/Password if needed).</li>
        <li>Create <b>Firestore</b>, publish <code className="rounded bg-cream/10 px-1">firestore.rules</code>, and add a document in <code className="rounded bg-cream/10 px-1">admins</code> whose ID is each admin&apos;s email.</li>
        <li>Restart <code className="rounded bg-cream/10 px-1">npm run dev</code>.</li>
      </ol>
      <p className="text-xs text-cream/50">Full steps are in README.md.</p>
    </Centered>
  );
}
