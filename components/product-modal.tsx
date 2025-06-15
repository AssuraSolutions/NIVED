"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  MessageSquare,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  if (!product) return null;

  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize(product.availableSizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
      setActiveImageIndex(0);
      setIsImageZoomed(false);
    }
  }, [isOpen, product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
    });

    onClose(); // optional, closes the modal
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before purchasing.",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = `
*New Order from NiveD 01.12*

*Product:* ${product.name}
*Size:* ${selectedSize}
*Color:* ${selectedColor}
*Quantity:* ${quantity}
*Price:* $${(product.price * quantity).toFixed(2)}

Please contact me to arrange payment and delivery.
    `;

    sendToWhatsApp(orderDetails);
    toast({
      title: "Checkout initiated",
      description: "You'll be redirected to WhatsApp to complete your order.",
    });
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
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

  const nextImage = () => {
    if (product.images && activeImageIndex < product.images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };

  const currentImage = product.images?.[activeImageIndex] || "/placeholder.svg";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Product details for {product.name} - {product.description}
        </DialogDescription>
        <div className="relative bg-white overflow-y-auto max-h-[95vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/80 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                  <Image
                    src={currentImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform ${
                      isImageZoomed ? "scale-150" : "scale-100"
                    }`}
                    priority
                  />

                  {/* Image navigation */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={prevImage}
                        disabled={activeImageIndex === 0}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={nextImage}
                        disabled={
                          activeImageIndex === product.images.length - 1
                        }
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}

                  {/* Zoom toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-full"
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                </div>

                {/* Image thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img: string, i: number) => (
                      <div
                        key={i}
                        className={`aspect-square relative rounded-lg overflow-hidden border-2 cursor-pointer ${
                          activeImageIndex === i
                            ? "border-[#c9a55c]"
                            : "border-gray-200"
                        }`}
                        onClick={() => setActiveImageIndex(i)}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} view ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[#c9a55c]">{product.category}</p>
                    {/* Limited Edition badge removed: 'isLimited' does not exist on Product */}
                  </div>
                  <h1 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Rating value={4} />
                    <span className="text-gray-500 text-sm">(24 reviews)</span>
                  </div>
                </div>

                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-600">{product.description}</p>

                <div className="space-y-4">
                  {/* Size Selection */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.availableSizes?.map((size: string) => (
                        <Button
                          key={size}
                          variant={
                            selectedSize === size ? "default" : "outline"
                          }
                          className={`h-10 w-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] ${
                            selectedSize === size
                              ? "bg-[#c9a55c] hover:bg-[#b08d4a] border-[#c9a55c]"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg mb-3">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color: string) => (
                          <button
                            key={color}
                            className={`h-8 w-8 rounded-full bg-${
                              color === "navy" ? "blue-900" : color
                            } cursor-pointer border-2 ${
                              selectedColor === color
                                ? "border-[#c9a55c]"
                                : "border-gray-300"
                            }`}
                            onClick={() => setSelectedColor(color)}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Quantity</h3>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        className="h-10 w-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-gray-300"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4">{quantity}</span>
                      <Button
                        variant="outline"
                        className="h-10 w-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-gray-300"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-black"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                  <Button
                    className="flex-1 bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
                    onClick={handleBuyNow}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Buy Now via
                    WhatsApp
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    variant="outline"
                    className={`rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 ${
                      isInWishlist(product.id)
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-[#c9a55c] text-[#c9a55c] hover:bg-[#c9a55c]/10"
                    }`}
                    onClick={handleWishlistToggle}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        isInWishlist(product.id) ? "fill-current" : ""
                      }`}
                    />
                    {isInWishlist(product.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-gray-200"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>

                {/* Product Info */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#c9a55c]/10 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-[#c9a55c]" />
                    </div>
                    <div>
                      <h3 className="font-bold">Free Shipping</h3>
                      <p className="text-gray-600 text-sm">
                        On orders over $100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#c9a55c]/10 p-2 rounded-full">
                      <RotateCcw className="h-5 w-5 text-[#c9a55c]" />
                    </div>
                    <div>
                      <h3 className="font-bold">Easy Returns</h3>
                      <p className="text-gray-600 text-sm">
                        30 day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 h-auto p-1">
                  <TabsTrigger
                    value="description"
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipping"
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                  >
                    Shipping & Returns
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">{product.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="font-bold mb-2">Features:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>100% organic cotton</li>
                          <li>Relaxed unisex fit</li>
                          <li>Vintage washed finish</li>
                          <li>Ribbed collar</li>
                          <li>Double-stitched hems</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">Care Instructions:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Machine wash cold</li>
                          <li>Gentle cycle with similar colors</li>
                          <li>Do not bleach</li>
                          <li>Tumble dry low</li>
                          <li>Cool iron if needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Shipping Information
                      </h4>
                      <p className="text-gray-700">
                        We ship worldwide from our warehouse in Ceylon. All
                        orders are processed and shipped within 1-3 business
                        days.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">
                          4.0
                        </div>
                        <div className="mt-1">
                          <Rating value={4} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Based on 24 reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
