import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    // Build where clause
    const where: any = {
      isPublished: true, // Only show published products
    }
   
    
    if (featured === "true") {
      where.isFeatured = true;
    }

    // Filter by category
    if (category && category !== "all") {
      where.category = {
        equals: category,
        mode: "insensitive",
      }
    }

    // Filter by search
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      where,
      take: limit ? Number.parseInt(limit) : undefined,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || body.description,
        price: Number.parseFloat(body.price),
        images: body.images || [],
        availableSizes: body.availableSizes || [],
        colors: body.colors || [],
        tags: body.tags || [],
        isLimited: body.isLimited || false,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
        clothingType: body.clothingType, // Add this line to include the required property
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
