"use client";
import Link from "next/link";
import { useState } from "react";
import { Stepper } from "@/components/CartDrawer";
import { LogoMark } from "@/components/LogoMark";
import { useCart } from "@/lib/cart";
import { getDeliveryZones, placeOrder } from "@/lib/data";
import { taka } from "@/lib/format";
import { useLoad } from "@/lib/useLoad";

export default function CheckoutPage() {
  const { lines, subtotal, setQty, clear, ready } = useCart();
  const { data: zones } = useLoad(getDeliveryZones);
  const active = (zones ?? []).filter((z) => z.enabled);

  const [form, setForm] = useState({ customerName: "", phone: "", district: "", address: "", note: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const zone = active.find((z) => z.id === form.district);
  const delivery = zone?.charge ?? 0;
  const total = subtotal + delivery;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phone = form.phone.replace(/[^\d+]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) return setError("Please enter a valid Bangladeshi mobile number (01XXXXXXXXX).");
    if (!zone) return setError("Please choose your district.");
    setSending(true);
    try {
      const id = await placeOrder({
        customerName: form.customerName.trim(),
        phone,
        district: zone.district,
        address: form.address.trim(),
        note: form.note.trim(),
        items: lines.map((l) => ({ productId: l.id, name: l.name, unit: l.unit, price: l.price, qty: l.qty })),
        subtotal,
        deliveryCharge: delivery,
        total,
      });
      setOrderId(id);
      window.scrollTo({ top: 0 });
      clear();
    } catch {
      setError("Sorry, we couldn't place the order. Please try again or call us.");
    } finally {
      setSending(false);
    }
  }

  if (orderId) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="arch grid h-56 w-44 place-items-center bg-forest"><LogoMark className="h-36" animated /></div>
        <h1 className="mt-10 font-display text-5xl">Thank you!</h1>
        <p className="mt-2 font-bangla text-xl text-forest/70">আপনার অর্ডারটি পেয়েছি</p>
        <p className="mt-6 text-forest/70">We&apos;ll call you shortly to confirm. Your order number is</p>
        <p className="mt-2 rounded-full bg-forest px-5 py-2 font-mono text-sm tracking-wider text-gold">{orderId.slice(0, 8).toUpperCase()}</p>
        <Link href="/" className="mt-10 rounded-full border border-forest px-6 py-3 hover:bg-forest hover:text-cream">Back to the menu</Link>
      </section>
    );
  }

  if (!ready) return <section className="min-h-[60vh]" />;

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-28 text-center">
        <h1 className="font-display text-5xl">Your basket is empty</h1>
        <Link href="/#menu" className="mt-8 inline-block rounded-full bg-forest px-6 py-3 text-cream">See today&apos;s menu</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-caps text-xs tracking-[0.35em] text-gold">CHECKOUT</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Almost there</h1>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <Field label="Full name" bn="নাম">
            <input required value={form.customerName} onChange={set("customerName")} className="field" autoComplete="name" maxLength={99} />
          </Field>
          <Field label="Mobile number" bn="মোবাইল নম্বর">
            <input required value={form.phone} onChange={set("phone")} className="field" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="District" bn="জেলা">
            <select required value={form.district} onChange={set("district")} className="field">
              <option value="">Select your district…</option>
              {active.map((z) => <option key={z.id} value={z.id}>{z.district} · {z.districtBn} · {taka(z.charge)}</option>)}
            </select>
          </Field>
          <Field label="Full address" bn="ঠিকানা">
            <textarea required value={form.address} onChange={set("address")} rows={3} className="field" maxLength={499} placeholder="House, road, area, upazila" />
          </Field>
          <Field label="Note (optional)" bn="বিশেষ নির্দেশনা">
            <textarea value={form.note} onChange={set("note")} rows={2} className="field" maxLength={499} placeholder="Delivery time, less sweet, etc." />
          </Field>
        </div>

        <aside className="h-fit rounded-[2rem] bg-forest p-7 text-cream lg:sticky lg:top-24">
          <p className="font-display text-2xl">Order summary</p>
          <ul className="mt-5 divide-y divide-cream/10">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate">{l.name}</p>
                  <p className="text-xs text-cream/55">{l.unit} · {taka(l.price)}</p>
                </div>
                <div className="rounded-full bg-cream text-forest"><Stepper value={l.qty} onChange={(q) => setQty(l.id, q)} /></div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-cream/15 pt-5 text-sm">
            <Row k="Subtotal" v={taka(subtotal)} />
            <Row k={zone ? `Delivery · ${zone.district}` : "Delivery"} v={zone ? taka(delivery) : "Choose district"} />
            <div className="flex items-baseline justify-between pt-3">
              <dt className="text-cream/70">Total</dt>
              <dd className="font-display text-4xl text-gold">{taka(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-xl bg-cream/10 px-4 py-3 text-xs text-cream/75">Payment: <b>Cash on delivery</b> · ক্যাশ অন ডেলিভারি</p>
          {error && <p className="mt-4 rounded-xl bg-gold px-4 py-3 text-sm text-forest">{error}</p>}
          <button disabled={sending} className="mt-5 w-full rounded-full bg-gold py-4 font-medium text-forest transition hover:bg-cream disabled:opacity-60">
            {sending ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </section>
  );
}

function Field({ label, bn, children }: { label: string; bn: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm text-forest/75">{label} <span className="font-bangla text-forest/45">{bn}</span></span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-cream/70">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
