import { DeliveryChecker } from "@/components/DeliveryChecker";
import { LogoMark } from "@/components/LogoMark";
import { Menu } from "@/components/Menu";

const PILLARS = [
  { bn: "খাঁটি", en: "Genuine", text: "Real gur, real coconut, real rice flour. Nothing artificial, no shortcuts." },
  { bn: "হালাল", en: "Halal", text: "Halal ingredients and honest, halal earnings. Always." },
  { bn: "ভরসা", en: "Trust", text: "Made in our own family kitchens, the same food we serve at home." },
  { bn: "মান", en: "Quality", text: "Small batches, made fresh each day, checked by family hands." },
];

const STEPS = [
  { n: "01", title: "Pick your pitha", text: "Choose from today's fresh menu and add to your basket." },
  { n: "02", title: "We make it fresh", text: "Prepared the same day in our home kitchens in Palash." },
  { n: "03", title: "Delivered warm", text: "Cash on delivery, with a fair charge for your district." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 pt-2 sm:px-4">
        <div className="jali relative mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] bg-forest text-cream sm:rounded-[2.75rem]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 sm:px-10 md:grid-cols-[1.15fr_1fr] md:pb-24 md:pt-20">
            <div className="animate-rise">
              <p className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold">
                <span className="size-1.5 rounded-full bg-gold" /> Home-made in Palash
              </p>
              <h1 className="mt-7 font-display text-[clamp(3rem,7vw,6.2rem)] font-medium leading-[0.95] tracking-tight">
                The taste of home,
                <br />
                <em className="font-normal text-gold">made with care.</em>
              </h1>
              <p className="mt-6 max-w-xl font-bangla text-lg leading-relaxed text-cream/80">
                খাঁটি উপকরণে, হালাল উপায়ে, পরিবারের রান্নাঘরে তৈরি পিঠা ও ঘরের খাবার, এখন আপনার দোরগোড়ায়।
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#menu" className="rounded-full bg-gold px-7 py-3.5 font-medium text-forest transition hover:bg-cream">Order fresh pitha</a>
                <a href="#story" className="rounded-full border border-cream/30 px-7 py-3.5 font-medium transition hover:border-cream">Our story</a>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-cream/15 pt-6">
                {[["2", "family kitchens"], ["64", "districts we deliver"], ["0", "preservatives"]].map(([k, v]) => (
                  <div key={v}>
                    <dt className="font-display text-4xl text-gold">{k}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms]">
              <div className="arch relative aspect-[4/5] border border-gold/40 p-3">
                <div className="arch flex h-full flex-col items-center justify-center gap-6 bg-forest-deep/70 ring-1 ring-gold/25">
                  <LogoMark className="h-[58%]" animated />
                  <div className="text-center">
                    <p className="font-caps text-2xl tracking-[0.22em] text-gold">KHASBAHAR</p>
                    <p className="mt-1 font-caps text-xs tracking-[0.6em] text-gold/80">FOODS</p>
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-1/3 rounded-2xl bg-cream px-4 py-3 text-forest shadow-xl sm:-left-10">
                <p className="font-bangla text-lg leading-none">১০০% হালাল</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-forest/60">Halal ingredients only</p>
              </div>
              <div className="absolute -right-2 bottom-16 rounded-2xl bg-gold px-4 py-3 text-forest shadow-xl sm:-right-8">
                <p className="font-display text-xl leading-none">Fresh daily</p>
                <p className="mt-1 font-bangla text-xs">প্রতিদিন টাটকা</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-caps text-xs tracking-[0.35em] text-gold">WHAT WE STAND ON</p>
          <h2 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Four promises in every box</h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-forest/10 bg-forest/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.en} className="group bg-cream p-8 transition hover:bg-forest hover:text-cream">
              <p className="font-bangla text-4xl text-gold">{p.bn}</p>
              <p className="mt-2 font-display text-2xl">{p.en}</p>
              <p className="mt-4 text-sm leading-relaxed text-forest/65 group-hover:text-cream/75">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <Menu />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:items-end">
          <div>
            <p className="font-caps text-xs tracking-[0.35em] text-gold">HOW IT WORKS</p>
            <h2 className="mt-4 font-display text-5xl leading-tight">From our kitchen to your table</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-[1.75rem] border border-forest/10 bg-cream p-6">
                <p className="font-display text-5xl text-gold">{s.n}</p>
                <p className="mt-6 font-display text-2xl">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="scroll-mt-24 px-3 sm:px-4">
        <div className="mx-auto grid max-w-[96rem] overflow-hidden rounded-[2rem] bg-forest text-cream sm:rounded-[2.75rem] md:grid-cols-2">
          <div className="jali flex items-center justify-center p-12">
            <div className="arch flex aspect-[3/4] w-full max-w-xs items-center justify-center border border-gold/50">
              <p className="font-bangla text-[5.5rem] leading-none text-gold">খাস</p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-14">
            <p className="font-caps text-xs tracking-[0.35em] text-gold">OUR STORY</p>
            <h2 className="font-display text-5xl leading-tight">
              <em className="text-gold">Khas</em> means special.
              <br /><em className="text-gold">Bahar</em> means spring.
            </h2>
            <p className="leading-relaxed text-cream/75">
              Khasbahar Foods began in two family kitchens in Palash, Narsingdi, with recipes our mothers and grandmothers
              have made for every winter, every Eid and every guest. We make them the same way today, in small batches,
              with genuine ingredients and halal earnings. Like a tree that quietly gives its fruit, we would rather let the
              taste speak for us.
            </p>
            <blockquote className="border-l-2 border-gold pl-5 font-bangla text-lg leading-relaxed text-cream/90">
              খাঁটি মান, হালাল উপার্জন আর মানুষের ভরসা: এই তিনের ওপর দাঁড়িয়ে আমরা ঘরের তৈরি খাবার পণ্য দিতে চাই প্রতিটি পরিবারের।
            </blockquote>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <DeliveryChecker />
    </>
  );
}
