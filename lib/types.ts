export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  availableSizes: string[];
  colors: string[];
  tags: string[];
  images: string[];
  isLimited: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  // Relation field
  clothingTypeId: number;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
};
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CustomOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  designFiles: string[];
  quantity: number;
  size: string;
  color: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders?: Order[];
  createdAt?: Date | string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
