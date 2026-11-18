# Khasbahar Foods · খাসবাহার ফুডস

Website for **Khasbahar Foods**, the family food business (home-made pitha and food) from Palash Bazar, Narsingdi.

- **Shop** (`/`): menu, basket, checkout with a delivery charge per district, cash on delivery.
- **Admin** (`/admin`): add and edit products, set selling price and production cost (see the earning per unit and margin), set the delivery charge for all 64 districts, and manage orders with an earning per order.

Built with **Next.js 16** (App Router), **Tailwind CSS 4** and **Firebase** (Firestore + Authentication).
Brand colours: Deep Forest Green `#174B32`, Warm White `#FFFDF5`, Muted Golden `#C49A43`.

---

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Until Firebase is connected, the shop shows **demo products** and orders are not saved.

## Connect Firebase (one-time)

1. Go to <https://console.firebase.google.com>, create a project (e.g. `khasbahar-foods`), then click **Add app → Web**.
2. Copy `.env.example` to `.env.local` and paste the config values Firebase shows you.
3. **Authentication → Sign-in method →** enable **Email/Password**. Under **Users**, add one account per family admin.
4. **Firestore Database → Create database** (production mode, region `asia-south1` (Mumbai) is closest).
5. **Firestore → Rules:** paste the contents of [`firestore.rules`](firestore.rules) and publish.
   (Or with the Firebase CLI: `npx firebase-tools deploy --only firestore:rules`.)
6. **Firestore → Data → Start collection** `admins`. Add one document per admin, with the **document ID = the admin's email in lowercase** (add any field, e.g. `name: "Tanvir"`).
7. Restart `npm run dev`, open **/admin** and sign in.
8. In admin: **Delivery charges → Add all 64 districts**, then **Products → load the sample pitha** (or add your own).

### How the data is stored

| Collection | Who can read | Who can write | What's inside |
|---|---|---|---|
| `products` | everyone | admins | name, Bangla name, price, photo, unit… |
| `productCosts` | **admins only** | admins | production cost per product (kept separate so customers never see it) |
| `deliveryZones` | everyone | admins | district, charge, on/off |
| `orders` | admins | customers can only *create* | customer, items, totals, status |
| `admins` | yourself | nobody (console only) | list of admin emails |

Product photos are compressed in the browser to WebP and uploaded via `/api/upload` to **Cloudflare R2** (configured with `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, and `NEXT_PUBLIC_R2_PUBLIC_URL` in `.env.local`).

### Earnings

- **Earning per unit** = selling price − production cost.
- **Food earning per order** = items subtotal − production cost of those items. The delivery charge is shown separately, since it usually goes to the rider or courier.
- When an order is marked **delivered**, its production cost is saved with the order, so changing prices later doesn't change past earnings.

## Deploy

The easiest option is **Vercel**: import the GitHub repo, add the same `NEXT_PUBLIC_…` variables from `.env.local` in *Project → Settings → Environment Variables*, then deploy. Connect your domain (e.g. `khasbaharfoods.com`); the admin panel is then at `khasbaharfoods.com/admin`.

## Project structure

```
src/
  app/(shop)/        public website: home, checkout
  app/admin/         admin: overview, products, delivery, orders
  components/        UI (logo, header, cart, product card…)
  lib/               firebase, data access, districts, cart, types
firestore.rules      security rules
```

## Next ideas
- bKash / Nagad payment
- SMS or WhatsApp message to the customer when an order is confirmed
- Server-side price check for orders (Cloud Function)
- Bangla / English language switch
