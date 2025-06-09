import { type NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/orders"
import type { OrderFilters, OrderStatus } from "@/lib/orders"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters: OrderFilters = {}

    const status = searchParams.get("status")
    if (status) {
      filters.status = status as OrderStatus
    }

    const search = searchParams.get("search")
    if (search) {
      filters.search = search
    }

    const startDate = searchParams.get("startDate")
    if (startDate) {
      filters.startDate = new Date(startDate)
    }

    const endDate = searchParams.get("endDate")
    if (endDate) {
      filters.endDate = new Date(endDate)
    }

    const orders = await getOrders(filters)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
