"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { LogoMark } from "./LogoMark";

const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#story", label: "Our story" },
  { href: "/#delivery", label: "Delivery" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-cream/85 shadow-[0_1px_0_rgba(23,75,50,0.08)] backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="Khasbahar Foods home">
          <span className="grid size-11 place-items-center rounded-2xl bg-forest transition-transform group-hover:-rotate-3">
            <LogoMark className="h-8" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-caps text-[15px] tracking-[0.2em] text-forest">KHASBAHAR</span>
            <span className="mt-1 font-caps text-[9px] tracking-[0.55em] text-gold">FOODS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-forest/10 bg-cream/60 p-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm text-forest/75 transition hover:bg-forest/5 hover:text-forest">
              {n.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-deep"
        >
          <BagIcon />
          <span className="hidden sm:inline">Basket</span>
          <span className={`grid min-w-6 place-items-center rounded-full px-1.5 text-xs font-semibold transition ${count ? "bg-gold text-forest" : "bg-cream/15 text-cream/70"}`}>
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}

export function BagIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
