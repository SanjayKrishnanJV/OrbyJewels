# ORBY JEWELS — Ultra Premium Luxury E-Commerce Platform

> *Where Elegance Meets Artistry* | Under Nera Groups

A complete, production-ready luxury jewellery e-commerce platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Deployed entirely on **FREE** infrastructure.

---

## ✨ Features

### 🛍️ Customer Features
- Beautiful luxury homepage with hero carousel, featured collections, testimonials
- Browse by category, subcategory, filter, and sort
- Advanced search with real-time results
- Detailed product pages with image zoom, specifications, reviews
- Cart with quantity management and coupon codes
- Wishlist (persisted locally)
- Checkout with Razorpay payment integration
- Order history and tracking
- Address management
- Account management

### 🔐 Authentication
- Email/password login and registration
- Google OAuth (optional)
- JWT-based sessions
- Role-based access (Customer, Admin)

### 🎛️ Admin Dashboard
- Dashboard with revenue, orders, customer analytics
- Product management (create, edit, delete, images)
- Category & subcategory management
- Order management with status updates
- Customer management (view, block/unblock)
- Banner/content management
- Coupon management
- Site settings

### 💎 Premium UI/UX
- Luxury color palette (chocolate brown, champagne, gold)
- Playfair Display + Poppins typography
- Framer Motion animations throughout
- Responsive mobile-first design
- Skeleton loaders
- Toast notifications
- Premium hover effects

---

## 🆓 Zero-Cost Stack

| Service | Provider | Free Tier |
|---------|----------|-----------|
| Frontend + Backend | Vercel | ✅ Free |
| Database | Neon PostgreSQL | ✅ Free (0.5GB) |
| Image Storage | Cloudinary | ✅ Free (25GB) |
| Authentication | NextAuth.js | ✅ Free |
| Payments | Razorpay Test Mode | ✅ Free |
| Email | Resend | ✅ Free (3K/month) |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd orby-jewels
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Fill in your values (see below)
```

### 3. Database Setup (Neon - Free)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project named "orby-jewels"
3. Copy the connection string to `DATABASE_URL`

### 4. Authentication Setup
```bash
# Generate a secure secret
openssl rand -base64 32
# Add to .env.local as NEXTAUTH_SECRET
```

### 5. Cloudinary Setup (Free - 25GB)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Go to Settings → Upload → Add preset named `orby_jewels_upload` (unsigned)

### 6. Razorpay Setup (Test Mode - Free)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate Test Mode keys
3. Add to `.env.local`

### 7. Run Database Migration & Seed
```bash
npm run db:push       # Push schema to database
npm run db:seed       # Seed with demo data
```

### 8. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
orby-jewels/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Demo data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login, Register pages
│   │   ├── (shop)/        # Customer-facing pages
│   │   │   ├── page.tsx   # Homepage
│   │   │   ├── products/  # Product listing + detail
│   │   │   ├── category/  # Category pages
│   │   │   ├── cart/      # Cart page
│   │   │   ├── checkout/  # Checkout + payment
│   │   │   ├── wishlist/  # Wishlist
│   │   │   ├── account/   # User account
│   │   │   └── orders/    # Order history
│   │   ├── admin/         # Admin dashboard
│   │   │   ├── dashboard/ # Admin overview
│   │   │   ├── products/  # Product CRUD
│   │   │   ├── categories/# Category management
│   │   │   ├── orders/    # Order management
│   │   │   ├── customers/ # Customer management
│   │   │   └── settings/  # Site settings
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── layout/        # Navbar, Footer
│   │   ├── home/          # Homepage sections
│   │   ├── product/       # Product components
│   │   ├── cart/          # Cart drawer
│   │   ├── admin/         # Admin components
│   │   └── common/        # Shared components
│   ├── lib/
│   │   ├── db.ts          # Prisma client
│   │   ├── auth.ts        # NextAuth config
│   │   ├── cloudinary.ts  # Image upload
│   │   └── utils.ts       # Utilities
│   ├── store/
│   │   ├── cartStore.ts   # Zustand cart state
│   │   └── wishlistStore.ts # Zustand wishlist
│   └── types/             # TypeScript types
├── .env.example           # Environment template
├── next.config.ts
├── tailwind.config.ts
└── prisma/schema.prisma
```

---

## 🌐 Deploy to Vercel (Free)

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: Orby Jewels initial setup"
git push
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Deploy!

### 3. Post-Deploy
```bash
# Run seed on production (optional)
# Use Vercel CLI or Neon Console to run:
npm run db:seed
```

---

## 🎯 Demo Credentials

After running seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@orbyjewels.com | OrbyAdmin@2024 |
| Customer | demo@customer.com | Customer@123 |

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Chocolate Brown | `#3D2314` | Primary, backgrounds |
| Champagne Cream | `#F5E6D3` | Light backgrounds |
| Metallic Gold | `#D4AF37` | Accents, CTAs |
| Nude Beige | `#C4A882` | Secondary |
| Ivory White | `#FDFAF7` | Page backgrounds |

---

## 🛡️ Security Features

- Bcrypt password hashing
- JWT session management
- Role-based route protection
- Input validation with Zod
- CSRF protection via NextAuth
- Admin-only API routes
- SQL injection prevention via Prisma

---

## 📱 Pages

### Customer
- `/` — Luxury homepage
- `/products` — All products with filtering
- `/products/[slug]` — Product detail with zoom
- `/category/[slug]` — Category page
- `/search?q=...` — Search results
- `/cart` — Shopping cart
- `/checkout` — Checkout with Razorpay
- `/wishlist` — Saved items
- `/account` — User profile
- `/orders` — Order history
- `/login` — Sign in
- `/register` — Create account

### Admin
- `/admin/dashboard` — Overview & analytics
- `/admin/products` — Product management
- `/admin/categories` — Category management
- `/admin/orders` — Order management
- `/admin/customers` — Customer management
- `/admin/settings` — Site configuration

---

## 🧩 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth v5
- **State**: Zustand
- **Images**: Cloudinary
- **Payments**: Razorpay
- **Email**: Resend
- **UI**: ShadCN UI + Radix
- **Icons**: Lucide React

---

## 📞 Support

- Email: hello@orbyjewels.com
- WhatsApp: +91 98765 43210
- Instagram: [@orbyjewels](https://instagram.com/orbyjewels)

---

*Built with ❤️ for ORBY JEWELS — Part of Nera Groups*
