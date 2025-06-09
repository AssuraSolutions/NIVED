import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("id")
    const limit = Number.parseInt(searchParams.get("limit") || "4")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get the current product to find its category
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    })

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [{ id: { not: productId } }, { category: currentProduct.category }, { isPublished: true }],
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(relatedProducts)
  } catch (error) {
    console.error("Error fetching related products:", error)
    return NextResponse.json({ error: "Failed to fetch related products" }, { status: 500 })
  }
}
