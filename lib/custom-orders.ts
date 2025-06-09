import type { CustomOrder, CreateCustomOrderData, OrderStatus } from "./types"

export async function getCustomOrders(status?: OrderStatus): Promise<CustomOrder[]> {
  try {
    const params = new URLSearchParams()
    if (status) params.append("status", status)

    const response = await fetch(`/api/admin/custom-orders?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching custom orders:", error)
    return []
  }
}

export async function getCustomOrderById(id: string): Promise<CustomOrder | null> {
  try {
    const response = await fetch(`/api/admin/custom-orders/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching custom order by ID:", error)
    return null
  }
}

export async function createCustomOrder(data: CreateCustomOrderData): Promise<CustomOrder> {
  try {
    const response = await fetch("/api/custom-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating custom order:", error)
    throw error
  }
}

export async function updateCustomOrderStatus(
  orderId: string,
  status: OrderStatus,
  estimatedCompletion?: Date,
): Promise<CustomOrder> {
  try {
    const response = await fetch(`/api/admin/custom-orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        estimatedCompletion,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating custom order status:", error)
    throw error
  }
}

export async function deleteCustomOrder(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/custom-orders/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error deleting custom order:", error)
    throw error
  }
}
