import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sd1oqj0Qn2BELzBjbSaVztoHioC5Ox.png"
                alt="NiveD 01.12 Logo"
                width={60}
                height={60}
              />
            </div>
            <p className="text-gray-600 max-w-xs">
              Handcrafted unisex vintage clothing with a nostalgic touch. Designed and manufactured in Ceylon.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/nived01.12?igsh=MWFkYmoxYTVjdmhsNA=="
                className="text-gray-600 hover:text-[#c9a55c]"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#c9a55c]">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#c9a55c]">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/unisex" className="text-gray-600 hover:text-[#c9a55c]">
                  Unisex Collection
                </Link>
              </li>
              <li>
                <Link href="/category/limited" className="text-gray-600 hover:text-[#c9a55c]">
                  Limited Editions
                </Link>
              </li>
              <li>
                <Link href="/category/kids" className="text-gray-600 hover:text-[#c9a55c]">
                  Kids Collection
                </Link>
              </li>
              <li>
                <Link href="/custom" className="text-gray-600 hover:text-[#c9a55c]">
                  Custom Printing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#c9a55c]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#c9a55c]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#c9a55c]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#c9a55c]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic text-gray-600 space-y-2">
              <p>123 Vintage Street</p>
              <p>Fashion District, FD 12345</p>
              <p>Email: info@nived0112.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} NiveD 01.12. All rights reserved.</p>
          <p className="mt-2">Designed and manufactured in Ceylon with care and attention to detail.</p>
        </div>
      </div>
    </footer>
  )
}
