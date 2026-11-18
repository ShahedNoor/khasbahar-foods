"use client";
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query,
  setDoc, updateDoc, writeBatch,
} from "firebase/firestore";
import { db, firebaseReady } from "./firebase";
import { DISTRICTS, defaultCharge, slug } from "./districts";
import { DEMO_PRODUCTS } from "./demo";
import type { AdminProduct, DeliveryZone, Order, OrderStatus, Product } from "./types";

/*
  Firestore layout
  ─ products/{id}        public: name, price, image … (no costs!)
  ─ productCosts/{id}    admin only: produceCost
  ─ deliveryZones/{slug} public: district, charge, enabled
  ─ orders/{id}          anyone can create, only admins read
  ─ admins/{email}       existence = admin access (create by hand in Firebase console)
*/

const toProduct = (id: string, d: Record<string, unknown>): Product => ({
  id,
  name: String(d.name ?? ""),
  nameBn: String(d.nameBn ?? ""),
  description: String(d.description ?? ""),
  category: String(d.category ?? "Pitha"),
  unit: String(d.unit ?? ""),
  sellPrice: Number(d.sellPrice ?? 0),
  image: String(d.image ?? ""),
  available: d.available !== false,
  featured: Boolean(d.featured),
  sort: Number(d.sort ?? 0),
});

// ───────────── public ─────────────

export async function getProducts(): Promise<Product[]> {
  if (!firebaseReady) return DEMO_PRODUCTS;
  const snap = await getDocs(query(collection(db(), "products"), orderBy("sort")));
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  if (!firebaseReady) {
    return DISTRICTS.map((d) => ({ ...d, id: slug(d.district), charge: defaultCharge(d.district, d.division), enabled: true }))
      .sort((a, b) => a.district.localeCompare(b.district));
  }
  const snap = await getDocs(collection(db(), "deliveryZones"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<DeliveryZone, "id">) }))
    .sort((a, b) => a.district.localeCompare(b.district));
}

export async function placeOrder(o: Omit<Order, "id" | "status" | "createdAt">): Promise<string> {
  if (!firebaseReady) return "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const ref = await addDoc(collection(db(), "orders"), { ...o, status: "new", createdAt: Date.now() });
  return ref.id;
}

// ───────────── admin ─────────────

export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const snap = await getDoc(doc(db(), "admins", email.toLowerCase()));
  return snap.exists();
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const [products, costs] = await Promise.all([
    getProducts(),
    getDocs(collection(db(), "productCosts")),
  ]);
  const costMap = new Map(costs.docs.map((c) => [c.id, Number(c.data().produceCost ?? 0)]));
  return products.map((p) => ({ ...p, produceCost: costMap.get(p.id) ?? 0 }));
}

export async function saveProduct(p: AdminProduct): Promise<string> {
  const { id, produceCost, ...pub } = p;
  const ref = id ? doc(db(), "products", id) : doc(collection(db(), "products"));
  const batch = writeBatch(db());
  batch.set(ref, pub);
  batch.set(doc(db(), "productCosts", ref.id), { produceCost });
  await batch.commit();
  return ref.id;
}

export async function deleteProduct(id: string) {
  const batch = writeBatch(db());
  batch.delete(doc(db(), "products", id));
  batch.delete(doc(db(), "productCosts", id));
  await batch.commit();
}

export async function setProductAvailable(id: string, available: boolean) {
  await updateDoc(doc(db(), "products", id), { available });
}

/** Creates all 64 districts with starting charges (only the ones that don't exist yet). */
export async function seedDeliveryZones(existing: DeliveryZone[]) {
  const have = new Set(existing.map((z) => z.id));
  const batch = writeBatch(db());
  for (const d of DISTRICTS) {
    const id = slug(d.district);
    if (have.has(id)) continue;
    batch.set(doc(db(), "deliveryZones", id), { ...d, charge: defaultCharge(d.district, d.division), enabled: true });
  }
  await batch.commit();
}

export async function saveDeliveryZones(zones: DeliveryZone[]) {
  const batch = writeBatch(db());
  for (const { id, ...z } of zones) batch.set(doc(db(), "deliveryZones", id), z);
  await batch.commit();
}

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(query(collection(db(), "orders"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
}

export async function setOrderStatus(order: Order, status: OrderStatus, costTotal?: number) {
  await updateDoc(doc(db(), "orders", order.id), costTotal === undefined ? { status } : { status, costTotal });
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db(), "orders", id));
}

/** Upload helper used by the seed button: writes demo products so the shop isn't empty on day one. */
export async function seedDemoProducts() {
  for (const p of DEMO_PRODUCTS) {
    const ref = doc(collection(db(), "products"));
    const { id: _id, ...pub } = p;
    void _id;
    await setDoc(ref, pub);
    await setDoc(doc(db(), "productCosts", ref.id), { produceCost: Math.round(p.sellPrice * 0.55) });
  }
}
