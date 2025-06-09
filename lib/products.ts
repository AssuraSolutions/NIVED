import type { Product, ProductFilters } from "./types"

// Client-side helper functions that use the API instead of direct Prisma calls
export async function getProducts(category?: string, limit?: number): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (limit) params.append("limit", limit.toString())

    const response = await fetch(`/api/products?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products/related?id=${productId}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

// Admin functions
export async function getAdminProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams()

    if (filters.category) params.append("category", filters.category)
    if (filters.search) params.append("search", filters.search)
    if (filters.isPublished !== undefined) params.append("isPublished", filters.isPublished.toString())

    const response = await fetch(`/api/admin/products?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching admin products:", error)
    return []
  }
}

export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  try {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export async function publishProduct(id: string): Promise<Product> {
  return updateProduct(id, { isPublished: true })
}

export async function unpublishProduct(id: string): Promise<Product> {
  return updateProduct(id, { isPublished: false })
}
