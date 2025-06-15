import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.longDescription !== undefined) updateData.longDescription = body.longDescription
    if (body.price !== undefined) updateData.price = Number.parseFloat(body.price)
    if (body.category !== undefined) updateData.category = body.category
    if (body.images !== undefined) updateData.images = Array.isArray(body.images) ? body.images : []
    if (body.availableSizes !== undefined)
      updateData.availableSizes = Array.isArray(body.availableSizes) ? body.availableSizes : []
    if (body.colors !== undefined) updateData.colors = Array.isArray(body.colors) ? body.colors : []
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : []
    if (body.stock !== undefined) updateData.stock = Number.parseInt(body.stock)
    if (body.isLimited !== undefined) updateData.isLimited = Boolean(body.isLimited)
    if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished)

    updateData.updatedAt = new Date()

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
