"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/format";
import { LogoMark } from "./LogoMark";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, subtotal } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-forest/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Your basket"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
          <div>
            <p className="font-display text-2xl">Your basket</p>
            <p className="font-bangla text-sm text-forest/60">আপনার ঝুড়ি</p>
          </div>
          <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-forest/15 text-xl hover:bg-forest/5" aria-label="Close">×</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="arch grid h-40 w-32 place-items-center bg-forest"><LogoMark className="h-24" /></div>
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="text-sm text-forest/60">Add some fresh pitha from the menu.</p>
            <Link href="/#menu" onClick={() => setOpen(false)} className="rounded-full border border-forest px-5 py-2.5 text-sm hover:bg-forest hover:text-cream">Browse the menu</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-forest/10 overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.name}</p>
                    <p className="font-bangla text-sm text-forest/60">{l.nameBn} · {l.unit}</p>
                    <p className="mt-1 text-sm text-gold">{taka(l.price)}</p>
                  </div>
                  <Stepper value={l.qty} onChange={(q) => setQty(l.id, q)} />
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-forest/10 bg-forest/[0.03] px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-forest/70">Subtotal</span>
                <span className="font-display text-3xl">{taka(subtotal)}</span>
              </div>
              <p className="text-xs text-forest/55">Delivery charge is added at checkout, based on your district.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="block rounded-full bg-forest py-3.5 text-center font-medium text-cream transition hover:bg-forest-deep">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-forest/15">
      <button onClick={() => onChange(value - 1)} className="grid size-9 place-items-center rounded-full hover:bg-forest/5" aria-label="Decrease">−</button>
      <span className="w-6 text-center text-sm tabular-nums">{value}</span>
      <button onClick={() => onChange(value + 1)} className="grid size-9 place-items-center rounded-full hover:bg-forest/5" aria-label="Increase">+</button>
    </div>
  );
}
