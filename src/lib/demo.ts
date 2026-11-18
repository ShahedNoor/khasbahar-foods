import type { Product } from "./types";

/** Sample menu shown until Firebase is connected (and available as a one-click seed in /admin). Prices are placeholders. */
export const DEMO_PRODUCTS: Product[] = [
  { id: "d1", name: "Bhapa Pitha", nameBn: "ভাপা পিঠা", description: "Steamed rice-flour cake filled with fresh date-palm gur and grated coconut.", category: "Pitha", unit: "6 pcs", sellPrice: 180, image: "", available: true, featured: true, sort: 1 },
  { id: "d2", name: "Patishapta", nameBn: "পাটিসাপটা", description: "Thin rolled crêpes with a creamy kheer and coconut filling.", category: "Pitha", unit: "6 pcs", sellPrice: 240, image: "", available: true, featured: true, sort: 2 },
  { id: "d3", name: "Puli Pitha", nameBn: "পুলি পিঠা", description: "Half-moon dumplings with a hand-crimped edge, sweet coconut inside.", category: "Pitha", unit: "8 pcs", sellPrice: 220, image: "", available: true, featured: true, sort: 3 },
  { id: "d4", name: "Chitoi Pitha", nameBn: "চিতই পিঠা", description: "Soft clay-pot rice cakes, served with shutki or mustard bhorta.", category: "Pitha", unit: "10 pcs", sellPrice: 150, image: "", available: true, featured: false, sort: 4 },
  { id: "d5", name: "Dudh Puli", nameBn: "দুধ পুলি", description: "Puli simmered slowly in thickened milk and nolen gur.", category: "Pitha", unit: "1 bowl", sellPrice: 260, image: "", available: true, featured: false, sort: 5 },
  { id: "d6", name: "Nakshi Pitha", nameBn: "নকশি পিঠা", description: "Hand-carved festive pitha with traditional patterns, fried and syrup-soaked.", category: "Special", unit: "6 pcs", sellPrice: 320, image: "", available: true, featured: false, sort: 6 },
];
