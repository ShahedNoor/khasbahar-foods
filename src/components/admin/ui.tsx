export function PageHead({ title, bn, children }: { title: string; bn?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {bn && <p className="mt-1 font-bangla text-forest/55">{bn}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Stat({ label, value, hint, tone = "light" }: { label: string; value: string; hint?: string; tone?: "light" | "dark" | "gold" }) {
  const cls = tone === "dark" ? "bg-forest text-cream" : tone === "gold" ? "bg-gold text-forest" : "bg-white/60 border border-forest/10";
  return (
    <div className={`rounded-[1.5rem] p-5 ${cls}`}>
      <p className={`text-xs uppercase tracking-[0.15em] ${tone === "light" ? "text-forest/55" : "opacity-70"}`}>{label}</p>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
      {hint && <p className={`mt-2 text-xs ${tone === "light" ? "text-forest/55" : "opacity-70"}`}>{hint}</p>}
    </div>
  );
}

export function Btn({ children, variant = "primary", className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "gold" | "danger" }) {
  const v = {
    primary: "bg-forest text-cream hover:bg-forest-deep",
    gold: "bg-gold text-forest hover:brightness-105",
    ghost: "border border-forest/20 hover:border-forest hover:bg-forest/5",
    danger: "border border-forest/20 text-forest/70 hover:border-forest hover:text-forest",
  }[variant];
  return (
    <button {...rest} className={`rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${v} ${className}`}>
      {children}
    </button>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gold/60 bg-gold/10 px-5 py-4 text-sm">{children}</div>;
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${on ? "bg-forest" : "bg-forest/20"}`}
    >
      <span className={`inline-block size-5 rounded-full bg-cream shadow transition ${on ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </button>
  );
}
