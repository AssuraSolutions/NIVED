import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.customOrder.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: "Custom order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching custom order:", error)
    return NextResponse.json({ error: "Failed to fetch custom order" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.estimatedCompletion !== undefined) updateData.estimatedCompletion = new Date(body.estimatedCompletion)

    const order = await prisma.customOrder.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating custom order:", error)
    return NextResponse.json({ error: "Failed to update custom order" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.customOrder.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Custom order deleted successfully" })
  } catch (error) {
    console.error("Error deleting custom order:", error)
    return NextResponse.json({ error: "Failed to delete custom order" }, { status: 500 })
  }
}
