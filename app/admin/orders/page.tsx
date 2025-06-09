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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Search,
  Download,
  CalendarIcon,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Order, OrderStatus } from "@/lib/orders"

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Filter states
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined })
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadOrders()
  }, [activeTab])

  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, dateRange, sortBy])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from the API
      const response = await fetch(`/api/orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`)
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update order status")

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order,
        ),
      )

      // If the selected order is the one being updated, update it too
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, updatedAt: new Date() } : null))
      }

      toast({
        title: "Order updated",
        description: `Order ${orderId} has been marked as ${newStatus.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((order) => new Date(order.createdAt) <= dateRange.to!)
    }

    // Sort
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

  const getStatusBadge = (status: OrderStatus) => {
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
    setDateRange({ from: undefined })
    setSortBy("newest")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-playfair">Orders Management</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadOrders}
              className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus | "all")} className="mb-6">
          <TabsList className="grid w-full grid-cols-6 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 h-auto p-1">
            <TabsTrigger value="all" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              All Orders
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Pending
            </TabsTrigger>
            <TabsTrigger value="PROCESSING" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Processing
            </TabsTrigger>
            <TabsTrigger value="SHIPPED" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="mb-6 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
          <CardContent className="p-4 flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Order #, customer name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="w-[240px]">
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
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
                    onSelect={(range) => setDateRange(range ?? { from: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort */}
            <div className="w-[200px]">
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
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

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a55c]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-500">{order.customerEmail}</p>
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
                                {order.items.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">
                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                order.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : order.paymentStatus === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                              <p className="text-xs text-gray-500">{format(new Date(order.createdAt), "HH:mm")}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
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
                                      {/* Customer & Order Info */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-gray-900">Customer Information</h4>
                                          <div className="space-y-2 text-sm">
                                            <p>
                                              <span className="font-medium">Name:</span> {selectedOrder.customerName}
                                            </p>
                                            <p>
                                              <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                                            </p>
                                            <p>
                                              <span className="font-medium">Phone:</span> {selectedOrder.customerPhone}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-gray-900">Order Information</h4>
                                          <div className="space-y-2 text-sm">
                                            <p>
                                              <span className="font-medium">Order Date:</span>{" "}
                                              {format(new Date(selectedOrder.createdAt), "PPP")}
                                            </p>
                                            <p>
                                              <span className="font-medium">Payment Method:</span>{" "}
                                              {selectedOrder.paymentMethod}
                                            </p>
                                            <p>
                                              <span className="font-medium">Payment Status:</span>{" "}
                                              <Badge
                                                className={
                                                  selectedOrder.paymentStatus === "PAID"
                                                    ? "bg-green-100 text-green-800"
                                                    : selectedOrder.paymentStatus === "PENDING"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : "bg-red-100 text-red-800"
                                                }
                                              >
                                                {selectedOrder.paymentStatus}
                                              </Badge>
                                            </p>
                                            <p>
                                              <span className="font-medium">Total:</span> $
                                              {selectedOrder.totalAmount.toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Shipping Address */}
                                      <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                          {selectedOrder.shippingAddress}
                                        </p>
                                      </div>

                                      {/* Order Items */}
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

                                      {/* Notes */}
                                      {selectedOrder.notes && (
                                        <div>
                                          <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {selectedOrder.notes}
                                          </p>
                                        </div>
                                      )}

                                      {/* Action Buttons */}
                                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                                        <Select
                                          disabled={updating}
                                          onValueChange={(value) =>
                                            handleUpdateOrderStatus(selectedOrder.id, value as OrderStatus)
                                          }
                                          value={selectedOrder.status}
                                        >
                                          <SelectTrigger className="w-[180px] rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                                            <SelectValue placeholder="Update Status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PROCESSING">Processing</SelectItem>
                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          variant="outline"
                                          className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                                        >
                                          <Printer className="mr-2 h-4 w-4" />
                                          Print Invoice
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                                        >
                                          <MessageSquare className="mr-2 h-4 w-4" />
                                          Contact Customer
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
