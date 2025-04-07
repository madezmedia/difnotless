"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ProductFilters } from "@/components/product/product-filters"
import { SlidersHorizontal } from "lucide-react"

interface CollectionFiltersProps {
  products: any[]
  onFilterChange?: (filteredProducts: any[]) => void
}

export function CollectionFilters({ products, onFilterChange }: CollectionFiltersProps) {
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(products)

  // Extract available filters from products
  const extractFilters = () => {
    // Extract all tags
    const allTags = products.flatMap((product) => product.tags || [])
    const tagCounts: Record<string, number> = {}

    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })

    const tagOptions = Object.entries(tagCounts)
      .map(([tag, count]) => ({
        label: tag,
        value: tag,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    // Extract price range
    let minPrice = Number.MAX_VALUE
    let maxPrice = 0
    let currency = "USD"

    products.forEach((product) => {
      const price = Number.parseFloat(product.price)
      if (price < minPrice) minPrice = price
      if (price > maxPrice) maxPrice = price
      currency = product.currencyCode || currency
    })

    // Round price range for better UX
    minPrice = Math.floor(minPrice)
    maxPrice = Math.ceil(maxPrice)

    return {
      filters: [
        {
          name: "Tags",
          options: tagOptions,
        },
      ],
      priceRange: {
        min: minPrice,
        max: maxPrice,
        currency,
      },
    }
  }

  // Apply filters to products
  const applyFilters = (filters: Record<string, string[]>) => {
    // Get price range from URL
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "999999")

    // Filter products
    const filtered = products.filter((product) => {
      // Check price
      const price = Number.parseFloat(product.price)
      if (price < minPrice || price > maxPrice) return false

      // Check tags
      const tagFilters = filters["Tags"] || []
      if (tagFilters.length > 0) {
        const productTags = product.tags || []
        if (!tagFilters.some((tag) => productTags.includes(tag))) {
          return false
        }
      }

      return true
    })

    setFilteredProducts(filtered)

    if (onFilterChange) {
      onFilterChange(filtered)
    }
  }

  // Apply filters when URL params change
  useEffect(() => {
    const activeFilters: Record<string, string[]> = {}

    // Parse tag filters from URL
    const tagParam = searchParams.get("tags")
    if (tagParam) {
      activeFilters["Tags"] = tagParam.split(",")
    }

    applyFilters(activeFilters)
  }, [searchParams, products])

  const handleFilterChange = (filters: Record<string, string[]>) => {
    applyFilters(filters)
  }

  const filterData = extractFilters()
  const activeFilterCount = Object.values(filterData.filters)
    .flatMap((group) => group.options)
    .filter((option) => searchParams.toString().includes(option.value)).length

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ProductFilters
              filters={filterData.filters}
              priceRange={filterData.priceRange}
              onFilterChange={handleFilterChange}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

