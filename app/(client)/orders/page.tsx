"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Eye, Search, Filter, Download, CalendarIcon, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  size?: string
  color?: string
}

export default function OrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, statusFilter, dateRange, sortBy])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const mockOrders: Order[] = [
        {
          id: "1",
          orderNumber: "ORD-001234",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1234567890",
          items: [
            {
              id: "1",
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
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          orderNumber: "ORD-001235",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerPhone: "+1234567891",
          items: [
            {
              id: "2",
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
          createdAt: "2024-01-14T14:20:00Z",
          updatedAt: "2024-01-16T09:15:00Z",
        },
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (dateRange.from) {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((order) => new Date(order.createdAt) <= dateRange.to!)
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "amount-high":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount)
        break
      case "amount-low":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount)
        break
    }

    setFilteredOrders(filtered)
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      PROCESSING: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
      SHIPPED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
      DELIVERED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border flex items-center gap-1 font-medium`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateRange({ from: undefined, to: undefined })
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-playfair text-gray-900">Your Orders</h1>
              <p className="text-gray-600 mt-1">Track your order history and status</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] hover:bg-[#c9a55c] hover:text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-6 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search Orders</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Order ID, customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c] focus:border-[#b08d4a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date Range</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]",
                            !dateRange.from && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange as { from: Date; to?: Date }}
                          onSelect={(range) => setDateRange(range ?? { from: undefined, to: undefined })}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                        <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {filteredOrders.length} of {orders.length} orders
                  </div>
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-[#c9a55c] hover:text-[#b08d4a] hover:bg-[#c9a55c]/10"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Orders ({filteredOrders.length})</span>
                <div className="flex gap-2">
                  {!showFilters && (
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                          <SelectItem value="amount-high">Amount ↓</SelectItem>
                          <SelectItem value="amount-low">Amount ↑</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a55c]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <img
                                    key={index}
                                    src={item.productImage || "/placeholder.svg"}
                                    alt={item.productName}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                              <p className="text-xs text-gray-500">{format(new Date(order.createdAt), "HH:mm")}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedOrder(order)}
                                  className="hover:bg-[#c9a55c]/10"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center justify-between">
                                    <span>Order Details - {selectedOrder?.orderNumber}</span>
                                    {selectedOrder && getStatusBadge(selectedOrder.status)}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Order Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <p>
                                            <span className="font-medium">Order Date:</span>{" "}
                                            {format(new Date(selectedOrder.createdAt), "PPP")}
                                          </p>
                                          <p>
                                            <span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}
                                          </p>
                                          <p>
                                            <span className="font-medium">Total:</span> $
                                            {selectedOrder.totalAmount.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Shipping Address</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                          {selectedOrder.shippingAddress}
                                        </p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                                      <div className="space-y-3">
                                        {selectedOrder.items.map((item) => (
                                          <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                          >
                                            <img
                                              src={item.productImage || "/placeholder.svg"}
                                              alt={item.productName}
                                              className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                              <h5 className="font-medium text-gray-900">{item.productName}</h5>
                                              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                                <span>Qty: {item.quantity}</span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-medium">${item.price.toFixed(2)}</p>
                                              <p className="text-sm text-gray-600">each</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!loading && filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {orders.length === 0
                      ? "You haven't placed any orders yet."
                      : "Try adjusting your filters to find what you're looking for."}
                  </p>
                  {orders.length > 0 && (
                    <Button
                      onClick={clearFilters}
                      className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
