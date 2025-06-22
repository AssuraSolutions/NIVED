"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImagePlus, Plus, X } from "lucide-react"
import type { Product } from "@/lib/types"

type ProductFormProps = {
  initialData?: Partial<Product>
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt" | "clothingType">) => void
}

export default function ProductForm({ initialData = {}, onSubmit }: ProductFormProps) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: 0,
    clothingTypeId: 0,
    images: [],
    availableSizes: [],
    colors: [],
    tags: [],
    isLimited: false,
    isFeatured: false,
    isPublished: false,
    ...initialData,
  })

  const [clothingTypes, setClothingTypes] = useState<{ id: number; name: string }[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newTag, setNewTag] = useState("")

    useEffect(() => {
    fetch("/api/admin/products?page=1&limit=1")
        .then((res) => res.json())
        .then((data) => setClothingTypes(data.clothingTypes || []))
    }, [])

  const handleAdd = (field: string, value: string) => {
    if (!value.trim()) return
    setProduct((prev) => ({
      ...prev,
      [field]: [...(prev as any)[field], value],
    }))
    if (field === "images") setNewImageUrl("")
    if (field === "colors") setNewColor("")
    if (field === "availableSizes") setNewSize("")
    if (field === "tags") setNewTag("")
  }

  const handleRemove = (field: string, index: number) => {
    setProduct((prev) => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...product,
      price: Number(product.price),
      clothingTypeId: Number(product.clothingTypeId),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label>Product Name</Label>
        <Input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />

        <Label>Short Description</Label>
        <Textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          rows={2}
          required
        />

        <Label>Long Description</Label>
        <Textarea
          value={product.longDescription}
          onChange={(e) => setProduct({ ...product, longDescription: e.target.value })}
          rows={4}
        />
      </div>

      <div>
        <Label>Clothing Type</Label>
        <Select
          value={product.clothingTypeId.toString()}
          onValueChange={(val) => setProduct({ ...product, clothingTypeId: Number(val) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select clothing type" />
          </SelectTrigger>
          <SelectContent>
            {clothingTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price ($)</Label>
        <Input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>

      {/* Images */}
      <div>
        <Label>Images</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Image URL" />
          <Button type="button" onClick={() => handleAdd("images", newImageUrl)}>
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {product.images.map((url, idx) => (
            <div key={idx} className="relative group aspect-square border rounded overflow-hidden">
              <div className="relative w-full h-32">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`product-${idx}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1"
                onClick={() => handleRemove("images", idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label>Colors</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Color" />
          <Button type="button" onClick={() => handleAdd("colors", newColor)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-1 border rounded p-2 bg-gray-50">
              {color}
              <Button type="button" size="icon" variant="destructive" onClick={() => handleRemove("colors", idx)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <Label>Available Sizes</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Size" />
          <Button type="button" onClick={() => handleAdd("availableSizes", newSize)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.availableSizes.map((size, idx) => (
            <div key={idx} className="flex items-center gap-1 border rounded p-2 bg-gray-50">
              {size}
              <Button type="button" size="icon" variant="destructive" onClick={() => handleRemove("availableSizes", idx)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag" />
          <Button type="button" onClick={() => handleAdd("tags", newTag)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-1 border rounded p-2 bg-gray-50">
              {tag}
              <Button type="button" size="icon" variant="destructive" onClick={() => handleRemove("tags", idx)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="isLimited" checked={product.isLimited} onCheckedChange={(val) => setProduct({ ...product, isLimited: val as boolean })} />
          <Label htmlFor="isLimited">Limited Edition</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isPublished" checked={product.isPublished} onCheckedChange={(val) => setProduct({ ...product, isPublished: val as boolean })} />
          <Label htmlFor="isPublished">Published</Label>
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#c9a55c] hover:bg-[#b08d4a] border-2 border-[#c9a55c]">
        {initialData?.id ? "Update Product" : "Add Product"}
      </Button>
    </form>
  )
}
