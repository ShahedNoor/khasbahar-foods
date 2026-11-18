"use client";
import { useState } from "react";
import { getDeliveryZones } from "@/lib/data";
import { taka } from "@/lib/format";
import { useLoad } from "@/lib/useLoad";

export function DeliveryChecker() {
  const { data: zones } = useLoad(getDeliveryZones);
  const [id, setId] = useState("");
  const active = (zones ?? []).filter((z) => z.enabled);
  const zone = active.find((z) => z.id === id);

  return (
    <section id="delivery" className="scroll-mt-24 mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <div className="grid items-center gap-10 rounded-[2rem] border border-forest/10 bg-cream p-8 sm:p-12 md:grid-cols-2">
        <div>
          <p className="font-caps text-xs tracking-[0.35em] text-gold">DELIVERY</p>
          <h2 className="mt-4 font-display text-5xl leading-tight">How much to your door?</h2>
          <p className="mt-3 text-forest/65">Pick your district to see the delivery charge. Pay cash when it arrives.</p>
        </div>
        <div className="space-y-4">
          <label className="block text-sm text-forest/70" htmlFor="district-check">Your district · <span className="font-bangla">আপনার জেলা</span></label>
          <select id="district-check" value={id} onChange={(e) => setId(e.target.value)} className="field text-lg">
            <option value="">Select a district…</option>
            {active.map((z) => (
              <option key={z.id} value={z.id}>{z.district} · {z.districtBn}</option>
            ))}
          </select>
          <div className="flex min-h-24 items-center justify-between rounded-2xl bg-forest px-6 py-5 text-cream">
            {zone ? (
              <>
                <div>
                  <p className="text-sm text-cream/60">Delivery to {zone.district}</p>
                  <p className="font-bangla text-cream/80">{zone.districtBn}</p>
                </div>
                <p className="font-display text-5xl text-gold">{taka(zone.charge)}</p>
              </>
            ) : (
              <p className="text-cream/60">Choose a district to see the charge.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
