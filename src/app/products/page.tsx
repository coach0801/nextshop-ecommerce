import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ProductFilters } from "@/app/_components/product-filters";

interface Props {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
  };
}

async function getProducts(params: Props["searchParams"]) {
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: any = { status: "ACTIVE" };
  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = (() => {
    switch (params.sort) {
      case "price_asc": return { price: "asc" };
      case "price_desc": return { price: "desc" };
      case "newest": return { createdAt: "desc" };
      default: return { createdAt: "desc" };
    }
  })();

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
    }),
    db.product.count({ where }),
    db.category.findMany({
      select: { name: true, slug: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { products, total, categories, page, limit };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { products, total, categories, page, limit } = await getProducts(searchParams);
  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Next<span className="text-emerald-600">Shop</span>
          </Link>
          <Link
            href="/cart"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
          >
            Cart
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="mt-1 text-neutral-500">{total} products found</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Filters */}
          <aside>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-neutral-100" />}>
              <ProductFilters
                categories={categories}
                activeCategory={searchParams.category}
                activeSort={searchParams.sort}
              />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <div>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-neutral-600">No products found</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {product.compareAtPrice && (
                        <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-neutral-900 group-hover:text-emerald-600">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-neutral-400">
                          {product.category.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(Number(product.price))}
                        </p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-neutral-400 line-through">
                            {formatPrice(Number(product.compareAtPrice))}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={{
                      pathname: "/products",
                      query: { ...searchParams, page: p.toString() },
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
