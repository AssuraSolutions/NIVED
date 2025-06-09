// hooks/use-cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";



export interface CartState {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (
    itemId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  removeFromCart: (itemId: string, size: string, color: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}


export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product: CartItem) => {
        const existingIndex = get().items.findIndex(
          (item) =>
            item.id === product.id &&
            item.size === product.size &&
            item.color === product.color
        );

        if (existingIndex !== -1) {
          const updatedItems = [...get().items];
          updatedItems[existingIndex].quantity += product.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      updateQuantity: (itemId, size, color, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },
      removeFromCart: (itemId, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.id === itemId &&
                item.size === size &&
                item.color === color
              )
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage", // key in localStorage
    }
  )
);


