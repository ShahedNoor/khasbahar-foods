"use client";
import { useState } from "react";
import { Btn, Notice, PageHead, Toggle } from "@/components/admin/ui";
import { ProductImage } from "@/components/ProductCard";
import { deleteProduct, getAdminProducts, saveProduct, seedDemoProducts, setProductAvailable } from "@/lib/data";
import { margin, taka } from "@/lib/format";
import { deleteProductImage, uploadProductImage } from "@/lib/upload";
import type { AdminProduct } from "@/lib/types";
import { useLoad } from "@/lib/useLoad";

const EMPTY: AdminProduct = {
  id: "", name: "", nameBn: "", description: "", category: "Pitha", unit: "", sellPrice: 0, produceCost: 0,
  image: "", available: true, featured: false, sort: 0,
};

export default function ProductsAdmin() {
  const { data: products, loading, error, reload } = useLoad(getAdminProducts);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function seed() {
    setSeeding(true);
    try { await seedDemoProducts(); await reload(); } finally { setSeeding(false); }
  }

  return (
    <>
      <PageHead title="Products" bn="পণ্য যোগ ও পরিবর্তন">
        <Btn onClick={() => setEditing({ ...EMPTY, sort: (products?.length ?? 0) + 1 })}>+ Add product</Btn>
      </PageHead>

      {error && <Notice>Couldn&apos;t load products: {error}</Notice>}

      {!loading && products?.length === 0 && (
        <Notice>
          No products yet. Add your first one, or{" "}
          <button onClick={seed} disabled={seeding} className="font-semibold underline underline-offset-4">
            {seeding ? "adding…" : "load the 6 sample pitha"}
          </button>{" "}
          (sample prices and a 55% cost estimate; edit them after).
        </Notice>
      )}

      <div className="overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white/50">
        <table className="w-full text-sm">
          <thead className="bg-forest/[0.04] text-left text-xs uppercase tracking-[0.12em] text-forest/55">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="hidden px-4 py-3 md:table-cell">Category</th>
              <th className="px-4 py-3 text-right">Sell</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">Produce cost</th>
              <th className="px-4 py-3 text-right">Earning / unit</th>
              <th className="hidden px-4 py-3 text-center lg:table-cell">On shop</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-forest/50">Loading…</td></tr>}
            {products?.map((p) => {
              const profit = p.sellPrice - p.produceCost;
              const m = margin(p.sellPrice, p.produceCost);
              return (
                <tr key={p.id} className="hover:bg-forest/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="arch h-14 w-11 shrink-0 overflow-hidden bg-forest"><ProductImage p={p} className="[&_span]:hidden" /></div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate font-bangla text-xs text-forest/55">{p.nameBn} · {p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{taka(p.sellPrice)}</td>
                  <td className="hidden px-4 py-3 text-right tabular-nums text-forest/70 sm:table-cell">{taka(p.produceCost)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={profit < 0 ? "font-semibold text-gold" : "font-semibold"}>{taka(profit)}</span>
                    <span className="ml-2 rounded-full bg-forest/5 px-2 py-0.5 text-xs text-forest/60">{m.toFixed(0)}%</span>
                  </td>
                  <td className="hidden px-4 py-3 text-center lg:table-cell">
                    <Toggle on={p.available} onChange={async (v) => { await setProductAvailable(p.id, v); await reload(); }} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Btn variant="ghost" className="px-4 py-1.5" onClick={() => setEditing(p)}>Edit</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && <Editor initial={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload(); }} />}
    </>
  );
}

function Editor({ initial, onClose, onSaved }: { initial: AdminProduct; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<AdminProduct>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(50);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((x) => ({ ...x, [k]: v }));
  const num = (k: "sellPrice" | "produceCost" | "sort") => (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value) || 0);

  const profit = p.sellPrice - p.produceCost;
  const m = margin(p.sellPrice, p.produceCost);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setErr("");
    try {
      set("image", await uploadProductImage(f));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await saveProduct(p);
      if (initial.image && initial.image !== p.image) void deleteProductImage(initial.image);
      onSaved();
    } catch (x) { setErr(x instanceof Error ? x.message : "Save failed"); } finally { setBusy(false); }
  }

  async function remove() {
    if (!p.id || !confirm(`Delete "${p.name}" permanently? This can't be undone.`)) return;
    setBusy(true);
    try { await deleteProduct(p.id); void deleteProductImage(initial.image); onSaved(); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-forest/40 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-2xl flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
          <p className="font-display text-3xl">{p.id ? "Edit product" : "New product"}</p>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-forest/15 text-xl" aria-label="Close">×</button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Earning calculator */}
          <div className="rounded-[1.5rem] bg-forest p-5 text-cream">
            <p className="text-xs uppercase tracking-[0.15em] text-cream/60">Basic earning · মুনাফার হিসাব</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <Money label="Sell price" value={p.sellPrice} />
              <Money label="Produce cost" value={p.produceCost} />
              <div>
                <p className="text-xs text-cream/60">Earning / unit</p>
                <p className={`font-display text-3xl ${profit < 0 ? "text-cream underline decoration-gold" : "text-gold"}`}>{taka(profit)}</p>
                <p className="text-xs text-cream/60">{m.toFixed(1)}% margin</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-cream/15 pt-4 text-sm">
              If we sell
              <input type="number" min={0} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} className="w-20 rounded-lg bg-cream/10 px-2 py-1 text-center text-cream outline-none focus:ring-2 focus:ring-gold" />
              units → sales <b>{taka(qty * p.sellPrice)}</b>, cost <b>{taka(qty * p.produceCost)}</b>, earning <b className="text-gold">{taka(qty * profit)}</b>
            </div>
            {profit < 0 && <p className="mt-3 text-sm text-gold">Selling below cost: this product loses money.</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Selling price (৳)"><input type="number" min={0} required value={p.sellPrice || ""} onChange={num("sellPrice")} className="field" /></L>
            <L label="Produce cost per unit (৳)" hint="Ingredients + packaging + gas. Only admins can see this."><input type="number" min={0} required value={p.produceCost || ""} onChange={num("produceCost")} className="field" /></L>
            <L label="Name (English)"><input required value={p.name} onChange={(e) => set("name", e.target.value)} className="field" /></L>
            <L label="Name (Bangla)"><input value={p.nameBn} onChange={(e) => set("nameBn", e.target.value)} className="field font-bangla" /></L>
            <L label="Unit / pack" hint="e.g. 6 pcs, 1 kg, 1 box"><input required value={p.unit} onChange={(e) => set("unit", e.target.value)} className="field" /></L>
            <L label="Category"><input list="cats" value={p.category} onChange={(e) => set("category", e.target.value)} className="field" />
              <datalist id="cats"><option value="Pitha" /><option value="Special" /><option value="Sweets" /><option value="Snacks" /><option value="Meals" /></datalist>
            </L>
          </div>
          <L label="Description"><textarea rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} className="field" /></L>

          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <div className="arch h-36 w-28 overflow-hidden bg-forest"><ProductImage p={p} /></div>
            <div className="space-y-3">
              <L label="Photo" hint={uploading ? "Uploading to Cloudflare R2…" : "Upload (auto-compressed to WebP, stored on Cloudflare R2) or paste an image link."}>
                <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-cream" />
              </L>
              <input placeholder="https://…" value={p.image} onChange={(e) => set("image", e.target.value)} className="field" />
              {p.image && <button type="button" onClick={() => set("image", "")} className="text-xs underline underline-offset-4">Remove photo</button>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 text-sm"><Toggle on={p.available} onChange={(v) => set("available", v)} /> Available on shop</label>
            <label className="flex items-center gap-3 text-sm"><Toggle on={p.featured} onChange={(v) => set("featured", v)} /> Mark as favourite</label>
            <label className="flex items-center gap-3 text-sm">Order <input type="number" value={p.sort} onChange={num("sort")} className="field w-20 py-1.5" /></label>
          </div>
          {err && <Notice>{err}</Notice>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-forest/10 px-6 py-4">
          {p.id ? <Btn type="button" variant="danger" onClick={remove} disabled={busy}>Delete</Btn> : <span />}
          <div className="flex gap-2">
            <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn type="submit" disabled={busy || uploading}>{busy ? "Saving…" : "Save product"}</Btn>
          </div>
        </div>
      </form>
    </div>
  );
}

function Money({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-cream/60">{label}</p>
      <p className="font-display text-3xl">{taka(value)}</p>
    </div>
  );
}

function L({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-forest/75">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-forest/50">{hint}</span>}
    </label>
  );
}
