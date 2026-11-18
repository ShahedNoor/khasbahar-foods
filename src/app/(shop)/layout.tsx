import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="grain min-h-dvh">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
