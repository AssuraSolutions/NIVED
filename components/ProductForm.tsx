"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  clothingTypes: { id: number; label: string }[]
}

export default function ProductForm({ initialData = {}, onSubmit, clothingTypes, }: ProductFormProps) {
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

  const [newImageUrl, setNewImageUrl] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newTag, setNewTag] = useState("")

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
              id="name"
              name="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
              required
              />
              </div>

             <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                  rows={2}
                  required
                  />
                 </div>

                 <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="longdescription">Long Description</Label>
                <Textarea
                  id="longdescription"
                  name="longdescription"
                  value={product.longDescription}
          	      onChange={(e) => setProduct({ ...product, longDescription: e.target.value })}
          	      rows={4}
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                  required
                />
               </div>

               <div className="grid w-full items-center gap-1.5">
                 <Label htmlFor="category">Category</Label>
                 <Select
                    value={product.clothingTypeId.toString()}
                    onValueChange={(val) => setProduct({ ...product, clothingTypeId: Number(val) })}
                    >
                    <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2">
                   <SelectValue placeholder="Select category" />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={product.price}
          	        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    required
                    />
                    </div>
                 </div>

                 {/* Images */}
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
                      onClick={() => handleAdd("images", newImageUrl)}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                  </div>

        
                  <div className="grid grid-cols-3 gap-3">
                       {product.images.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Product image ${idx}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => handleRemove("images", idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
                </div>

      {/* Colors */}
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
                     onClick={() => handleAdd("colors", newColor)}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    >
                      <Plus className="h-4 w-4" />
            </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
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
      </div>

      {/* Sizes */}
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
          <Button type="button" onClick={() => handleAdd("availableSizes", newSize)}
             className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
             >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {product.availableSizes.map((size, idx) => (
           <div key={idx} className="relative group">
            <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                  {size}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove("availableSizes", idx)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              </div>
          ))}
        </div>
      </div>
      </div>

      {/* Tags */}
       <div className="grid w-full items-center gap-1.5">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag"
          className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
           />
          <Button type="button" onClick={() => handleAdd("tags", newTag)}
            className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
            >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {product.tags.map((tag, idx) => (
            <div key={idx} className="relative group flex items-center gap-1 border rounded p-2 bg-gray-50">
                      {tag}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemove("tags", idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="isLimited" checked={product.isLimited} onCheckedChange={(val) => setProduct({ ...product, isLimited: val as boolean })} 
            className="rounded"
            />
          <Label htmlFor="isLimited">Limited Edition</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isPublished" checked={product.isPublished} onCheckedChange={(val) => setProduct({ ...product, isPublished: val as boolean })}
          className="rounded"
           />
          <Label htmlFor="isPublished">Published</Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button
                  type="submit"
                  className="w-full bg-[#c9a55c] hover:bg-[#b08d4a] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
                >
          {initialData?.id ? "Update Product" : "Add Product"}
        </Button> 
        </DialogFooter>
         </form>
      
     </div>
     </div>
  )
}
