import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { productFilterSchema } from "@/types";
import type { ApiResponse } from "@/types";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = productFilterSchema.parse(Object.fromEntries(searchParams));

    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
    };

    if (filters.category) {
      where.category = { slug: filters.category };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
      switch (filters.sort) {
        case "price_asc":
          return { price: "asc" as const };
        case "price_desc":
          return { price: "desc" as const };
        case "newest":
          return { createdAt: "desc" as const };
        case "popular":
          return { reviews: { _count: "desc" as const } };
        default:
          return { createdAt: "desc" as const };
      }
    })();

    const skip = (filters.page - 1) * filters.limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    const response: ApiResponse = {
      success: true,
      data: products,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
