"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Pencil, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ClothingPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [clothingTypes, setClothingTypes] = useState<{ id: number; label: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (category = "all", search = "", page = 1) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (category !== "all") queryParams.append("category", category)
      if (search) queryParams.append("search", search)
      queryParams.append("page", page.toString())
      queryParams.append("limit", pageSize.toString())

      const res = await fetch(`/api/admin/products?${queryParams.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch products")

      const data = await res.json()
      setProducts(data.products as Product[])
      setClothingTypes(data.clothingTypes || [])
      setHasNextPage(data.hasNextPage)
    } catch (err) {
      console.error(err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(selectedCategory, searchTerm, page)
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [selectedCategory, searchTerm, page])

  const handleEditProduct = (product: Product) => {
    console.log("Edit product", product)
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
      toast({ title: "Deleted", description: `${name} was removed.` })
      fetchProducts(selectedCategory, searchTerm, page)
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
  }

  const getStatusBadge = (product: Product) =>
    product.isPublished ? (
      <Badge className="bg-green-100 text-green-800">Published</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-playfair">Clothing Management</h1>
        <Button className="bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]">
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 flex justify-center order-1 md:order-none">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="pl-10 pr-4 py-3 w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 md:ml-auto order-2">
          <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setPage(1) }}>
            <SelectTrigger className="w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {clothingTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

      <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
        <CardHeader className="pb-0">
          <CardTitle>
            {selectedCategory === "all" ? "All Items" : `Category #${selectedCategory}`} ({products.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a55c]" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.clothingType?.label || "Unknown"}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(product)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id, product.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-6 gap-2">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border border-[#c9a55c]"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">Page {page}</span>
                <Button
                  disabled={!hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="border border-[#c9a55c]"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
