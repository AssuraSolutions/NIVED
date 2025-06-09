"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  compact?: boolean;
}

export default function ProductFilters({
  onFiltersChange,
  onClearFilters,
  compact = false,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  // const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [isExpanded, setIsExpanded] = useState(true);

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "2T",
    "3T",
    "4T",
    "5T",
    "6",
    "8",
    "10",
    "12",
  ];
  // const colors = [
  //   { name: "black", value: "#000000" },
  //   { name: "white", value: "#FFFFFF" },
  //   { name: "gray", value: "#6B7280" },
  //   { name: "blue", value: "#3B82F6" },
  //   { name: "red", value: "#EF4444" },
  //   { name: "green", value: "#10B981" },
  //   { name: "yellow", value: "#F59E0B" },
  //   { name: "navy", value: "#1E3A8A" },
  // ];

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter((s) => s !== size);
    setSelectedSizes(newSizes);
    updateFilters({ sizes: newSizes });
  };

  // const handleColorChange = (color: string, checked: boolean) => {
  //   const newColors = checked
  //     ? [...selectedColors, color]
  //     : selectedColors.filter((c) => c !== color);
  //   setSelectedColors(newColors);
  //   updateFilters({ colors: newColors });
  // };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    updateFilters({ priceRange: value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const updateFilters = (updates: any) => {
    onFiltersChange({
      priceRange,
      sizes: selectedSizes,
      // colors: selectedColors,
      sortBy,
      search: "",
      ...updates,
    });
  };

  const clearAllFilters = () => {
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    // setSelectedColors([]);
    setSortBy("newest");
    onClearFilters();
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    // selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-44 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c] bg-white/80">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            onClick={clearAllFilters}
            variant="outline"
            size="sm"
            className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c] hover:bg-[#c9a55c] hover:text-white bg-white/80"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#c9a55c]" />
          <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-[#c9a55c] hover:text-[#b08d4a] hover:bg-[#c9a55c]/10"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Sort */}
          {/* <Card className="border-[#c9a55c]/20">
            <CardContent className="p-4">
              <Label className="font-medium text-gray-700 mb-3 block">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card> */}

          {/* Price Range */}
          <Card className="border-[#c9a55c]/20">
            <CardContent className="p-4">
              <Label className="font-medium text-gray-700 mb-4 block">
                Price Range
              </Label>
              <div className="px-2 space-y-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={priceRange[0]}
                    min={0}
                    max={priceRange[1]}
                    onChange={(e) => {
                      const val = Math.min(
                        priceRange[1],
                        Math.max(0, Number(e.target.value))
                      );
                      handlePriceChange([val, priceRange[1]]);
                    }}
                    className="w-full border rounded px-2 py-1 text-sm text-gray-800"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    min={priceRange[0]}
                    max={100}
                    onChange={(e) => {
                      const val = Math.max(
                        priceRange[0],
                        Math.min(100, Number(e.target.value))
                      );
                      handlePriceChange([priceRange[0], val]);
                    }}
                    className="w-full border rounded px-2 py-1 text-sm text-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card className="border-[#c9a55c]/20">
            <CardContent className="p-4">
              <Label className="font-medium text-gray-700 mb-4 block">
                Sizes
              </Label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center justify-center">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked) =>
                        handleSizeChange(size, checked as boolean)
                      }
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className={`w-full h-10 flex items-center justify-center text-sm font-medium rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-[#c9a55c] text-white border-[#c9a55c]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#c9a55c] hover:bg-[#c9a55c]/5"
                      }`}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedSizes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSizes.map((size) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="text-xs bg-[#c9a55c]/10 text-[#c9a55c]"
                    >
                      {size}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleSizeChange(size, false)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          {/* <Card className="border-[#c9a55c]/20">
            <CardContent className="p-4">
              <Label className="font-medium text-gray-700 mb-4 block">
                Colors
              </Label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-3 cursor-pointer transition-all ${
                        selectedColors.includes(color.name)
                          ? "border-[#c9a55c] ring-2 ring-[#c9a55c] ring-offset-2 scale-110"
                          : "border-gray-300 hover:border-[#c9a55c] hover:scale-105"
                      } ${color.name === "white" ? "shadow-md" : ""}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        handleColorChange(
                          color.name,
                          !selectedColors.includes(color.name)
                        )
                      }
                    />
                    <span className="text-xs capitalize font-medium text-gray-600">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
              {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedColors.map((color) => (
                    <Badge
                      key={color}
                      variant="secondary"
                      className="text-xs capitalize bg-[#c9a55c]/10 text-[#c9a55c]"
                    >
                      {color}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleColorChange(color, false)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}
        </>
      )}
    </div>
  );
}
