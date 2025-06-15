import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-2">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out with any questions about our products, custom printing, or wholesale
          inquiries.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#c9a55c]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-[#c9a55c]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Our Location</h3>
              <p className="text-gray-600">123 Fashion Street, Colombo</p>
              <p className="text-gray-600">Sri Lanka</p>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#c9a55c]/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-[#c9a55c]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">+94 76 048 48612</p>
              <p className="text-gray-600">Monday to Saturday, 9am - 6pm</p>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#c9a55c]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-[#c9a55c]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600">info@nived0112.com</p>
              <p className="text-gray-600">sales@nived0112.com</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-playfair text-2xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Product Inquiry"
                  className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  className="min-h-[150px] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]"
              >
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold mb-6">Visit Our Store</h2>

            <div className="aspect-video rounded-[255px_15px_225px_15px/15px_225px_15px_255px] overflow-hidden border-4 border-white shadow-md">
              <Image
                src="/placeholder.svg?height=300&width=600&text=Map"
                alt="Store location map"
                width={600}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#c9a55c] mt-0.5" />
                <div>
                  <h3 className="font-bold">Store Hours</h3>
                  <p className="text-gray-600">Monday to Friday: 10am - 7pm</p>
                  <p className="text-gray-600">Saturday: 10am - 5pm</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="h-5 w-5 text-[#c9a55c] mt-0.5" />
                <div>
                  <h3 className="font-bold">Follow Us</h3>
                  <Link
                    href="https://www.instagram.com/nived01.12?igsh=MWFkYmoxYTVjdmhsNA=="
                    className="text-[#c9a55c] hover:underline"
                    target="_blank"
                  >
                    @nived01.12
                  </Link>
                  <p className="text-gray-600">Stay updated with our latest collections and events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
