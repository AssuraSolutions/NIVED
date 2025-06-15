"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Pencil, X, ImagePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ClothingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "t-shirts",
    images: [],
    colors: [],
    availableSizes: [],
    featured: false,
    bestSeller: false,
    newArrival: false,
    stock: 0,
  })

  const [newImageUrl, setNewImageUrl] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const categories = [
    { value: "t-shirts", label: "T-Shirts" },
    { value: "hoodies", label: "Hoodies" },
    { value: "sweatshirts", label: "Sweatshirts" },
    { value: "pants", label: "Pants" },
    { value: "shorts", label: "Shorts" },
    { value: "accessories", label: "Accessories" },
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/products")

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`)
      }

      const data = await res.json()
      setProducts(data)
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

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return

    setCurrentProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl],
    }))

    setNewImageUrl("")
  }

  const handleRemoveImage = (index: number) => {
    setCurrentProduct((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }))
  }

  const handleAddColor = () => {
    if (!newColor.trim()) return

    setCurrentProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newColor],
    }))

    setNewColor("")
  }

  const handleRemoveColor = (index: number) => {
    setCurrentProduct((prev) => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index),
    }))
  }

  const handleAddSize = () => {
    if (!newSize.trim()) return

    setCurrentProduct((prev) => ({
      ...prev,
      availableSizes: [...(prev.availableSizes || []), newSize],
    }))

    setNewSize("")
  }

  const handleRemoveSize = (index: number) => {
    setCurrentProduct((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes?.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const productData = {
      ...currentProduct,
      price: Number.parseFloat(currentProduct.price?.toString() || "0"),
      stock: Number.parseInt(currentProduct.stock?.toString() || "0"),
    }

    try {
      if (isEditing) {
        // Update existing product
        const res = await fetch(`/api/products/${currentProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })

        if (!res.ok) {
          throw new Error(`Failed to update product: ${res.status}`)
        }
      } else {
        // Create new product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })

        if (!res.ok) {
          throw new Error(`Failed to create product: ${res.status}`)
        }
      }

      setIsDialogOpen(false)
      setIsEditing(false)
      setCurrentProduct({
        name: "",
        description: "",
        price: 0,
        category: "t-shirts",
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
        description: `${productData.name} has been ${isEditing ? "updated" : "added"} successfully.`,
      })
    } catch (err) {
      console.error("Error submitting product:", err)
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
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`Failed to delete product: ${res.status}`)
      }

      fetchProducts()
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      })
    } catch (err) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (product: Product) => {
    if (product.isPublished) {
      return <Badge className="bg-green-100 text-green-800">Published</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-playfair">Clothing Management</h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

        <Tabs defaultValue="t-shirts" className="mb-6">
          <TabsList className="grid w-full grid-cols-6 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
                <CardHeader className="pb-0">
                  <CardTitle>
                    {category.label} Inventory ({products.filter((p) => p.category === category.value).length} items)
                  </CardTitle>
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
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products
                          .filter((p) => p.category === category.value)
                          .map((product) => (
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
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>
                                  {product.stock}
                                </span>
                              </TableCell>
                              <TableCell>{getStatusBadge(product)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditProduct(product)}
                                    title="Edit"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Clothing Item" : "Add New Clothing Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                  rows={2}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentProduct.category}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                >
                  <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    required
                  />
                </div>
              </div>

              {/* Multiple Images Section */}
              <div className="grid w-full items-center gap-1.5">
                <Label>Product Images</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    />
                    <Button
                      type="button"
                      onClick={handleAddImage}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                  </div>

                  {currentProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {currentProduct.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Colors Section */}
              <div className="grid w-full items-center gap-1.5">
                <Label>Colors</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    />
                    <Button
                      type="button"
                      onClick={handleAddColor}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {currentProduct.colors.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {currentProduct.colors.map((color, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                            <div className="flex items-center justify-center h-full w-full bg-gray-100">
                              <span className="text-gray-800">{color}</span>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveColor(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes Section */}
              <div className="grid w-full items-center gap-1.5">
                <Label>Available Sizes</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter size"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSize}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {currentProduct.availableSizes.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {currentProduct.availableSizes.map((size, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                            <div className="flex items-center justify-center h-full w-full bg-gray-100">
                              <span className="text-gray-800">{size}</span>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveSize(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Features Section */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={currentProduct.featured}
                  onCheckedChange={(checked) => setCurrentProduct({ ...currentProduct, featured: checked })}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bestSeller"
                  checked={currentProduct.bestSeller}
                  onCheckedChange={(checked) => setCurrentProduct({ ...currentProduct, bestSeller: checked })}
                  className="rounded"
                />
                <Label htmlFor="bestSeller">Best Seller</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newArrival"
                  checked={currentProduct.newArrival}
                  onCheckedChange={(checked) => setCurrentProduct({ ...currentProduct, newArrival: checked })}
                  className="rounded"
                />
                <Label htmlFor="newArrival">New Arrival</Label>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
                >
                  {isEditing ? "Update Product" : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
