"use client";

import { useState } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";

interface Props {
  productId: string;
  disabled?: boolean;
}

export function AddToCartButton({ productId, disabled }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleAddToCart() {
    setStatus("loading");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center overflow-hidden rounded-xl border border-neutral-200">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-50"
          disabled={disabled}
        >
          −
        </button>
        <span className="min-w-[3rem] text-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-50"
          disabled={disabled}
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || status === "loading"}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
          status === "success"
            ? "bg-emerald-500 text-white"
            : disabled
            ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
            : "bg-neutral-900 text-white hover:bg-neutral-700"
        }`}
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
