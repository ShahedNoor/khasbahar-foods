"use client";
import { useState } from "react";
import { Btn, Notice, PageHead } from "@/components/admin/ui";
import { deleteOrder, getAdminProducts, getOrders, setOrderStatus } from "@/lib/data";
import { taka } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useLoad } from "@/lib/useLoad";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];
const BADGE: Record<OrderStatus, string> = {
  new: "bg-gold text-forest",
  confirmed: "bg-forest text-cream",
  delivered: "bg-forest/10 text-forest",
  cancelled: "bg-forest/5 text-forest/40 line-through",
};

/** Production cost of an order using today's cost per product. */
function orderCost(o: Order, costs: Map<string, number>) {
  return o.costTotal ?? o.items.reduce((s, i) => s + (costs.get(i.productId) ?? 0) * i.qty, 0);
}

export default function OrdersAdmin() {
  const { data, loading, error, reload } = useLoad(() => Promise.all([getOrders(), getAdminProducts()]));
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const [orders, products] = data ?? [[], []];
  const costs = new Map(products.map((p) => [p.id, p.produceCost]));
  const shown = orders.filter((o) => filter === "all" || o.status === filter);

  async function changeStatus(o: Order, s: OrderStatus) {
    // Lock in the production cost the moment an order is delivered, so later price edits don't rewrite history.
    await setOrderStatus(o, s, s === "delivered" ? orderCost({ ...o, costTotal: undefined }, costs) : undefined);
    await reload();
  }

  return (
    <>
      <PageHead title="Orders" bn="অর্ডার">
        {(["all", ...STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-sm capitalize ${filter === s ? "bg-forest text-cream" : "border border-forest/15"}`}>
            {s} {s !== "all" && <span className="opacity-60">({orders.filter((o) => o.status === s).length})</span>}
          </button>
        ))}
      </PageHead>
      {error && <Notice>Couldn&apos;t load orders: {error}</Notice>}
      {loading && <p className="text-forest/50">Loading…</p>}
      {!loading && shown.length === 0 && <p className="text-forest/50">No orders here yet.</p>}

      <ul className="space-y-3">
        {shown.map((o) => {
          const cost = orderCost(o, costs);
          const earning = o.subtotal - cost;
          const isOpen = open === o.id;
          return (
            <li key={o.id} className="overflow-hidden rounded-[1.25rem] border border-forest/10 bg-white/50">
              <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-left">
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${BADGE[o.status]}`}>{o.status}</span>
                <span className="min-w-40 flex-1">
                  <span className="block font-medium">{o.customerName}</span>
                  <span className="block text-xs text-forest/55">{o.phone} · {o.district}</span>
                </span>
                <span className="text-xs text-forest/55">{new Date(o.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                <span className="text-right">
                  <span className="block font-display text-2xl leading-none">{taka(o.total)}</span>
                  <span className="text-xs text-forest/55">earning ≈ {taka(earning)}</span>
                </span>
              </button>
              {isOpen && (
                <div className="grid gap-6 border-t border-forest/10 px-5 py-5 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <p><b>Address:</b> {o.address}</p>
                    {o.note && <p><b>Note:</b> {o.note}</p>}
                    <p className="text-xs text-forest/50">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a href={`tel:${o.phone}`} className="rounded-full border border-forest/20 px-4 py-2 text-xs">Call customer</a>
                      {STATUSES.filter((s) => s !== o.status).map((s) => (
                        <Btn key={s} variant={s === "cancelled" ? "danger" : "ghost"} className="px-4 py-2 text-xs capitalize" onClick={() => changeStatus(o, s)}>Mark {s}</Btn>
                      ))}
                      <Btn variant="danger" className="px-4 py-2 text-xs" onClick={async () => { if (confirm("Delete this order permanently? This can't be undone.")) { await deleteOrder(o.id); await reload(); } }}>Delete</Btn>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-forest/10">
                      {o.items.map((i) => (
                        <tr key={i.productId}><td className="py-1.5">{i.name} <span className="text-forest/50">× {i.qty}</span></td><td className="py-1.5 text-right tabular-nums">{taka(i.price * i.qty)}</td></tr>
                      ))}
                      <tr><td className="py-1.5 text-forest/60">Delivery</td><td className="py-1.5 text-right tabular-nums">{taka(o.deliveryCharge)}</td></tr>
                      <tr className="font-semibold"><td className="py-1.5">Total</td><td className="py-1.5 text-right tabular-nums">{taka(o.total)}</td></tr>
                      <tr className="text-forest/60"><td className="py-1.5">Production cost{o.costTotal === undefined ? " (today's)" : ""}</td><td className="py-1.5 text-right tabular-nums">− {taka(cost)}</td></tr>
                      <tr className="font-semibold text-gold"><td className="py-1.5">Food earning</td><td className="py-1.5 text-right tabular-nums">{taka(earning)}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
