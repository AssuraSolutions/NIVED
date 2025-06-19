"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shirt,
  MessageSquare,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <BarChart3 className="h-10 w-10" />,
    },
    {
      href: "/admin/clothing",
      label: "Clothing",
      icon: <Shirt className="h-10 w-10" />,
    },

    {
      href: "/admin/custom-orders",
      label: "Custom Orders",
      icon: <MessageSquare className="h-10 w-10" />,
    },
    // {
    //   href: "/admin/settings",
    //   label: "Settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      {mounted && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform lg:translate-x-0",
          mounted
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : " lg:translate-x-0 -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Admin Header */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <Image
              src="/Logo.jpg"
              alt="NiveD 01.12 Logo"
              width={60}
              height={60}
            />
            <span className="font-playfair text-xl font-bold tracking-wider">
              NiveD <span className="text-[#c9a55c] text-md ">Admin</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-2 text-left",
                    pathname === item.href
                      ? "bg-gray-100 text-[#c9a55c] font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#c9a55c]"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#c9a55c]"
              >
                <Package className="mr-3 h-5 w-5" />
                View Store
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-red-500"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          mounted ? (sidebarOpen ? "lg:ml-64" : "ml-0") : "lg:ml-64"
        )}
      >
        <div className="min-h-screen p-4 pt-16 lg:pt-4">{children}</div>
      </main>
    </div>
  );
}
