"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingBag, ArrowLeft, Trash2, Minus, Plus, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { sendToWhatsApp } from "@/lib/whatsapp"

export default function CartPage() {
  const { toast } = useToast()
  const { items: cartItems, updateQuantity, removeFromCart, clearCart, getSubtotal } = useCart()
  const [couponCode, setCouponCode] = useState<string>("")
  const [discount, setDiscount] = useState<number>(0)

  const subtotal = getSubtotal()
  const shipping = subtotal > 0 ? 5.99 : 0
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "NIVED10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)

      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order.",
      })
    } else {
      setDiscount(0)

      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      })
    }
  }

  const checkout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    const orderDetails = `
*New Order from NiveD 01.12*

*Order Details:*
${cartItems
  .map(
    (item) =>
      `- ${item.name} (${item.size}, ${item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`,
  )
  .join("\n")}

*Subtotal:* $${subtotal.toFixed(2)}
*Shipping:* $${shipping.toFixed(2)}
*Discount:* $${discount.toFixed(2)}
*Total:* $${total.toFixed(2)}

Please contact me to arrange payment and delivery.
    `

    sendToWhatsApp(orderDetails)

    toast({
      title: "Checkout initiated",
      description: "You'll be redirected to WhatsApp to complete your order.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Review your items and proceed to checkout when you're ready.</p>

        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <p>
                              Size: {item.size} | Color: {item.color}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">Decrease</span>
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 -mr-2"
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 rounded-b-[255px_15px_225px_15px/15px_225px_15px_255px]">
                  <div className="w-full flex justify-between items-center">
                    <Button
                      variant="outline"
                      asChild
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                    >
                      <Link href="/products">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                <CardContent className="p-6">
                  <h2 className="font-bold text-xl mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                      />
                      <Button
                        variant="outline"
                        onClick={applyCoupon}
                        className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                      >
                        Apply
                      </Button>
                    </div>

                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-black"
                      onClick={checkout}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Checkout via WhatsApp
                    </Button>
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <p className="mb-2">
                      We'll contact you on WhatsApp to confirm your order details and arrange payment and delivery.
                    </p>
                    <p>Designed and manufactured in Ceylon with care and attention to detail.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find great vintage-style
              clothing.
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
