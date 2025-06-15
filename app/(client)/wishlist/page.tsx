"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { WishlistItem } from "@/lib/types"

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: WishlistItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "M",
      color: "black",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-600 mb-8">Save your favorite items for later.</p>

        {items.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{items.length} items in your wishlist</p>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 text-red-500 border-red-500 hover:bg-red-50"
              >
                Clear Wishlist
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <Card key={product.id} className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                  <CardContent className="p-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-700 font-bold mb-3">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove from wishlist</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Start browsing our collection and save your favorite items to your wishlist.
            </p>
            <Button
              asChild
              className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
