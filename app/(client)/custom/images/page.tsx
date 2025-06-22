"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderImages {
  orderId: string;
  customerName: string;
  images: string[];
}

export default function OrderImagesPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [orderImages, setOrderImages] = useState<OrderImages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this from your API
    // For now, we'll simulate it
    const fetchOrderImages = async () => {
      try {
        // This would be a real API call
        // const response = await fetch(`/api/custom-orders/${params.orderId}/images`)
        // const data = await response.json()

        // Simulated data - replace with real API call
        setOrderImages({
          orderId: params.orderId,
          customerName: "Customer",
          images: [
            `/customOrders/sample-image-1.jpg`,
            `/customOrders/sample-image-2.jpg`,
          ],
        });
      } catch (error) {
        console.error("Error fetching order images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderImages();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a55c] mx-auto mb-4"></div>
          <p>Loading images...</p>
        </div>
      </div>
    );
  }

  if (!orderImages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-4">
              The requested order images could not be found.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-[#c9a55c] hover:text-[#b08d4a] mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold font-playfair text-gray-900">
              Order #{orderImages.orderId} - Design Files
            </h1>
            <p className="text-gray-600 mt-2">
              Customer: {orderImages.customerName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderImages.images.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Design File {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Design ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={imageUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
