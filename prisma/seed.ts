import { PrismaClient, OrderStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log("🧹 Clearing existing data...")
  await prisma.customOrder.deleteMany()
  await prisma.product.deleteMany()

  console.log("📦 Seeding products...")

  // Seed products with multiple images and comprehensive data
  const products = [
    {
      name: "Vintage Black Tee",
      description:
        "A classic unisex black t-shirt with a vintage wash and comfortable fit. Made from 100% organic cotton.",
      longDescription:
        "This premium vintage-style t-shirt features a relaxed fit with a slightly distressed finish for that perfect lived-in look. Each piece is carefully crafted using 100% organic cotton that's both sustainable and incredibly soft against your skin. The vintage wash gives it an authentic worn-in feel that only gets better with time.",
      price: 29.99,
      category: "Unisex",
      stock: 45,
      availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["black", "white", "gray", "navy"],
      tags: ["vintage", "cotton", "unisex", "organic"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Vintage+Black+Tee+Front",
        "/placeholder.svg?height=600&width=600&text=Vintage+Black+Tee+Back",
        "/placeholder.svg?height=600&width=600&text=Vintage+Black+Tee+Detail",
        "/placeholder.svg?height=600&width=600&text=Vintage+Black+Tee+Model",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Ceylon Heritage Hoodie",
      description: "Premium hoodie celebrating Sri Lankan heritage with modern comfort and traditional motifs.",
      longDescription:
        "Crafted with love in Ceylon, this hoodie combines traditional Sri Lankan motifs with contemporary design. Features include a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. The heritage-inspired graphics pay homage to the rich cultural tapestry of Sri Lanka while maintaining a modern streetwear aesthetic.",
      price: 59.99,
      category: "Unisex",
      stock: 25,
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["navy", "gray", "black", "maroon"],
      tags: ["heritage", "hoodie", "premium", "sri-lanka"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Ceylon+Heritage+Hoodie+Front",
        "/placeholder.svg?height=600&width=600&text=Ceylon+Heritage+Hoodie+Back",
        "/placeholder.svg?height=600&width=600&text=Ceylon+Heritage+Hoodie+Hood",
        "/placeholder.svg?height=600&width=600&text=Ceylon+Heritage+Hoodie+Detail",
      ],
      isLimited: true,
      isPublished: true,
    },
    {
      name: "Distressed Denim Shirt",
      description:
        "A stylish unisex denim shirt with carefully placed distressing. Perfect for casual outings and layering.",
      longDescription:
        "Crafted from premium denim with carefully placed distressing for an authentic vintage look. This shirt combines durability with style, making it perfect for both casual and semi-formal occasions. The classic cut works well for all body types and can be worn open as a jacket or buttoned up as a shirt.",
      price: 49.99,
      category: "Unisex",
      stock: 32,
      availableSizes: ["S", "M", "L", "XL"],
      colors: ["blue", "black", "light-blue"],
      tags: ["denim", "distressed", "casual", "vintage"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Distressed+Denim+Front",
        "/placeholder.svg?height=600&width=600&text=Distressed+Denim+Back",
        "/placeholder.svg?height=600&width=600&text=Distressed+Denim+Detail",
        "/placeholder.svg?height=600&width=600&text=Distressed+Denim+Styled",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Floral Summer Dress",
      description: "A beautiful floral dress perfect for summer days. Light, airy fabric with a flowing silhouette.",
      longDescription:
        "This elegant summer dress features a delicate floral pattern on breathable fabric. Perfect for warm weather, it offers both comfort and style with its flowing silhouette. The midi length and adjustable straps make it versatile for both casual day wear and evening occasions.",
      price: 59.99,
      category: "Women",
      stock: 28,
      availableSizes: ["XS", "S", "M", "L", "XL"],
      colors: ["floral-pink", "floral-blue", "white", "cream"],
      tags: ["summer", "floral", "dress", "feminine"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Floral+Summer+Dress+Front",
        "/placeholder.svg?height=600&width=600&text=Floral+Summer+Dress+Back",
        "/placeholder.svg?height=600&width=600&text=Floral+Summer+Dress+Detail",
        "/placeholder.svg?height=600&width=600&text=Floral+Summer+Dress+Model",
      ],
      isLimited: true,
      isPublished: true,
    },
    {
      name: "Kids Adventure Tee",
      description:
        "A fun graphic t-shirt for kids with playful adventure-themed designs. Made from soft, breathable cotton.",
      longDescription:
        "Designed specifically for young adventurers, this graphic tee features vibrant colors and fun adventure-themed designs that kids love. Made from soft, breathable cotton for all-day comfort during play. The designs are printed with eco-friendly inks that won't fade after washing.",
      price: 19.99,
      category: "Kids",
      stock: 50,
      availableSizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12"],
      colors: ["red", "blue", "green", "yellow", "purple"],
      tags: ["kids", "graphic", "cotton", "adventure"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Kids+Adventure+Tee+Front",
        "/placeholder.svg?height=600&width=600&text=Kids+Adventure+Tee+Back",
        "/placeholder.svg?height=600&width=600&text=Kids+Adventure+Tee+Detail",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Limited Edition Artisan Hoodie",
      description:
        "Exclusive limited edition hoodie with unique hand-drawn artwork. Only 50 pieces available worldwide.",
      longDescription:
        "This exclusive hoodie is part of our limited edition artisan collection. Featuring unique hand-drawn artwork by local Sri Lankan artists, only 50 pieces will ever be made. Each hoodie comes with a certificate of authenticity and supports local artists. Premium materials and construction ensure this piece will be treasured for years to come.",
      price: 89.99,
      category: "Unisex",
      stock: 15,
      availableSizes: ["S", "M", "L", "XL"],
      colors: ["black", "gray", "cream"],
      tags: ["limited", "hoodie", "exclusive", "artisan", "hand-drawn"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Limited+Artisan+Hoodie+Front",
        "/placeholder.svg?height=600&width=600&text=Limited+Artisan+Hoodie+Back",
        "/placeholder.svg?height=600&width=600&text=Limited+Artisan+Hoodie+Art",
        "/placeholder.svg?height=600&width=600&text=Limited+Artisan+Hoodie+Certificate",
      ],
      isLimited: true,
      isPublished: true,
    },
    {
      name: "Classic Polo Shirt",
      description: "Timeless polo shirt perfect for both casual and semi-formal occasions. Premium cotton blend.",
      longDescription:
        "This classic polo shirt is a wardrobe essential that never goes out of style. Made from a premium cotton blend that's both comfortable and durable. Features include a traditional collar, three-button placket, and side vents for ease of movement. Perfect for golf, casual Fridays, or weekend outings.",
      price: 39.99,
      category: "Unisex",
      stock: 40,
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["white", "navy", "black", "red", "green"],
      tags: ["polo", "classic", "cotton", "versatile"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Classic+Polo+Front",
        "/placeholder.svg?height=600&width=600&text=Classic+Polo+Back",
        "/placeholder.svg?height=600&width=600&text=Classic+Polo+Collar",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Bohemian Maxi Dress",
      description:
        "Flowing bohemian-style maxi dress with intricate patterns. Perfect for festivals and summer events.",
      longDescription:
        "Embrace your free spirit with this stunning bohemian maxi dress. Features flowing fabric, intricate patterns inspired by traditional textiles, and a comfortable fit that moves with you. Perfect for music festivals, beach vacations, or any occasion where you want to feel effortlessly stylish.",
      price: 69.99,
      category: "Women",
      stock: 20,
      availableSizes: ["XS", "S", "M", "L"],
      colors: ["multi-pattern", "earth-tones", "sunset"],
      tags: ["bohemian", "maxi", "dress", "festival", "flowing"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Bohemian+Maxi+Front",
        "/placeholder.svg?height=600&width=600&text=Bohemian+Maxi+Back",
        "/placeholder.svg?height=600&width=600&text=Bohemian+Maxi+Pattern",
        "/placeholder.svg?height=600&width=600&text=Bohemian+Maxi+Flow",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Tech Fabric Performance Tee",
      description:
        "High-performance athletic tee with moisture-wicking technology. Perfect for workouts and active lifestyle.",
      longDescription:
        "Engineered for performance, this athletic tee features advanced moisture-wicking technology that keeps you dry and comfortable during intense workouts. The lightweight, breathable fabric moves with your body while providing UV protection. Flatlock seams prevent chafing, making it perfect for running, gym sessions, or any active pursuit.",
      price: 34.99,
      category: "Unisex",
      stock: 60,
      availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["black", "gray", "navy", "red", "neon-green"],
      tags: ["performance", "athletic", "moisture-wicking", "tech-fabric"],
      images: [
        "/placeholder.svg?height=600&width=600&text=Performance+Tee+Front",
        "/placeholder.svg?height=600&width=600&text=Performance+Tee+Back",
        "/placeholder.svg?height=600&width=600&text=Performance+Tee+Action",
      ],
      isLimited: false,
      isPublished: true,
    },
    {
      name: "Vintage Band Tee - Draft",
      description: "Vintage-inspired band tee with retro graphics. Currently in development.",
      longDescription:
        "This vintage-inspired band tee is currently in development. Will feature authentic retro graphics and premium vintage wash treatment.",
      price: 32.99,
      category: "Unisex",
      stock: 0,
      availableSizes: ["S", "M", "L", "XL"],
      colors: ["black", "gray"],
      tags: ["vintage", "band", "retro", "draft"],
      images: ["/placeholder.svg?height=600&width=600&text=Vintage+Band+Tee+Draft"],
      isLimited: false,
      isPublished: false, // Draft product
    },
  ]

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    })
    console.log(`✅ Created product: ${createdProduct.name}`)
  }

  console.log("📋 Seeding custom orders...")

  // Seed sample custom orders
  const customOrders = [
    {
      orderNumber: "CO-001234",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "+94771234567",
      productType: "Custom T-shirt",
      size: "L",
      color: "Black",
      quantity: 2,
      designNotes:
        "Company logo on front chest area, company name on back in large letters. Logo should be white on black shirt.",
      status: OrderStatus.PENDING,
      totalPrice: 45.99,
    },
    {
      orderNumber: "CO-001235",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      customerPhone: "+94777654321",
      productType: "Custom Hoodie",
      size: "M",
      color: "Navy Blue",
      quantity: 1,
      designNotes: "Custom artwork provided via email. Please print on front center. High quality print required.",
      designFileUrl: "custom-artwork-jane.png",
      status: OrderStatus.IN_PROGRESS,
      totalPrice: 65.99,
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      orderNumber: "CO-001236",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@example.com",
      customerPhone: "+94712345678",
      productType: "Custom Polo Shirt",
      size: "XL",
      color: "White",
      quantity: 5,
      designNotes: "Team uniforms for cricket club. Team logo on left chest, player names and numbers on back.",
      status: OrderStatus.COMPLETED,
      totalPrice: 199.95,
      estimatedCompletion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      orderNumber: "CO-001237",
      customerName: "Sarah Wilson",
      customerEmail: "sarah.wilson@example.com",
      customerPhone: "+94765432109",
      productType: "Custom Tank Top",
      size: "S",
      color: "Pink",
      quantity: 3,
      designNotes: "Bachelorette party shirts with custom text 'Sarah's Squad' and wedding date.",
      status: OrderStatus.COMPLETED,
      totalPrice: 89.97,
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
    {
      orderNumber: "CO-001238",
      customerName: "David Brown",
      customerEmail: "david.brown@example.com",
      customerPhone: "+94723456789",
      productType: "Custom Sweatshirt",
      size: "L",
      color: "Gray",
      quantity: 1,
      designNotes: "Personal design for birthday gift. Vintage-style typography with birth year.",
      status: OrderStatus.CANCELLED,
      totalPrice: 55.99,
    },
  ]

  for (const order of customOrders) {
    const createdOrder = await prisma.customOrder.create({
      data: order,
    })
    console.log(`✅ Created custom order: ${createdOrder.orderNumber}`)
  }

  console.log("🎉 Database seeding completed successfully!")
  console.log(`📊 Summary:`)
  console.log(`   - Products created: ${products.length}`)
  console.log(`   - Custom orders created: ${customOrders.length}`)
  console.log(`   - Published products: ${products.filter((p) => p.isPublished).length}`)
  console.log(`   - Draft products: ${products.filter((p) => !p.isPublished).length}`)
  console.log(`   - Limited edition items: ${products.filter((p) => p.isLimited).length}`)
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log("🔌 Database connection closed")
  })
