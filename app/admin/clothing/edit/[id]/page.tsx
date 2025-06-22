"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProductForm from "@/components/ProductForm"
import type { Product } from "@/lib/types"

export default function EditProductPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [product, setProduct] = useState<Partial<Product> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch(() => {
        alert("Failed to load product.")
        router.push("/admin/clothing")
      })
  }, [id, router])

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push("/admin/clothing")
    } else {
      alert("Failed to update product.")
    }
  }

  if (loading || !product) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </div>
  )
}
