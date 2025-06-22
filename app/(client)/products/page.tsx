"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import ProductFilters from "@/components/product-filters";
import Pagination from "@/components/pagination";
import type { Product } from "@/lib/types";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 12,
  });

  const [currentFilters, setCurrentFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    sizes: [] as string[],
    colors: [] as string[],
    clothingTypes: [] as string[],
    sortBy: "newest",
    search: "",
  });

  const loadProducts = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        // Pagination
        params.append("page", page.toString());
        params.append("limit", pagination.limit.toString());

        // Filters
        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        if (currentFilters.priceRange[0] > 0) {
          params.append("minPrice", currentFilters.priceRange[0].toString());
        }

        if (currentFilters.priceRange[1] < 5000) {
          params.append("maxPrice", currentFilters.priceRange[1].toString());
        }

        currentFilters.clothingTypes.forEach((id) => {
          params.append("clothingTypeIds", id);
        });

        currentFilters.sizes.forEach((size) => {
          params.append("sizes", size);
        });

        currentFilters.colors.forEach((color) => {
          params.append("colors", color);
        });

        if (currentFilters.sortBy) {
          params.append("sortBy", currentFilters.sortBy);
        }

        console.log("Fetching products with params:", params.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products || []);
        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            limit: 12,
          }
        );
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          limit: 12,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, currentFilters, pagination.limit]
  );

  // Load products when filters change
  useEffect(() => {
    loadProducts(1); // Reset to page 1 when filters change
  }, [currentFilters, searchTerm]);

  const handleFiltersChange = (filters: Partial<typeof currentFilters>) => {
    console.log("FILTER CHANGED:", filters);
    setCurrentFilters((prev) => ({
      ...prev,
      ...filters,
      sizes: filters.sizes ?? prev.sizes,
      colors: filters.colors ?? prev.colors,
      priceRange: filters.priceRange ?? prev.priceRange,
      sortBy: filters.sortBy ?? prev.sortBy,
      search: filters.search ?? prev.search,
      clothingTypes: filters.clothingTypes ?? prev.clothingTypes,
    }));
  };

  const handleClearFilters = () => {
    setCurrentFilters({
      priceRange: [0, 5000],
      sizes: [],
      colors: [],
      sortBy: "newest",
      search: "",
      clothingTypes: [],
    });
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    loadProducts(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(1); // Reset to page 1 for new search
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Our Collection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Handcrafted unisex vintage clothing with a nostalgic touch.
              Designed and manufactured in Ceylon with care and attention to
              detail.
            </p>
          </div>

          <div className="mb-8">
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] focus:border-[#b08d4a] bg-white/80 backdrop-blur-sm"
              />
            </form>
          </div>

          {/* Filters and Product Grid */}
          <div className="flex gap-8">
            <div
              className={`${
                showFilters ? "block lg:w-80" : "hidden lg:w-0"
              } transition-all duration-300 mb-8 lg:mb-0`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] p-6 sticky top-4">
                <ProductFilters
                  filters={currentFilters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            <div
              className={`${
                showFilters ? "lg:flex-1" : "lg:flex-[1.25]"
              } w-full transition-all duration-300`}
            >
              <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] p-4">
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {isLoading
                      ? "Loading..."
                      : `${pagination.totalCount} products found`}
                  </p>
                  {pagination.totalCount > 0 && (
                    <span className="text-sm text-gray-500">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  )}
                </div>
                <div className="mb-6 flex justify-center lg:justify-end gap-1">
                  <div className="hidden lg:block ">
                    <ProductFilters
                      filters={currentFilters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      compact
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] hover:bg-[#c9a55c] hover:text-white"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ProductGrid products={products} />

                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                  />
                </>
              )}

              {!isLoading && products.length === 0 && (
                <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c]">
                  <div className="max-w-md mx-auto">
                    <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Try adjusting your filters or search terms to find what
                      you're looking for.
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="bg-[#c9a55c] hover:bg-[#b08d4a] text-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#c9a55c] px-8 py-3"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
