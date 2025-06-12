"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import ProductModal from "./product-modal";

interface ProductGridProps {
  products?: Product[]; // made optional and safer
  showBadges?: boolean;
  limit?: number;
}

export default function ProductGrid({
  products = [],
  showBadges = true,
}: ProductGridProps) {
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleWishlistToggle = (product: Product) => {
    const isInWishlist = items.some((item) => item.id === product.id);

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        description: product.description,
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  // Validate product array
  const productList = Array.isArray(products) ? products : [];

  if (productList.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        No products available.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => {
          const isInWishlist = items.some((item) => item.id === product.id);

          return (
            <Card
              key={product.id}
              className="group overflow-hidden border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:border-[#c9a55c] transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div
                    className="block"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  {showBadges && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.newArrival && (
                        <Badge className="bg-black text-white">New</Badge>
                      )}
                      {product.bestSeller && (
                        <Badge className="bg-[#c9a55c] text-white">
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Wishlist button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className={`absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm ${
                      isInWishlist
                        ? "text-red-500 border-red-500"
                        : "text-gray-600 border-gray-300 hover:text-red-500 hover:border-red-500"
                    }`}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist ? "fill-red-500" : ""
                      }`}
                    />
                    <span className="sr-only">
                      {isInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </span>
                  </Button>
                </div>

                <div className="p-4">
                  {/* Product Name */}
                  <h3
                    className="font-medium text-gray-900 mb-1 hover:text-[#c9a55c] transition-colors cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-700 font-bold mb-3">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
