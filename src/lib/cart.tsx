"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "./types";

export type CartLine = { id: string; name: string; nameBn: string; unit: string; price: number; qty: number };

type Cart = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  ready: boolean;
  setOpen: (o: boolean) => void;
  add: (p: Product) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "khasbahar-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore once from browser storage
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, loaded]);

  const value = useMemo<Cart>(() => ({
    lines,
    open,
    ready: loaded,
    setOpen,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
    add: (p) =>
      setLines((ls) => {
        const hit = ls.find((l) => l.id === p.id);
        if (hit) return ls.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
        return [...ls, { id: p.id, name: p.name, nameBn: p.nameBn, unit: p.unit, price: p.sellPrice, qty: 1 }];
      }),
    setQty: (id, qty) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l)))),
    clear: () => setLines([]),
  }), [lines, open, loaded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
