import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate order number
    const orderNumber = `CO-${Date.now().toString().slice(-6)}`

    const order = await prisma.customOrder.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        productType: body.productType,
        size: body.size,
        color: body.color,
        quantity: Number.parseInt(body.quantity) || 1,
        designNotes: body.designNotes,
        designFileUrl: body.designFileUrl || null,
        totalPrice: body.totalPrice ? Number.parseFloat(body.totalPrice) : null,
        status: "PENDING",
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating custom order:", error)
    return NextResponse.json({ error: "Failed to create custom order" }, { status: 500 })
  }
}
