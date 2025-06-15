import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette, Shirt, Zap } from "lucide-react";

export default function CustomPrintSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('')] opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Custom T-shirt Printing
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Bring your ideas to life with our custom printing service.
              Designed and manufactured in Ceylon with care and attention to
              detail.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-[#c9a55c]/10 p-2 rounded-full">
                  <Palette className="h-5 w-5 text-[#c9a55c]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Your Design, Your Way</h3>
                  <p className="text-gray-600">
                    Upload your artwork or work with our designers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#c9a55c]/10 p-2 rounded-full">
                  <Shirt className="h-5 w-5 text-[#c9a55c]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Quality Materials</h3>
                  <p className="text-gray-600">
                    Premium fabrics that feel great and last long
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#c9a55c]/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-[#c9a55c]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Quick Turnaround</h3>
                  <p className="text-gray-600">
                    Fast production and delivery options available
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-center">
              <Button
                asChild
                className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
              >
                <Link href="/custom">Start Designing</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[700px] [600px]  md:h-[600px] w-[500px] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] overflow-hidden border-4 border-white shadow-xl">
            <Image
              src="/main-image (6).jpg"
              alt="Custom T-shirt Printing"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
