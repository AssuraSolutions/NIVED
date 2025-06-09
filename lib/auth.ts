// Authentication utilities for admin panel

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    return null
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const user = await userQueries.getUserByEmail(email)
    if (!user) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = generateToken(userWithoutPassword)

    return {
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Create new admin user
export async function createAdminUser(userData: {
  email: string
  password: string
  name: string
}): Promise<User | null> {
  try {
    const existingUser = await userQueries.getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const passwordHash = await hashPassword(userData.password)
    const user = await userQueries.createUser({
      email: userData.email,
      passwordHash,
      name: userData.name,
      role: "admin",
    })

    return user
  } catch (error) {
    console.error("Create user error:", error)
    return null
  }
}

// Middleware to protect admin routes
export function requireAuth(handler: Function) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "")

      if (!token) {
        return res.status(401).json({ error: "No token provided" })
      }

      const user = verifyToken(token)
      if (!user) {
        return res.status(401).json({ error: "Invalid token" })
      }

      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: "Authentication failed" })
    }
  }
}
