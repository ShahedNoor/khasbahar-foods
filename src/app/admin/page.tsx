"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHead, Stat } from "@/components/admin/ui";
import { getAdminProducts, getOrders } from "@/lib/data";
import { margin, taka } from "@/lib/format";
import { useLoad } from "@/lib/useLoad";

export default function AdminHome() {
  const { data, loading, error } = useLoad(() => Promise.all([getAdminProducts(), getOrders()]));
  const [products, orders] = data ?? [[], []];
  const [plan, setPlan] = useState<Record<string, number>>({});

  const costs = useMemo(() => new Map(products.map((p) => [p.id, p.produceCost])), [products]);
  const delivered = orders.filter((o) => o.status === "delivered");
  const sales = delivered.reduce((s, o) => s + o.subtotal, 0);
  const cost = delivered.reduce((s, o) => s + (o.costTotal ?? o.items.reduce((a, i) => a + (costs.get(i.productId) ?? 0) * i.qty, 0)), 0);
  const deliveryCollected = delivered.reduce((s, o) => s + o.deliveryCharge, 0);
  const pending = orders.filter((o) => o.status === "new" || o.status === "confirmed");
  const avgMargin = products.length ? products.reduce((s, p) => s + margin(p.sellPrice, p.produceCost), 0) / products.length : 0;

  const planSales = products.reduce((s, p) => s + (plan[p.id] ?? 0) * p.sellPrice, 0);
  const planCost = products.reduce((s, p) => s + (plan[p.id] ?? 0) * p.produceCost, 0);

  return (
    <>
      <PageHead title="Assalamu alaikum" bn="আজকের হিসাব এক নজরে" />
      {error && <p className="mb-6 text-sm text-gold">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat tone="dark" label="Food earning (delivered)" value={loading ? "…" : taka(sales - cost)} hint={`${taka(sales)} sales − ${taka(cost)} cost`} />
        <Stat label="Orders to handle" value={loading ? "…" : String(pending.length)} hint={`${orders.length} orders in total`} />
        <Stat label="Delivery collected" value={loading ? "…" : taka(deliveryCollected)} hint="Passed on to courier / rider" />
        <Stat tone="gold" label="Average margin" value={loading ? "…" : `${avgMargin.toFixed(0)}%`} hint={`${products.length} products`} />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.5rem] border border-forest/10 bg-white/50 p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-3xl">Earning planner</p>
              <p className="font-bangla text-sm text-forest/55">কত বিক্রি করলে কত লাভ</p>
            </div>
            <button onClick={() => setPlan({})} className="text-xs underline underline-offset-4">Reset</button>
          </div>
          <table className="mt-5 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-forest/50">
              <tr><th className="pb-2">Product</th><th className="pb-2 text-right">Earning/unit</th><th className="pb-2 text-right">Units</th><th className="pb-2 text-right">Earning</th></tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {products.map((p) => {
                const n = plan[p.id] ?? 0;
                return (
                  <tr key={p.id}>
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right tabular-nums text-forest/65">{taka(p.sellPrice - p.produceCost)}</td>
                    <td className="py-2 text-right"><input type="number" min={0} value={n || ""} placeholder="0" onChange={(e) => setPlan({ ...plan, [p.id]: Number(e.target.value) || 0 })} className="field w-20 py-1 text-right" /></td>
                    <td className="py-2 text-right font-medium tabular-nums">{taka(n * (p.sellPrice - p.produceCost))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-forest p-4 text-cream">
            <div><p className="text-xs text-cream/60">Sales</p><p className="font-display text-2xl">{taka(planSales)}</p></div>
            <div><p className="text-xs text-cream/60">Produce cost</p><p className="font-display text-2xl">{taka(planCost)}</p></div>
            <div><p className="text-xs text-cream/60">Earning</p><p className="font-display text-2xl text-gold">{taka(planSales - planCost)}</p></div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-forest/10 bg-white/50 p-6">
          <p className="font-display text-3xl">Latest orders</p>
          <ul className="mt-4 divide-y divide-forest/10 text-sm">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2.5">
                <span><span className="font-medium">{o.customerName}</span> <span className="text-forest/50">· {o.district}</span></span>
                <span className="tabular-nums">{taka(o.total)} <span className="ml-1 text-xs capitalize text-forest/50">{o.status}</span></span>
              </li>
            ))}
            {!loading && orders.length === 0 && <li className="py-3 text-forest/50">No orders yet.</li>}
          </ul>
          <Link href="/admin/orders" className="mt-4 inline-block text-sm underline underline-offset-4">All orders →</Link>
        </div>
      </section>
    </>
  );
}
