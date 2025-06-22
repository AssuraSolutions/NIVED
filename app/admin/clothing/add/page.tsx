"use client"

import { useRouter } from "next/navigation"
import ProductForm from "@/components/ProductForm"

export default function AddProductPage() {
  const router = useRouter()

  const handleCreate = async (data: any) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push("/admin/clothing")
    } else {
      alert("Failed to create product.")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
      <ProductForm onSubmit={handleCreate} />
    </div>
  )
}
