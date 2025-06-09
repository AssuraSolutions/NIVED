// Database connection and query utilities for PostgreSQL

import { Pool } from "pg"

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Generic query function
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Product-related database functions
export const productQueries = {
  // Get all products with filters
  async getProducts(
    filters: {
      category?: string
      isActive?: boolean
      limit?: number
      offset?: number
      priceRange?: [number, number]
      sizes?: string[]
      colors?: string[]
      search?: string
    } = {},
  ) {
    let queryText = `
      SELECT p.*, 
             ARRAY_AGG(DISTINCT pi.image_url ORDER BY pi.sort_order) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (filters.isActive !== undefined) {
      queryText += ` AND p.is_active = $${++paramCount}`
      params.push(filters.isActive)
    }

    if (filters.category) {
      queryText += ` AND LOWER(p.category) = LOWER($${++paramCount})`
      params.push(filters.category)
    }

    if (filters.search) {
      queryText += ` AND (LOWER(p.name) LIKE LOWER($${++paramCount}) OR LOWER(p.description) LIKE LOWER($${++paramCount}))`
      params.push(`%${filters.search}%`, `%${filters.search}%`)
      paramCount++
    }

    if (filters.priceRange) {
      queryText += ` AND p.price BETWEEN $${++paramCount} AND $${++paramCount}`
      params.push(filters.priceRange[0], filters.priceRange[1])
      paramCount++
    }

    if (filters.sizes && filters.sizes.length > 0) {
      queryText += ` AND p.available_sizes && $${++paramCount}`
      params.push(filters.sizes)
    }

    if (filters.colors && filters.colors.length > 0) {
      queryText += ` AND p.colors && $${++paramCount}`
      params.push(filters.colors)
    }

    queryText += ` GROUP BY p.id ORDER BY p.created_at DESC`

    if (filters.limit) {
      queryText += ` LIMIT $${++paramCount}`
      params.push(filters.limit)
    }

    if (filters.offset) {
      queryText += ` OFFSET $${++paramCount}`
      params.push(filters.offset)
    }

    const result = await query(queryText, params)
    return result.rows
  },

  // Get product by ID
  async getProductById(id: string) {
    const queryText = `
      SELECT p.*, 
             ARRAY_AGG(DISTINCT pi.image_url ORDER BY pi.sort_order) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id
    `
    const result = await query(queryText, [id])
    return result.rows[0]
  },

  // Create product
  async createProduct(productData: {
    name: string
    description: string
    longDescription?: string
    price: number
    category: string
    stock: number
    availableSizes?: string[]
    colors?: string[]
    tags?: string[]
    isLimited?: boolean
  }) {
    const queryText = `
      INSERT INTO products (name, description, long_description, price, category, stock, available_sizes, colors, tags, is_limited)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    const params = [
      productData.name,
      productData.description,
      productData.longDescription,
      productData.price,
      productData.category,
      productData.stock,
      productData.availableSizes || [],
      productData.colors || [],
      productData.tags || [],
      productData.isLimited || false,
    ]
    const result = await query(queryText, params)
    return result.rows[0]
  },

  // Update product
  async updateProduct(
    id: string,
    productData: Partial<{
      name: string
      description: string
      longDescription: string
      price: number
      category: string
      stock: number
      availableSizes: string[]
      colors: string[]
      tags: string[]
      isLimited: boolean
      isActive: boolean
    }>,
  ) {
    const fields = Object.keys(productData).filter((key) => productData[key as keyof typeof productData] !== undefined)
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

    const queryText = `
      UPDATE products 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `
    const params = [id, ...fields.map((field) => productData[field as keyof typeof productData])]
    const result = await query(queryText, params)
    return result.rows[0]
  },

  // Delete product (soft delete)
  async deleteProduct(id: string) {
    const queryText = `
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `
    const result = await query(queryText, [id])
    return result.rows[0]
  },
}

// Custom order database functions
export const customOrderQueries = {
  // Get all custom orders
  async getCustomOrders(
    filters: {
      status?: string
      limit?: number
      offset?: number
    } = {},
  ) {
    let queryText = `
      SELECT * FROM custom_orders
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (filters.status) {
      queryText += ` AND status = $${++paramCount}`
      params.push(filters.status)
    }

    queryText += ` ORDER BY created_at DESC`

    if (filters.limit) {
      queryText += ` LIMIT $${++paramCount}`
      params.push(filters.limit)
    }

    if (filters.offset) {
      queryText += ` OFFSET $${++paramCount}`
      params.push(filters.offset)
    }

    const result = await query(queryText, params)
    return result.rows
  },

  // Create custom order
  async createCustomOrder(orderData: {
    customerName: string
    customerEmail: string
    customerPhone: string
    productType: string
    size: string
    color: string
    quantity: number
    designNotes: string
    designFileUrl?: string
    totalPrice?: number
  }) {
    // Generate order number
    const orderNumber = `CO-${Date.now().toString().slice(-6)}`

    const queryText = `
      INSERT INTO custom_orders (
        order_number, customer_name, customer_email, customer_phone,
        product_type, size, color, quantity, design_notes, design_file_url, total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `
    const params = [
      orderNumber,
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone,
      orderData.productType,
      orderData.size,
      orderData.color,
      orderData.quantity,
      orderData.designNotes,
      orderData.designFileUrl,
      orderData.totalPrice,
    ]
    const result = await query(queryText, params)
    return result.rows[0]
  },

  // Update custom order status
  async updateCustomOrderStatus(id: string, status: string, estimatedCompletion?: string) {
    let queryText = `
      UPDATE custom_orders 
      SET status = $2, updated_at = CURRENT_TIMESTAMP
    `
    const params = [id, status]

    if (estimatedCompletion) {
      queryText += `, estimated_completion = $3`
      params.push(estimatedCompletion)
    }

    queryText += ` WHERE id = $1 RETURNING *`

    const result = await query(queryText, params)
    return result.rows[0]
  },
}

// User authentication functions
export const userQueries = {
  // Get user by email
  async getUserByEmail(email: string) {
    const queryText = `SELECT * FROM users WHERE email = $1 AND is_active = true`
    const result = await query(queryText, [email])
    return result.rows[0]
  },

  // Create user
  async createUser(userData: {
    email: string
    passwordHash: string
    name: string
    role?: string
  }) {
    const queryText = `
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role, created_at
    `
    const params = [userData.email, userData.passwordHash, userData.name, userData.role || "admin"]
    const result = await query(queryText, params)
    return result.rows[0]
  },
}

// Settings functions
export const settingsQueries = {
  // Get setting by key
  async getSetting(key: string) {
    const queryText = `SELECT * FROM settings WHERE key = $1`
    const result = await query(queryText, [key])
    return result.rows[0]
  },

  // Update setting
  async updateSetting(key: string, value: string) {
    const queryText = `
      INSERT INTO settings (key, value) 
      VALUES ($1, $2)
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    const result = await query(queryText, [key, value])
    return result.rows[0]
  },
}
