import Link from "next/link";
import { LogoMark, Wordmark } from "./LogoMark";

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE;
  return (
    <footer className="jali mt-24 bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-5">
            <LogoMark className="h-20" />
            <Wordmark className="text-2xl" />
          </div>
          <p className="max-w-sm font-bangla leading-relaxed text-cream/75">
            খাঁটি মান, হালাল উপার্জন আর মানুষের ভরসা: এই তিনের ওপর দাঁড়িয়ে আমরা ঘরের তৈরি খাবার পণ্য দিতে চাই প্রতিটি পরিবারের।
          </p>
        </div>
        <div>
          <p className="font-caps text-xs tracking-[0.3em] text-gold">VISIT</p>
          <p className="mt-4 leading-relaxed text-cream/80">Palash Bazar<br />Palash, Narsingdi<br />Bangladesh</p>
          <p className="mt-2 font-bangla text-cream/60">পলাশ বাজার, পলাশ, নরসিংদী</p>
        </div>
        <div>
          <p className="font-caps text-xs tracking-[0.3em] text-gold">ORDER</p>
          <ul className="mt-4 space-y-2 text-cream/80">
            <li><Link href="/#menu" className="hover:text-gold">Today&apos;s menu</Link></li>
            <li><Link href="/#delivery" className="hover:text-gold">Delivery charges</Link></li>
            {phone && <li><a href={`tel:${phone}`} className="hover:text-gold">{phone}</a></li>}
            <li className="text-cream/60">Cash on delivery</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-cream/50 sm:flex-row sm:px-6">
          <p>© 2026 Khasbahar Foods. A Khasbahar family company.</p>
          <p className="font-bangla">খাঁটি · হালাল · ভরসা · মান</p>
        </div>
      </div>
    </footer>
  );
}
