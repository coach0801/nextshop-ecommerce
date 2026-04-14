import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Gadgets and tech essentials",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture, decor, and lifestyle products",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessories",
        slug: "accessories",
        description: "Bags, wallets, and everyday carry",
      },
    }),
    prisma.category.create({
      data: {
        name: "Kitchen",
        slug: "kitchen",
        description: "Cookware and kitchen essentials",
      },
    }),
  ]);

  const [electronics, home, accessories, kitchen] = categories;

  // Create products
  const products = [
    {
      name: "Wireless Charging Pad",
      slug: "wireless-charging-pad",
      description:
        "Sleek Qi-compatible wireless charger with anti-slip surface. Supports up to 15W fast charging for all modern smartphones.",
      price: 39.99,
      sku: "NS-CHRG-001",
      stock: 150,
      images: [
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
      ],
      featured: true,
      status: "ACTIVE" as const,
      categoryId: electronics.id,
    },
    {
      name: "Minimal Desk Lamp",
      slug: "minimal-desk-lamp",
      description:
        "Adjustable LED desk lamp with three color temperatures and touch-sensitive controls. Crafted from brushed aluminum.",
      price: 89.99,
      sku: "NS-LAMP-001",
      stock: 75,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=800",
      ],
      featured: true,
      status: "ACTIVE" as const,
      categoryId: home.id,
    },
    {
      name: "Leather Weekender Bag",
      slug: "leather-weekender-bag",
      description:
        "Full-grain leather weekender bag with canvas lining, brass hardware, and a detachable shoulder strap. Perfect for short trips.",
      price: 249.99,
      compareAtPrice: 299.99,
      sku: "NS-BAG-001",
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      ],
      featured: true,
      status: "ACTIVE" as const,
      categoryId: accessories.id,
    },
    {
      name: "Ceramic Pour-Over Set",
      slug: "ceramic-pour-over-set",
      description:
        "Handcrafted ceramic pour-over coffee dripper with matching server. Produces a clean, full-bodied cup every time.",
      price: 64.99,
      sku: "NS-COFFEE-001",
      stock: 45,
      images: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      ],
      featured: true,
      status: "ACTIVE" as const,
      categoryId: kitchen.id,
    },
    {
      name: "Noise-Cancelling Headphones",
      slug: "noise-cancelling-headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and memory foam ear cushions.",
      price: 199.99,
      compareAtPrice: 249.99,
      sku: "NS-HEAD-001",
      stock: 60,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      ],
      status: "ACTIVE" as const,
      categoryId: electronics.id,
    },
    {
      name: "Linen Throw Blanket",
      slug: "linen-throw-blanket",
      description:
        "Stonewashed French linen throw in a soft neutral tone. Lightweight and breathable for year-round comfort.",
      price: 119.99,
      sku: "NS-LINEN-001",
      stock: 40,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      ],
      status: "ACTIVE" as const,
      categoryId: home.id,
    },
    {
      name: "Minimalist Wallet",
      slug: "minimalist-wallet",
      description:
        "Slim card holder crafted from vegetable-tanned leather. Holds up to 8 cards with a center cash slot.",
      price: 49.99,
      sku: "NS-WALL-001",
      stock: 200,
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
      ],
      status: "ACTIVE" as const,
      categoryId: accessories.id,
    },
    {
      name: "Cast Iron Skillet",
      slug: "cast-iron-skillet",
      description:
        "Pre-seasoned 12-inch cast iron skillet with helper handle. Even heat distribution and a lifetime of cooking ahead.",
      price: 59.99,
      sku: "NS-IRON-001",
      stock: 85,
      images: [
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
      ],
      status: "ACTIVE" as const,
      categoryId: kitchen.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Seed complete: 4 categories, 8 products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
