export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  paymentStatus: "PENDING" | "PAID" | "FAILED"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderFilters {
  status?: OrderStatus
  startDate?: Date
  endDate?: Date
  search?: string
}

// This function should only be called from server components or API routes
export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  try {
    // Mock data for now - in a real app, this would query the database
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-001234",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        items: [
          {
            id: "item1",
            productId: "prod1",
            productName: "Vintage T-Shirt",
            productImage: "/placeholder.svg?height=60&width=60",
            quantity: 2,
            price: 25.99,
            size: "M",
            color: "Black",
          },
        ],
        status: "PROCESSING",
        totalAmount: 51.98,
        shippingAddress: "123 Main St, City, State 12345",
        paymentMethod: "Credit Card",
        paymentStatus: "PAID",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
      {
        id: "2",
        orderNumber: "ORD-001235",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        customerPhone: "+1234567891",
        items: [
          {
            id: "item2",
            productId: "prod2",
            productName: "Retro Hoodie",
            productImage: "/placeholder.svg?height=60&width=60",
            quantity: 1,
            price: 45.99,
            size: "L",
            color: "Gray",
          },
        ],
        status: "SHIPPED",
        totalAmount: 45.99,
        shippingAddress: "456 Oak Ave, City, State 12345",
        paymentMethod: "PayPal",
        paymentStatus: "PAID",
        createdAt: new Date("2024-01-14T14:20:00Z"),
        updatedAt: new Date("2024-01-16T09:15:00Z"),
      },
      {
        id: "3",
        orderNumber: "ORD-001236",
        customerName: "Robert Johnson",
        customerEmail: "robert@example.com",
        customerPhone: "+1234567892",
        items: [
          {
            id: "item3",
            productId: "prod3",
            productName: "Classic Denim Jacket",
            productImage: "/placeholder.svg?height=60&width=60",
            quantity: 1,
            price: 89.99,
            size: "XL",
            color: "Blue",
          },
          {
            id: "item4",
            productId: "prod4",
            productName: "Vintage Jeans",
            productImage: "/placeholder.svg?height=60&width=60",
            quantity: 1,
            price: 59.99,
            size: "32",
            color: "Dark Blue",
          },
        ],
        status: "DELIVERED",
        totalAmount: 149.98,
        shippingAddress: "789 Pine St, City, State 12345",
        paymentMethod: "Credit Card",
        paymentStatus: "PAID",
        createdAt: new Date("2024-01-10T09:15:00Z"),
        updatedAt: new Date("2024-01-13T14:30:00Z"),
      },
      {
        id: "4",
        orderNumber: "ORD-001237",
        customerName: "Emily Davis",
        customerEmail: "emily@example.com",
        customerPhone: "+1234567893",
        items: [
          {
            id: "item5",
            productId: "prod5",
            productName: "Retro Sunglasses",
            productImage: "/placeholder.svg?height=60&width=60",
            quantity: 2,
            price: 29.99,
            color: "Black",
          },
        ],
        status: "PENDING",
        totalAmount: 59.98,
        shippingAddress: "101 Maple Ave, City, State 12345",
        paymentMethod: "PayPal",
        paymentStatus: "PENDING",
        createdAt: new Date("2024-01-17T16:45:00Z"),
        updatedAt: new Date("2024-01-17T16:45:00Z"),
      },
    ]

    // Apply filters
    let filteredOrders = [...mockOrders]

    if (filters.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
    }

    if (filters.startDate) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt >= filters.startDate!)
    }

    if (filters.endDate) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt <= filters.endDate!)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower),
      )
    }

    return filteredOrders
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    // Mock implementation - in a real app, this would query the database
    const orders = await getOrders()
    return orders.find((order) => order.id === id) || null
  } catch (error) {
    console.error("Error fetching order by ID:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  try {
    // Mock implementation - in a real app, this would update the database
    const order = await getOrderById(id)
    if (!order) {
      throw new Error(`Order with ID ${id} not found`)
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date(),
    }

    // In a real app, save to database here
    console.log(`Updated order ${id} status to ${status}`)

    return updatedOrder
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}
