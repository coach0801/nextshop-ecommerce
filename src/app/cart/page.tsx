"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartSummary } from "@/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-neutral-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Next<span className="text-emerald-600">Shop</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-neutral-200" />
            <p className="text-lg font-medium text-neutral-600">
              Your cart is empty
            </p>
            <p className="mb-6 mt-1 text-sm text-neutral-400">
              Discover our products and add something you love
            </p>
            <Link
              href="/products"
              className="rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* Items */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-neutral-100 p-4"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium hover:text-emerald-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.id, 0)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl bg-neutral-50 p-6">
              <h3 className="mb-4 font-semibold">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>
                    {cart.subtotal >= 100 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      "$9.99"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (estimated)</span>
                  <span>{formatPrice(cart.subtotal * 0.08)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        cart.subtotal +
                          cart.subtotal * 0.08 +
                          (cart.subtotal >= 100 ? 0 : 9.99)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl bg-neutral-900 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
              >
                Proceed to Checkout
              </Link>
              {cart.subtotal < 100 && (
                <p className="mt-3 text-center text-xs text-neutral-400">
                  Add {formatPrice(100 - cart.subtotal)} more for free shipping
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
