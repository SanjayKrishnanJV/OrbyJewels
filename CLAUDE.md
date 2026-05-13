# ORBY JEWELS — Claude Code Guide

## Project Overview

Full-stack luxury jewellery e-commerce platform built with Next.js 15 App Router.
Brand: **ORBY JEWELS** under **Nera Groups**.
Admin email: `admin@orbyjewels.com` | Password: `OrbyAdmin@2024`
Demo customer: `demo@customer.com` | Password: `Customer@123`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom luxury design tokens |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 5 |
| Auth | NextAuth v5 (JWT, role-based: USER / ADMIN) |
| Image storage | Cloudinary |
| State | Zustand (cart + wishlist, persisted to localStorage) |
| Animations | Framer Motion |
| Payment | Manual UPI/QR code flow (no payment gateway) |

## Route Structure

```
src/app/
  (shop)/          # Customer-facing (Navbar + Footer layout)
    page.tsx               # Home
    products/              # All products + [slug] product detail
    category/[slug]/       # Category page (filterable by ?subcategory=)
    category/[slug]/[sub]/ # Redirects to ?subcategory= query param
    collections/new-arrivals/
    cart/
    checkout/              # Two-step: address → UPI payment
    orders/                # Order list + [id] detail with progress tracker
    wishlist/
    search/
    account/               # Customer account + addresses

  (auth)/          # Login / Register (no layout chrome)
    login/
    register/

  admin/           # Admin panel (role-guarded)
    dashboard/
    products/       # List + [id] edit
    orders/         # List + [id] detail with status updater
    customers/
    categories/     # new/ + [id]
    banners/
    settings/

  api/
    auth/           # NextAuth
    products/
    orders/         # + [id]/ + [id]/utr/
    cart/
    wishlist/
    upload/         # Cloudinary signed upload
    admin/          # Admin-only: products, orders, customers, categories, banners
    settings/payment/  # Public: returns UPI ID, QR URL, WhatsApp
```

## Key Patterns

### Server Pages with Prisma
Always add `export const dynamic = "force-dynamic"` to server pages that query the DB. Without it, Next.js may try to statically render and fail at build time.

### Zustand Hydration
Both stores use `skipHydration: true`. The `<StoreHydration>` component (in the shop layout) calls `.persist.rehydrate()` in a `useEffect` after mount. This prevents server/client mismatch from localStorage values.

### Auth Guard (Admin)
Admin API routes check session role:
```ts
const session = await getServerSession(authOptions);
if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

### Payment Flow
No payment gateway. Flow:
1. Customer places order → status `PENDING`, paymentStatus `PENDING`
2. Checkout shows UPI QR + UPI ID from site settings
3. Customer pays and submits UTR number → saved to `order.notes`
4. Admin manually verifies and clicks "Mark as Paid" → status `CONFIRMED`, paymentStatus `PAID`

UPI settings are stored in `siteSettings` table with keys: `upi_id`, `upi_name`, `upi_qr_url`.

## Environment Variables

Required in `.env.local` (for dev) and Vercel dashboard (for prod):

```
DATABASE_URL=           # Neon pooled connection string
NEXTAUTH_URL=           # Full URL e.g. https://yourdomain.vercel.app
NEXTAUTH_SECRET=        # Random secret (same as AUTH_SECRET)
AUTH_SECRET=            # Same value as NEXTAUTH_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=   # Must be "Unsigned" mode in Cloudinary
```

Prisma CLI reads `.env` (not `.env.local`). Keep a `.env` with just `DATABASE_URL` for running `prisma db push` / `prisma db seed` locally.

## Database Commands

```bash
# Push schema changes (no migration history)
DATABASE_URL="..." npx prisma db push

# Seed demo data (categories, products, testimonials, banners, settings)
DATABASE_URL="..." npm run db:seed

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Regenerate Prisma client after schema change
npx prisma generate
```

## Cloudinary Setup

1. Go to Cloudinary dashboard → Settings → Upload Presets
2. Create preset named `orby_jewels_upload` with **Unsigned** signing mode
3. Set folder to `orby-jewels`

## Admin UPI Setup

After deploying, go to `/admin/settings` → **UPI Payment** section:
- Set your UPI ID (e.g. `yourname@upi`)
- Set UPI display name
- Paste a publicly accessible URL of your QR code image

## Common Gotchas

- **`validateDOMNesting` error**: Never put `<button>` or `<Link>` inside another `<Link>`. ProductCard uses a background `<Link>` with `z-0` and interactive elements at `z-10`.
- **Hydration mismatch**: Any value that differs between server and client (dates, localStorage) needs either `suppressHydrationWarning` on the element or a `mounted` guard.
- **Category 404**: Categories must exist in the DB. Run `npm run db:seed` if categories are missing.
- **Subcategory links**: Use `?subcategory=slug` query params, not path segments. The `[sub]` route just redirects.
- **Image domains**: `next.config.ts` has `{ hostname: "**" }` to allow any HTTPS image source.
