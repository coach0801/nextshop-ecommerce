import Link from "next/link";
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=600",
    slug: "minimal-desk-lamp",
  },
  {
    id: "2",
    name: "Leather Weekender Bag",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    slug: "leather-weekender-bag",
  },
  {
    id: "3",
    name: "Ceramic Pour-Over Set",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    slug: "ceramic-pour-over-set",
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600",
    slug: "wireless-charging-pad",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Server-side rendering with edge caching for instant page loads",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "PCI-compliant checkout powered by Stripe with fraud protection",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders over $100",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Next<span className="text-emerald-600">Shop</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Products
            </Link>
            <Link
              href="/products?category=new-arrivals"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              New Arrivals
            </Link>
            <Link
              href="/products?category=sale"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Sale
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Sign In
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full bg-neutral-900 p-2.5 text-white transition-colors hover:bg-neutral-700"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-600">
              New Collection 2025
            </p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-neutral-900 md:text-6xl">
              Thoughtfully crafted everyday essentials
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-neutral-600">
              Discover our curated collection of premium products designed for
              modern living. Quality materials, timeless design, fair pricing.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700 hover:shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/products?category=new-arrivals"
                className="rounded-full border border-neutral-300 px-8 py-3.5 text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-48 -right-16 h-96 w-96 rounded-full bg-emerald-50/80 blur-3xl" />
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-neutral-500">Hand-picked favorites from our catalog</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>
              <h3 className="font-medium text-neutral-900">{product.name}</h3>
              <p className="mt-1 text-sm font-semibold text-neutral-600">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-neutral-500">
              © 2025 NextShop. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-700">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-700">
                Terms
              </Link>
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-700">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
