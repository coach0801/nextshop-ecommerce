import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/app/_components/add-to-cart-button";
import { Star } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | NextShop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, status: "ACTIVE" },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

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
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-600">Products</Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-neutral-600"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-neutral-600">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-xl bg-neutral-100"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-600">
              {product.category.name}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product._count.reviews > 0 && (
              <div className="mb-6 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">
                  {avgRating.toFixed(1)} ({product._count.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(Number(product.price))}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(Number(product.compareAtPrice))}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mb-8 leading-relaxed text-neutral-600">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-emerald-600">
                  ✓ In stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm font-medium text-red-500">Out of stock</p>
              )}
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              productId={product.id}
              disabled={product.stock === 0}
            />

            {/* SKU */}
            <p className="mt-6 text-xs text-neutral-400">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-neutral-100 p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-500">
                      {review.user.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.user.name}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="mb-1 font-medium">{review.title}</h4>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {review.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
