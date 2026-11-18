import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Hind_Siliguri, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const hind = Hind_Siliguri({ variable: "--font-hind", subsets: ["bengali", "latin"], weight: ["400", "500", "600"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Khasbahar Foods · খাসবাহার ফুডস", template: "%s · Khasbahar Foods" },
  description: "Genuine, halal, home-made pitha and food from our family kitchens in Palash, Narsingdi. Delivered across Bangladesh.",
  icons: { icon: "/icon.svg" },
  openGraph: { images: ["/logo.png"] },
};

export const viewport: Viewport = { themeColor: "#174B32" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${hind.variable} ${cinzel.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
