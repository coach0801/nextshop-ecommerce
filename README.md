# NextShop - Modern E-Commerce Platform

Scalable e-commerce platform built with Next.js 14, PostgreSQL, Stripe, and Auth.js.
Designed with clean architecture, type safety, and performance in mind.

## Tech Stack

Next.js 14, React 18, Tailwind CSS, PostgreSQL, Prisma ORM, Auth.js v5, Stripe, Zod, Zustand, TypeScript

## Features

- Product Catalog - filterable, sortable, paginated
- Shopping Cart - server-persisted with optimistic UI
- Stripe Checkout - secure payments with stock management
- Webhook Handling - order fulfillment, refunds
- Auth.js - JWT sessions, role-based access
- Prisma Schema - 14 models covering full e-commerce domain
- Type Safety - end-to-end TypeScript with Zod validation

## Getting Started

```bash
git clone https://github.com/coach0801/nextshop-ecommerce.git
cd nextshop-ecommerce
npm install
cp .env.example .env
npx prisma generate && npx prisma db push && npx prisma db seed
npm run dev
```

## License

MIT
