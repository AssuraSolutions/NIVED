"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ExtendedProduct extends Product {
  clothingType?: {
    label: string
  }
  stock?: number
  featured?: boolean
  bestSeller?: boolean
  newArrival?: boolean
}

export default function ClothingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [clothingTypes, setClothingTypes] = useState<
    { id: number; label: string }[]
  >([])
  const [selectedClothingTypeId, setSelectedClothingTypeId] =
    useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [currentProduct, setCurrentProduct] = useState<Partial<ExtendedProduct>>({
    name: "",
    description: "",
    price: 0,
    clothingTypeId: undefined,
    images: [],
    colors: [],
    availableSizes: [],
    featured: false,
    bestSeller: false,
    newArrival: false,
    stock: 0,
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/products")
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
      const data = await res.json()
      setProducts(data.products)
      setClothingTypes(data.clothingTypes)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedClothingTypeId])

  const applyFilters = () => {
    let filtered = [...products]

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.clothingType?.label.toLowerCase().includes(term)
      )
    }

    if (selectedClothingTypeId !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.clothingTypeId?.toString() === selectedClothingTypeId
      )
    }

    return filtered
  }

  const paginatedProducts = applyFilters().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(applyFilters().length / itemsPerPage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const productData = {
      ...currentProduct,
      price: Number(currentProduct.price),
      stock: Number(currentProduct.stock),
    }

    try {
      const res = await fetch(
        isEditing
          ? `/api/products/${currentProduct.id}`
          : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      )

      if (!res.ok) throw new Error("Failed to submit product")

      setIsDialogOpen(false)
      setIsEditing(false)
      setCurrentProduct({
        name: "",
        description: "",
        price: 0,
        clothingTypeId: undefined,
        images: [],
        colors: [],
        availableSizes: [],
        featured: false,
        bestSeller: false,
        newArrival: false,
        stock: 0,
      })
      fetchProducts()
      toast({
        title: isEditing ? "Product Updated" : "Product Added",
        description: `${productData.name} has been ${
          isEditing ? "updated" : "added"
        } successfully.`,
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to submit product",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`)
      fetchProducts()
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={currentProduct.name || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentProduct.description || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="clothingType">Category</Label>
              <Select
                value={currentProduct.clothingTypeId?.toString() || ""}
                onValueChange={(value) =>
                  setCurrentProduct({
                    ...currentProduct,
                    clothingTypeId: Number(value),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {clothingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {isEditing ? "Update" : "Add"} Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-playfair">
            Clothing Management
          </h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Label>Filter by Category:</Label>
            <Select
              value={selectedClothingTypeId}
              onValueChange={(value) => setSelectedClothingTypeId(value)}
            >
              <SelectTrigger className="w-[200px]">
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

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] focus:border-[#b08d4a] bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <Card key={product.id} className="p-4 rounded-xl shadow-sm border-2 border-[#c9a55c] flex flex-col">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-48 object-contain rounded-lg mb-4 bg-gray-100"
              />
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mb-2">{product.clothingType?.label || "N/A"}</p>
              <div className="flex justify-between items-center mt-auto">
                <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id, product.name)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-full border-2 border-[#c9a55c]"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-full border-2 border-[#c9a55c]"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
