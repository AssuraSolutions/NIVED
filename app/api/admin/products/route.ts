import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const isPublished = searchParams.get("isPublished")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const skip = (page - 1) * limit

    let clothingTypeIdsMatchingSearch: number[] = []

    //Search 
    if (search) {
      const matchingClothingTypes = await prisma.clothingTypes.findMany({
        where: {
          label: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: { id: true },
      })

      clothingTypeIdsMatchingSearch = matchingClothingTypes.map((type) => type.id)
    }

    const where: any = {}

    const categoryId = Number(category)
    if (category && category !== "all" && !isNaN(categoryId)) {
      where.clothingTypeId = categoryId
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

        ...(clothingTypeIdsMatchingSearch.length > 0
          ? [{ clothingTypeId: { in: clothingTypeIdsMatchingSearch } }]
          : []),
      ]
    }

      // if (isPublished === "published") {
      //   where.isPublished = true
      // } else if (isPublished === "unpublished") {
      //   where.isPublished = false
      // }

  const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          clothingType: true,
        },
      }),
      prisma.product.count({ where }), 
    ])

    const hasNextPage = skip + limit < totalCount

    return NextResponse.json({ products, hasNextPage, totalCount })
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
        price: parseFloat(body.price),
        clothingTypeId: Number(body.clothingTypeId),
        images: Array.isArray(body.images) ? body.images : [],
        availableSizes: Array.isArray(body.availableSizes) ? body.availableSizes : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        isLimited: Boolean(body.isLimited),
        isPublished: Boolean(body.isPublished),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error.message || error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}