"use client";
import { useMemo, useState } from "react";
import { Btn, Notice, PageHead, Toggle } from "@/components/admin/ui";
import { getDeliveryZones, saveDeliveryZones, seedDeliveryZones } from "@/lib/data";
import { DISTRICTS, DIVISIONS } from "@/lib/districts";
import type { DeliveryZone } from "@/lib/types";
import { useLoad } from "@/lib/useLoad";

export default function DeliveryAdmin() {
  const { data, loading, error, reload, setData } = useLoad(getDeliveryZones);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [bulk, setBulk] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");

  const zones = useMemo(() => data ?? [], [data]);
  const missing = DISTRICTS.length - zones.length;

  const update = (id: string, patch: Partial<DeliveryZone>) => {
    setData(zones.map((z) => (z.id === id ? { ...z, ...patch } : z)));
    setDirty((d) => new Set(d).add(id));
    setMsg("");
  };

  const applyBulk = (division: string) => {
    const v = Number(bulk[division]);
    if (!bulk[division] || Number.isNaN(v)) return;
    const ids = zones.filter((z) => z.division === division).map((z) => z.id);
    setData(zones.map((z) => (z.division === division ? { ...z, charge: v } : z)));
    setDirty((d) => new Set([...d, ...ids]));
  };

  async function save() {
    setBusy(true);
    try {
      await saveDeliveryZones(zones.filter((z) => dirty.has(z.id)));
      setDirty(new Set());
      setMsg("Saved ✓");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function seed() {
    setBusy(true);
    try { await seedDeliveryZones(zones); await reload(); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHead title="Delivery charges" bn="জেলা অনুযায়ী ডেলিভারি চার্জ">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search district…" className="field w-48 py-2" />
        <Btn onClick={save} disabled={busy || dirty.size === 0}>{busy ? "Saving…" : dirty.size ? `Save ${dirty.size} change${dirty.size > 1 ? "s" : ""}` : "Saved"}</Btn>
      </PageHead>
      {msg && <p className="-mt-4 mb-4 text-sm text-gold">{msg}</p>}
      {error && <Notice>Couldn&apos;t load: {error}</Notice>}

      {!loading && missing > 0 && (
        <div className="mb-6">
          <Notice>
            {zones.length === 0 ? "No districts set up yet." : `${missing} district(s) missing.`}{" "}
            <button onClick={seed} disabled={busy} className="font-semibold underline underline-offset-4">Add all 64 districts</button>{" "}
            with starting charges (Narsingdi ৳60, Dhaka division ৳100, rest ৳150). You can change them after.
          </Notice>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {DIVISIONS.map((div) => {
          const list = zones.filter((z) => z.division === div && (!q || (z.district + z.districtBn).toLowerCase().includes(q.toLowerCase())));
          if (!list.length) return null;
          return (
            <section key={div} className="overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white/50">
              <header className="flex flex-wrap items-center justify-between gap-3 bg-forest/[0.04] px-5 py-3">
                <p className="font-display text-2xl">{div} <span className="text-sm text-forest/45">· {list.length}</span></p>
                <div className="flex items-center gap-2 text-xs">
                  Set all to ৳
                  <input type="number" min={0} value={bulk[div] ?? ""} onChange={(e) => setBulk({ ...bulk, [div]: e.target.value })} className="field w-20 py-1" />
                  <Btn variant="ghost" className="px-3 py-1 text-xs" onClick={() => applyBulk(div)}>Apply</Btn>
                </div>
              </header>
              <ul className="divide-y divide-forest/10">
                {list.map((z) => (
                  <li key={z.id} className={`flex items-center gap-3 px-5 py-2.5 ${z.enabled ? "" : "opacity-50"}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{z.district}</p>
                      <p className="font-bangla text-xs text-forest/50">{z.districtBn}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-forest/50">৳</span>
                      <input type="number" min={0} value={z.charge} onChange={(e) => update(z.id, { charge: Number(e.target.value) || 0 })} className={`field w-24 py-1.5 text-right ${dirty.has(z.id) ? "border-gold" : ""}`} />
                    </div>
                    <Toggle on={z.enabled} onChange={(v) => update(z.id, { enabled: v })} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-forest/50">Switch a district off to hide it from checkout (we don&apos;t deliver there yet).</p>
    </>
  );
}
