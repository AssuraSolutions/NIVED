"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, EyeOff, Globe, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAdminProducts, publishProduct, unpublishProduct } from "@/lib/products"
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

  const handlePublishToggle = async (product: Product) => {
    try {
      if (product.isPublished) {
        await unpublishProduct(product.id)
        toast({
          title: "Product Unpublished",
          description: `${product.name} has been moved to drafts.`,
        })
      } else {
        await publishProduct(product.id)
        toast({
          title: "Product Published",
          description: `${product.name} is now live on the website.`,
        })
      }
      loadDashboardData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      })
    }
  }

  // Calculate statistics
  const publishedProducts = products.filter((p) => p.isPublished)
  const draftProducts = products.filter((p) => !p.isPublished)
  const totalRevenue = customOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  const pendingOrders = customOrders.filter((order) => order.status === "pending")

  const getStatusBadge = (product: Product) => {
    if (product.isPublished) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <Globe className="h-3 w-3 mr-1" />
          Published
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <FileText className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      )
    }
  }

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

          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-[#c9a55c] mr-2" />
                <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
              </div>
              <p className="text-xs text-green-500 mt-1">From custom orders</p>
            </CardContent>
          </Card>

          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-[#c9a55c] mr-2" />
                <span className="text-2xl font-bold">{products.filter((p) => (p.stock ?? 0) < 10).length}</span>
              </div>
              <p className="text-xs text-red-500 mt-1">Need restocking</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest clothing items added to inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 5).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">${product.price}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product)}</TableCell>
                      <TableCell>
                        <span className={(product.stock ?? 0) < 10 ? "text-red-500 font-medium" : ""}>{product.stock ?? 0}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePublishToggle(product)}
                          title={product.isPublished ? "Unpublish" : "Publish"}
                        >
                          {product.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </TableCell>
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
                  <Link href="/admin/clothing">View All Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

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
