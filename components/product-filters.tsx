"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { X, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  filters: {
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    clothingTypes: string[];
    sortBy: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  compact?: boolean;
}

interface ClothingType {
  id: string;
  name: string;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  compact = false,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    []
  );
  const [sortBy, setSortBy] = useState("newest");
  const [clothingTypes, setClothingTypes] = useState<ClothingType[]>([]);

  const sizes = ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    setPriceRange(filters.priceRange);
    setSelectedSizes(filters.sizes);
    setSelectedClothingTypes(filters.clothingTypes);
    setSortBy(filters.sortBy);
  }, [filters]);

  useEffect(() => {
    async function fetchClothingTypes() {
      try {
        const res = await fetch("/api/clothing-type");
        if (!res.ok) throw new Error("Failed to fetch clothing types");
        const data: ClothingType[] = await res.json();
        setClothingTypes(data);
      } catch (error) {
        console.error("Error loading clothing types:", error);
      }
    }
    fetchClothingTypes();
  }, []);

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter((s) => s !== size);
    setSelectedSizes(newSizes);
    updateFilters({ sizes: newSizes });
  };

  const handleClothingTypeChange = (typeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedClothingTypes, typeId]
      : selectedClothingTypes.filter((id) => id !== typeId);

    setSelectedClothingTypes(newSelected);
    updateFilters({ clothingTypes: newSelected });
  };

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
      clothingTypes: selectedClothingTypes,
      sortBy,
      search: "",
      ...updates,
    });
  };

  const clearAllFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSelectedClothingTypes([]);
    setSortBy("newest");
    onClearFilters();
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedClothingTypes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000;

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
                max={5000}
                onChange={(e) => {
                  const val = Math.max(
                    priceRange[0],
                    Math.min(5000, Number(e.target.value))
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
          <Label className="font-medium text-gray-700 mb-4 block">Sizes</Label>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) =>
                    handleSizeChange(size, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`size-${size}`}
                  className="cursor-pointer text-sm"
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clothing Types */}
      <Card className="border-[#c9a55c]/20">
        <CardContent className="p-4">
          <Label className="font-medium text-gray-700 mb-4 block">
            Clothing Types
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {clothingTypes.length === 0 && (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
            {clothingTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`clothing-type-${type.id}`}
                  checked={selectedClothingTypes.includes(type.id)}
                  onCheckedChange={(checked) =>
                    handleClothingTypeChange(type.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`clothing-type-${type.id}`}
                  className="cursor-pointer text-sm"
                >
                  {type.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
