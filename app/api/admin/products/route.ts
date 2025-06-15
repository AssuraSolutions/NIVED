import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const isPublished = searchParams.get("isPublished")

    const where: any = {}

    if (category && category !== "all") {
      where.category = {
        equals: category,
        mode: "insensitive",
      }
    }

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

    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === "true"
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in admin products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || null,
        price: Number.parseFloat(body.price),
        category: body.category,
        images: Array.isArray(body.images) ? body.images : [],
        availableSizes: Array.isArray(body.availableSizes) ? body.availableSizes : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        stock: Number.parseInt(body.stock) || 0,
        isLimited: Boolean(body.isLimited),
        isPublished: Boolean(body.isPublished),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
