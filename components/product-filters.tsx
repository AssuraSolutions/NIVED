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
import { Badge } from "@/components/ui/badge";
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    []
  );
  const [sortBy, setSortBy] = useState("newest");
  const [isExpanded, setIsExpanded] = useState(true);
  const [clothingTypes, setClothingTypes] = useState<ClothingType[]>([]);

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    
  ];


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

  const toggleSize = (size: string) => {
    const isSelected = selectedSizes.includes(size);
    handleSizeChange(size, !isSelected);
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
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setSelectedClothingTypes([]);
    setSortBy("newest");
    onClearFilters();
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedClothingTypes.length > 0 ||
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

          {/* Sizes single-select dropdown */}
          <Card className="border-[#c9a55c]/20">
            <CardContent className="p-4">
              <Label className="font-medium text-gray-700 mb-4 block">
                Sizes
              </Label>
              <Select
                value={selectedSizes[0] || ""}
                onValueChange={(value) => {
                  setSelectedSizes(value ? [value] : []);
                  updateFilters({ sizes: value ? [value] : [] });
                }}
              >
                <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[#c9a55c]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* {selectedSizes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedSizes.map((size) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="text-xs bg-[#c9a55c]/10 text-[#c9a55c]"
                    >
                      {size}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => toggleSize(size)}
                      />
                    </Badge>
                  ))}
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Clothing Types multi-select checkboxes */}
          <Card className="border-[#c9a55c]/20">
            <CardContent className="p-5 ">
              <Label className="font-medium text-gray-700 mb-4 block">
                Clothing Types
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-hidden">
                {clothingTypes.length === 0 && <p>Loading...</p>}
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
                      className="cursor-pointer"
                    >
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>

              {/* {selectedClothingTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedClothingTypes.map((id) => {
                    const name =
                      clothingTypes.find((c) => c.id === id)?.name || id;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-xs bg-[#c9a55c]/10 text-[#c9a55c]"
                      >
                        {name}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleClothingTypeChange(id, false)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )} */}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
