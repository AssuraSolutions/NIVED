"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, MessageSquare, CheckCircle, Clock, XCircle, Filter, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCustomOrders, updateCustomOrderStatus } from "@/lib/custom-orders"
import type { CustomOrder } from "@/lib/types"
// import the correct OrderStatus type if it exists, or define it here if missing
type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export default function CustomOrdersPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all")
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomOrders()
  }, [activeTab])

  const loadCustomOrders = async () => {
    setLoading(true)
    try {
      const orders = await getCustomOrders(activeTab === "all" ? undefined : (activeTab as OrderStatus))
      setCustomOrders(orders)
    } catch (error) {
      console.error("Error loading custom orders:", error)
      toast({
        title: "Error",
        description: "Failed to load custom orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateCustomOrderStatus(orderId, newStatus)
      loadCustomOrders()
      toast({
        title: "Order status updated",
        description: `Order has been marked as ${newStatus.toLowerCase().replace("_", " ")}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      IN_PROGRESS: { color: "bg-blue-100 text-blue-800", icon: Clock },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-playfair">Custom Orders</h1>
          <Button variant="outline" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <Filter className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus | "all")} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 h-auto p-1">
            <TabsTrigger value="all" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              All Orders
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Pending
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Completed
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
          <CardHeader>
            <CardTitle>Custom Print Orders ({customOrders.length} orders)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a55c]"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{order.productType}</p>
                          <p className="text-sm text-gray-500">
                            {order.size} • {order.color}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalPrice?.toFixed(2) || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white">
                              <DialogHeader>
                                <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-bold mb-2">Customer Information</h4>
                                      <p>
                                        <strong>Name:</strong> {selectedOrder.customerName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedOrder.customerEmail}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {selectedOrder.customerPhone}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-bold mb-2">Order Information</h4>
                                      <p>
                                        <strong>Product:</strong> {selectedOrder.productType}
                                      </p>
                                      <p>
                                        <strong>Size:</strong> {selectedOrder.size}
                                      </p>
                                      <p>
                                        <strong>Color:</strong> {selectedOrder.color}
                                      </p>
                                      <p>
                                        <strong>Quantity:</strong> {selectedOrder.quantity}
                                      </p>
                                      <p>
                                        <strong>Total:</strong> ${selectedOrder.totalPrice?.toFixed(2) || "N/A"}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-bold mb-2">Design Notes</h4>
                                    <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.designNotes}</p>
                                  </div>

                                  {/* Design Files Section */}
                                  {selectedOrder.designFiles && selectedOrder.designFiles.length > 0 && (
                                    <div>
                                      <h4 className="font-bold mb-2 flex items-center gap-2">
                                        <FileImage className="h-4 w-4" />
                                        Design Files ({selectedOrder.designFiles.length})
                                      </h4>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedOrder.designFiles.map((fileUrl, index) => (
                                          <div key={index} className="relative group">
                                            <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                                              <Image
                                                src={fileUrl || "/placeholder.svg"}
                                                alt={`Design file ${index + 1}`}
                                                fill
                                                className="object-cover"
                                              />
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 text-center">Design {index + 1}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {selectedOrder.designFileUrl && !selectedOrder.designFiles && (
                                    <div>
                                      <h4 className="font-bold mb-2">Design File</h4>
                                      <p className="text-blue-600 underline">{selectedOrder.designFileUrl}</p>
                                    </div>
                                  )}

                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "IN_PROGRESS")}
                                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                                      disabled={selectedOrder.status === "IN_PROGRESS"}
                                    >
                                      Mark In Progress
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "COMPLETED")}
                                      className="bg-green-600 hover:bg-green-700 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                                      disabled={selectedOrder.status === "COMPLETED"}
                                    >
                                      Mark Completed
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "CANCELLED")}
                                      variant="destructive"
                                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                                      disabled={selectedOrder.status === "CANCELLED"}
                                    >
                                      Cancel Order
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
