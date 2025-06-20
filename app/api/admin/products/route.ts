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
      where.clothingType = {
        name: {
          equals: category,
          mode: "insensitive",
        },
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


    const [products, clothingTypes] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          clothingType: true,
        },
      }),
      prisma.clothingTypes.findMany({
        select: {
          id: true,
          label: true,
        },
      }),
    ])

    return NextResponse.json({ products, clothingTypes })
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
        clothingTypeId: Number(body.clothingTypeId), // required: must match a real ClothingType ID
        images: Array.isArray(body.images) ? body.images : [],
        availableSizes: Array.isArray(body.availableSizes) ? body.availableSizes : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
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
