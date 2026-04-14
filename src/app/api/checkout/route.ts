import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createCheckoutSession, formatAmountForStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/types";
import { generateOrderNumber, getBaseUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { shippingAddress } = checkoutSchema.parse(body);

    // Fetch cart with items
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${item.product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    // Create shipping address
    const address = await db.address.create({
      data: {
        ...shippingAddress,
        userId: session.user.id,
      },
    });

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        subtotal,
        tax,
        shipping,
        total,
        userId: session.user.id,
        shippingAddressId: address.id,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Create Stripe checkout session
    const baseUrl = getBaseUrl();
    const stripeSession = await createCheckoutSession({
      orderId: order.id,
      customerEmail: session.user.email,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout/cancelled`,
      lineItems: cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: item.product.images.slice(0, 1),
          },
          unit_amount: formatAmountForStripe(Number(item.product.price)),
        },
        quantity: item.quantity,
      })),
    });

    // Store Stripe session ID on order
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({
      success: true,
      data: { checkoutUrl: stripeSession.url },
    });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
