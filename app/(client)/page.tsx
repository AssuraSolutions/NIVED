"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shirt, Scissors, MessageSquare } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import CategorySection from "@/components/category-section";
import CustomPrintSection from "@/components/custom-print-section";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types"; // Adjust path if needed

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=4&featured=true", {
          // next: { revalidate: 60 },
        });
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="relative">
      {/* Full-page background */}
      {/* <div className="absolute inset-0 -z-10 bg-[url('/paper-texture03.jpg')] bg-repeat opacity-80"></div> */}
      <div className=" inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="relative py-10 md:py-10 ">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div
              className="relative h-[700px] [600px]  md:h-[600px] w-[500px]  overflow-hidden 
            border-2 border-[#c9a55c] text-[#c9a55c] hover:bg-[#c9a55c]/10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all"
            >
              <Image
                src="/main-image (7).jpg"
                alt="NiveD Clothing Collection"
                fill
                className="object-cover "
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <Image
                src="/Logo.jpg"
                alt="NiveD 01.12 Logo"
                width={150}
                height={170}
                className="absolute bottom-4 right-4"
              />
            </div>

            <div className="space-y-6">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Vintage Style, <span className="text-[#c9a55c]">Timeless</span>{" "}
                Appeal
              </h1>
              <p className="text-lg text-gray-700 max-w-md">
                Handcrafted unisex clothing with a nostalgic touch. Designed and
                manufactured in Ceylon with care and attention to detail.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border-2 border-black rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:shadow-md transition-all"
                >
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-[#c9a55c] text-[#c9a55c] hover:bg-[#c9a55c]/10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all"
                >
                  <Link href="/custom">Custom Printing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <CategorySection />

        {/* Featured Products */}
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <div> </div>
            <h2 className="font-playfair text-3xl font-bold text-gray-900 ">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-[#c9a55c] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} limit={4} />
        </section>

        {/* Custom Printing */}
        <CustomPrintSection />

        {/* Trust Badges */}
        <section className="py-16">
          <div className=" absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

          <div className="container mx-auto px-4">
            <h2 className="font-playfair text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose NiveD 01.12
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white  shadow-sm border-2 border-[#c9a55c] text-[#c9a55c]  rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all cursor-default ">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#c9a55c]/10 rounded-full flex items-center justify-center">
                  <Shirt size={32} className="text-[#c9a55c]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Materials</h3>
                <p className="text-gray-600">
                  Carefully selected fabrics for comfort and durability
                </p>
              </div>
              <div className="text-center p-6 bg-white  shadow-sm border-2 border-[#c9a55c] text-[#c9a55c]  rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all cursor-default ">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#c9a55c]/10 rounded-full flex items-center justify-center">
                  <Scissors size={32} className="text-[#c9a55c]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Handcrafted</h3>
                <p className="text-gray-600">
                  Each piece is made with attention to detail and care
                </p>
              </div>
              <div className="text-center p-6 bg-white  shadow-sm border-2 border-[#c9a55c] text-[#c9a55c]  rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all cursor-default ">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#c9a55c]/10 rounded-full flex items-center justify-center">
                  <MessageSquare size={32} className="text-[#c9a55c]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personal Service</h3>
                <p className="text-gray-600">
                  Direct communication for a personalized shopping experience
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
