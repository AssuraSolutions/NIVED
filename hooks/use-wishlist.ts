// hooks/use-wishlist.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/lib/types";

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) return;
        set((state) => ({
          items: [...state.items, product],
        }));
      },
      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) =>
        get().items.some((item) => item.id === productId),
    }),
    {
      name: "wishlist-storage", // localStorage key
    }
  )
);
