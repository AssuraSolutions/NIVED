"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, ShoppingCart, } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAdminProducts } from "@/lib/products"
import { getCustomOrders } from "@/lib/custom-orders"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import type { CustomOrder as CustomOrderBase } from "@/lib/types"

// Extend CustomOrder type to include totalPrice if missing
type CustomOrder = CustomOrderBase & { totalPrice?: number }

export default function AdminDashboard() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([getAdminProducts(), getCustomOrders()])
      setProducts(productsData)
      setCustomOrders(ordersData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  // Calculate statistics
  const publishedProducts = products.filter((p) => p.isPublished)
  const draftProducts = products.filter((p) => !p.isPublished)
  const pendingOrders = customOrders.filter((order) => order.status === "pending")


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a55c]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-playfair">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-[#c9a55c] mr-2" />
                <span className="text-2xl font-bold">{products.length}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {publishedProducts.length} published, {draftProducts.length} drafts
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Custom Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-[#c9a55c] mr-2" />
                <span className="text-2xl font-bold">{customOrders.length}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{pendingOrders.length} pending orders</p>
            </CardContent>
          </Card>      
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Recent Custom Orders */}
          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader>
              <CardTitle>Recent Custom Orders</CardTitle>
              <CardDescription>Latest custom printing requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.name}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }
                        >
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.totalPrice?.toFixed(2) || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button
                  variant="outline"
                  asChild
                  className="w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                >
                  <Link href="/admin/custom-orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
