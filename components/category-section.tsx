import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Unisex Collection",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/unisex",
    description: "T-shirts, Shirts & Trousers",
  },
  {
    name: "Limited Editions",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/limited",
    description: "Exclusive designs and prints",
  },
  // {
  //   name: "Kids Collection",
  //   image: "/placeholder.svg?height=400&width=300",
  //   link: "/category/kids",
  //   description: "T-shirts, Shirts & Shorts",
  // },
];

export default function CategorySection() {
  return (
    <section className="py-16">
      <h2 className="font-playfair text-3xl font-bold text-center text-gray-900 mb-4">
        Shop by Collection
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Designed and manufactured in Ceylon with love
      </p>
      <div className="flex flex-wrap justify-evenly gap-1">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.link}
            className="group relative w-[400px] overflow-hidden rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-white/80">{category.description}</p>
                <span className="inline-block mt-3 text-[#c9a55c] group-hover:underline">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
