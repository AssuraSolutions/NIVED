const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existingTypes = await prisma.clothingTypes.findMany();
  let clothingTypes = existingTypes;

  if (existingTypes.length === 0) {
    await prisma.clothingTypes.createMany({
      data: [
        { name: "tshirt", label: "T-Shirt" },
        { name: "hoodie", label: "Hoodie" },
        { name: "joggers", label: "Joggers" },
      ],
    });

    clothingTypes = await prisma.clothingTypes.findMany();
  }

  const typeIds = clothingTypes.map((type) => type.id);

  await prisma.product.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      name: `Sample Product ${i + 1}`,
      description: `Description for product ${i + 1}`,
      longDescription: `Detailed description for product ${i + 1}`,
      price: 10.99 + i,
      availableSizes: ["S", "M", "L"],
      colors: ["Red", "Blue", "Black"],
      tags: ["new", "popular"],
      images: [`/uploads/product-${1}.jpg`],
      isLimited: i % 2 === 0,
      isFeatured: i % 3 === 0,
      isPublished: true,
      clothingTypeId: typeIds[i % typeIds.length],
    })),
  });

  console.log("✅ Seeded 10 products successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

  