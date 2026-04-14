import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { addToCartSchema, updateCartItemSchema } from "@/types";
import type { ApiResponse, CartSummary } from "@/types";

// GET /api/cart – Retrieve user's cart
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const items =
      cart?.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
          image: item.product.images[0] || "",
        },
      })) ?? [];

    const summary: CartSummary = {
      items,
      subtotal: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST /api/cart – Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = addToCartSchema.parse(body);

    // Verify product exists and is in stock
    const product = await db.product.findFirst({
      where: { id: productId, status: "ACTIVE" },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Upsert cart
    const cart = await db.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });

    // Upsert cart item
    const cartItem = await db.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return NextResponse.json({ success: true, data: cartItem });
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// PATCH /api/cart – Update cart item quantity
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = updateCartItemSchema.parse(body);

    if (quantity === 0) {
      await db.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ success: true, data: null });
    }

    const updated = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[CART_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
