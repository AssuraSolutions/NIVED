import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "NiveD 01.12 | Premium Fashion & Lifestyle",
    template: "%s | NiveD 01.12",
  },
  description:
    "Discover premium clothing and lifestyle products at NiveD 01.12. Shop sustainable, stylish, and timeless fashion pieces curated for quality and comfort.",
  keywords: [
    "NiveD",
    "fashion",
    "lifestyle",
    "organic clothing",
    "sustainable fashion",
    "unisex wear",
    "Sri Lanka fashion",
    "premium clothing",
  ],
  authors: [{ name: "NiveD 01.12", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "NiveD 01.12 Team",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nived-store.com"
  ),
  openGraph: {
    title: "NiveD 01.12 | Premium Fashion & Lifestyle",
    description:
      "Explore our collection of premium, eco-conscious fashion and lifestyle products.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://nived-store.com",
    siteName: "NiveD 01.12",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`, // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "NiveD 01.12 - Premium Lifestyle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NiveD 01.12 | Premium Fashion & Lifestyle",
    description:
      "Explore our collection of premium, eco-conscious fashion and lifestyle products.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`], // Replace with real image URL
    creator: "@nived0112", // Replace with your actual Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  // themeColor: "#ffffff",
  // manifest: "/site.webmanifest",
  // viewport:
  //   "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  // category: "fashion",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
