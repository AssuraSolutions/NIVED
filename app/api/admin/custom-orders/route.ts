import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}

    if (status) {
      where.status = status
    }

    const orders = await prisma.customOrder.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error in admin custom orders API:", error)
    return NextResponse.json({ error: "Failed to fetch custom orders" }, { status: 500 })
  }
}
