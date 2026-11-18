"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/format";
import type { Product } from "@/lib/types";
import { LogoMark } from "./LogoMark";

export function ProductImage({ p, className = "" }: { p: Pick<Product, "image" | "nameBn" | "name">; className?: string }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element -- images are data URLs / external links set in admin
    return <img src={p.image} alt={p.name} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`jali relative flex h-full w-full flex-col items-center justify-center gap-3 bg-forest ${className}`}>
      <LogoMark className="h-[45%] opacity-90" />
      <span className="font-bangla text-lg text-cream/85">{p.nameBn}</span>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col">
      <div className="arch relative aspect-[4/5] overflow-hidden bg-forest ring-1 ring-gold/30 ring-offset-4 ring-offset-cream transition duration-500 group-hover:ring-gold">
        <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]">
          <ProductImage p={p} />
        </div>
        {p.featured && (
          <span className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
            Favourite
          </span>
        )}
        {!p.available && (
          <div className="absolute inset-0 grid place-items-center bg-forest/70 text-sm font-medium uppercase tracking-[0.2em] text-cream">Sold out today</div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="font-display text-[1.6rem] leading-tight">{p.name}</h3>
          <p className="font-bangla text-forest/60">{p.nameBn} <span className="text-forest/35">·</span> {p.unit}</p>
        </div>
        <p className="font-display text-2xl text-gold">{taka(p.sellPrice)}</p>
      </div>
      {p.description && <p className="mt-2 line-clamp-2 px-1 text-sm leading-relaxed text-forest/65">{p.description}</p>}

      <div className="mt-4 flex gap-2 px-1">
        <button
          disabled={!p.available}
          onClick={onAdd}
          className="flex-1 rounded-full border border-forest py-2.5 text-sm font-medium transition hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added ✓" : "Add to basket"}
        </button>
        {added && (
          <button onClick={() => setOpen(true)} className="animate-rise rounded-full bg-gold px-4 text-sm font-medium text-forest">View</button>
        )}
      </div>
    </article>
  );
}
