"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Heart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useEffect, useState } from "react";

const routes = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Custom Printing", path: "/custom" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { getItemCount } = useCart();
  const { items } = useWishlist();
  const cartCount = getItemCount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-950 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`text-lg px-2 py-1 ${
                        pathname === route.path
                          ? "font-bold text-[#c9a55c]"
                          : "text-gray-700 hover:text-[#c9a55c]"
                      }`}
                    >
                      {route.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo.jpg"
                alt="NiveD 01.12 Logo"
                width={50}
                height={50}
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm ${
                  pathname === route.path
                    ? "font-bold text-[#c9a55c]"
                    : "text-gray-700 hover:text-[#c9a55c]"
                }`}
              >
                {route.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-700 dark:text-gray-300 rounded-full border border-gray-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full border border-gray-200"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#c9a55c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {items.length}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full border border-gray-200"
              asChild
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />

                {isClient && cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#c9a55c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {cartCount}
                  </Badge>
                )}

                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
