"use client";
import { useMemo, useState } from "react";
import { getProducts } from "@/lib/data";
import { useLoad } from "@/lib/useLoad";
import { ProductCard } from "./ProductCard";

export function Menu() {
  const { data: products, loading, error } = useLoad(getProducts);
  const [cat, setCat] = useState("All");

  const cats = useMemo(() => ["All", ...Array.from(new Set((products ?? []).map((p) => p.category).filter(Boolean)))], [products]);
  const shown = (products ?? []).filter((p) => cat === "All" || p.category === cat);

  return (
    <section id="menu" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-caps text-xs tracking-[0.35em] text-gold">TODAY&apos;S MENU</p>
          <h2 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Fresh from the <em className="text-gold">handi</em></h2>
          <p className="mt-2 font-bangla text-lg text-forest/60">আজকের টাটকা পিঠা</p>
        </div>
        {cats.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-sm transition ${cat === c ? "bg-forest text-cream" : "border border-forest/15 hover:border-forest"}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-10 rounded-2xl border border-gold/50 p-5 text-sm">Couldn&apos;t load the menu right now. Please refresh in a moment.</p>}

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="arch aspect-[4/5] bg-forest/10" />
                <div className="mt-5 h-6 w-2/3 rounded bg-forest/10" />
                <div className="mt-2 h-4 w-1/3 rounded bg-forest/10" />
              </div>
            ))
          : shown.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {!loading && !error && shown.length === 0 && (
        <p className="mt-6 text-center text-forest/60">The menu is being prepared. Please check back soon.</p>
      )}
    </section>
  );
}
