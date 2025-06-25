"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Pencil, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import ProductForm from "@/components/ProductForm"


export default function ClothingPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [clothingTypes, setClothingTypes] = useState<{ id: number; label: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showOnlyDrafts, setShowOnlyDrafts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editProductData, setEditProductData] = useState<Product | null>(null)
  const router = useRouter()


const fetchProducts = async (category = "all", search = "", page = 1,  draftOnly = false ) => {
  try {
    setLoading(true)
    const queryParams = new URLSearchParams()
    if (category !== "all") queryParams.append("category", category)
    if (search) queryParams.append("search", search)
    if (draftOnly) {queryParams.append("isPublished", "false")}

    queryParams.append("page", page.toString())
    queryParams.append("limit", pageSize.toString())

    const res = await fetch(`/api/admin/products?${queryParams.toString()}`)
    if (!res.ok) throw new Error("Failed to fetch products")

    const data = await res.json()
    setProducts(data.products as Product[])
    setHasNextPage(data.hasNextPage)
    setTotalCount(data.totalCount || 0)
  } catch (err) {
    console.error(err)
    setError("Failed to load products")
  } finally {
    setLoading(false)
  }
}

const fetchClothingTypes = async () => {
  try {
    const res = await fetch("/api/clothing-type")
    if (!res.ok) throw new Error("Failed to fetch clothing types")
    const data = await res.json()
    setClothingTypes(data)
  } catch (err) {
    console.error("Failed to load clothing types:", err)
    setClothingTypes([]) 
  }
}

  useEffect(() => {
    fetchProducts()
    fetchClothingTypes()
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(selectedCategory, searchTerm, page, showOnlyDrafts)
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [selectedCategory, searchTerm, page, showOnlyDrafts])

    const handleEditProduct = (product: Product) => {
    setEditProductData(product)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      setLoading (true)
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
      fetchProducts(selectedCategory, searchTerm, page)
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
    finally{setLoading (false)
      toast({ title: "Deleted", description: `${name} was removed.` })
    }

  }

  const handleFormSubmit = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt" | "clothingType">
  ) => {
    try {
      const res = await fetch(
        isEditing
          ? `/api/admin/products/${editProductData?.id}`
          : "/api/admin/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      if (res.ok) {
        setIsDialogOpen(false)
        setEditProductData(null)
        setIsEditing(false)
        fetchProducts(selectedCategory, searchTerm, page)
        toast({
          title: isEditing ? "Product updated" : "Product added",
          description: "Changes saved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission failed", error)
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
        variant: "destructive",
      })
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
        <Button
          onClick={() => {
            setIsDialogOpen(true)
            setIsEditing(false)
            setEditProductData(null)
          }}
          className="bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Clothing Item" : "Add New Clothing Item"}</DialogTitle>
          </DialogHeader>
       <ProductForm
            initialData={editProductData || {}}
            onSubmit={handleFormSubmit}
            clothingTypes={clothingTypes}
          />
        </DialogContent>
      </Dialog>
    

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

          <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="showOnlyDrafts"
        checked={showOnlyDrafts}
        onChange={(e) => {
          setShowOnlyDrafts(e.target.checked)
          setPage(1)
        }}
        className="rounded border-gray-400"
      />
      <label htmlFor="showOnlyDrafts" className="text-sm text-gray-700">
        Show only draft items
      </label>
    </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

      <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
        <CardHeader className="pb-0">
          <CardTitle>
           {selectedCategory === "all"
              ? "All Items"
              : `${clothingTypes.find((type) => type.id.toString() === selectedCategory)?.label || "Unknown"}`} ({products.length} items)
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
  {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
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
              ))
            )}
          </TableBody>
              </Table>

              <div className="flex justify-center mt-6 gap-2 items-center">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="border border-[#c9a55c]"
                  >
                    {"<<"}
                  </Button>

                  <span className="px-4 py-2">
                    Page {page} of {Math.ceil(totalCount / pageSize) || 1}
                  </span>

                  <Button
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="border border-[#c9a55c]"
                  >
                    {">>"}
                  </Button>
                </div>

            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
