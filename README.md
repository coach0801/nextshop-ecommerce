# NextShop – Modern E-Commerce Platform

A scalable e-commerce platform built with **Next.js 14**, **PostgreSQL**, **Stripe**, and **Auth.js**. Designed with clean architecture, type safety, and performance in mind.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes / Route Handlers |
| Database | PostgreSQL with Prisma ORM |
| Auth | Auth.js v5 (Google, GitHub OAuth) |
| Payments | Stripe Checkout + Webhooks |
| Validation | Zod |
| Language | TypeScript (strict mode) |

## Features

- **Product Catalog** – Filterable, sortable, paginated product listing with category navigation
- **Product Detail** – Image gallery, reviews, stock status, variant support
- **Shopping Cart** – Server-persisted cart with optimistic UI updates
- **Stripe Checkout** – Secure payment flow with automatic stock management
- **Webhook Handling** – Order fulfillment, stock decrement, refund processing
- **Auth.js Integration** – JWT sessions, role-based access (Customer / Admin)
- **Prisma Schema** – 14 models: products, variants, orders, reviews, addresses
- **Type Safety** – End-to-end TypeScript with Zod validation on all inputs
- **SEO** – Dynamic metadata generation per product page
- **Responsive** – Mobile-first design with Tailwind CSS

## Project Structure

```
nextshop/
├── prisma/
│   ├── schema.prisma       # Database schema (14 models)
│   └── seed.ts             # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/   # GET /api/products (filtered, paginated)
│   │   │   ├── cart/       # GET, POST, PATCH /api/cart
│   │   │   ├── checkout/   # POST /api/checkout (Stripe session)
│   │   │   └── webhooks/
│   │   │       └── stripe/ # Stripe webhook handler
│   │   ├── _components/    # Shared UI components
│   │   ├── products/       # Product listing + detail pages
│   │   ├── cart/           # Cart page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── lib/
│   │   ├── auth.ts         # Auth.js config
│   │   ├── db.ts           # Prisma client singleton
│   │   ├── stripe.ts       # Stripe utilities
│   │   └── utils.ts        # Helper functions
│   ├── types/
│   │   └── index.ts        # Zod schemas + TypeScript types
│   └── middleware.ts        # Route protection
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account (test keys)

### Installation

```bash
git clone https://github.com/coach0801/nextshop-ecommerce.git
cd nextshop-ecommerce
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### Stripe Webhook (local development)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (filter, sort, paginate) |
| `GET` | `/api/cart` | Get current user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `PATCH` | `/api/cart` | Update cart item quantity |
| `POST` | `/api/checkout` | Create Stripe checkout session |
| `POST` | `/api/webhooks/stripe` | Handle Stripe events |

## Database Schema

14 models covering the full e-commerce domain:

- **Auth**: User, Account, Session, VerificationToken
- **Catalog**: Category, Product, Variant, Review
- **Cart**: Cart, CartItem
- **Orders**: Order, OrderItem, Address

## License

MIT
