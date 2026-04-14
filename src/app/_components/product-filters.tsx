"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  name: string;
  slug: string;
  _count: { products: number };
}

interface Props {
  categories: Category[];
  activeCategory?: string;
  activeSort?: string;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Popular", value: "popular" },
];

export function ProductFilters({ categories, activeCategory, activeSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Categories
        </h3>
        <div className="space-y-1">
          <Link
            href="/products"
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              !activeCategory
                ? "bg-neutral-900 font-medium text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                activeCategory === cat.slug
                  ? "bg-neutral-900 font-medium text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-60">{cat._count.products}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Sort By
        </h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeSort === opt.value
                  ? "bg-neutral-900 font-medium text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
