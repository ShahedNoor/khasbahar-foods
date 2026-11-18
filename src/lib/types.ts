export type Product = {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  category: string;
  /** e.g. "12 pcs", "1 kg", "1 box" */
  unit: string;
  /** Selling price to the customer, in BDT */
  sellPrice: number;
  image: string;
  available: boolean;
  featured: boolean;
  sort: number;
};

/** Kept in a separate, admin-only collection so customers can never read our costs. */
export type ProductCost = {
  /** Cost to produce one unit (ingredients + packaging + gas, etc.), in BDT */
  produceCost: number;
};

export type AdminProduct = Product & ProductCost;

export type DeliveryZone = {
  id: string; // district slug
  district: string;
  districtBn: string;
  division: string;
  charge: number;
  enabled: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  district: string;
  address: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  /** Filled by admin when delivered: production cost of all items at that time */
  costTotal?: number;
  createdAt: number;
};
