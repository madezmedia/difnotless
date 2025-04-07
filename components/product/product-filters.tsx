"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X } from "lucide-react"

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterGroup {
  name: string
  options: FilterOption[]
}

interface ProductFiltersProps {
  filters: FilterGroup[]
  priceRange?: {
    min: number
    max: number
    currency: string
  }
  onFilterChange?: (filters: Record<string, string[]>) => void
}

export function ProductFilters({ filters, priceRange, onFilterChange }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [priceValues, setPriceValues] = useState<[number, number]>([priceRange?.min || 0, priceRange?.max || 100])

  // Initialize filters from URL on component mount
  useEffect(() => {
    const initialFilters: Record<string, string[]> = {}

    // Parse filters from URL
    filters.forEach((group) => {
      const paramValue = searchParams.get(group.name.toLowerCase())
      if (paramValue) {
        initialFilters[group.name] = paramValue.split(",")
      }
    })

    // Parse price range from URL
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice && maxPrice && priceRange) {
      setPriceValues([Math.max(Number(minPrice), priceRange.min), Math.min(Number(maxPrice), priceRange.max)])
    }

    setActiveFilters(initialFilters)
  }, [searchParams, filters, priceRange])

  // Update URL and notify parent when filters change
  const updateFilters = (newFilters: Record<string, string[]>) => {
    setActiveFilters(newFilters)

    // Build new URL params
    const params = new URLSearchParams(searchParams.toString())

    // Clear existing filter params
    filters.forEach((group) => {
      params.delete(group.name.toLowerCase())
    })

    // Add new filter params
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key.toLowerCase(), values.join(","))
      }
    })

    // Add price range params
    if (priceRange) {
      params.set("minPrice", priceValues[0].toString())
      params.set("maxPrice", priceValues[1].toString())
    }

    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })

    // Notify parent component
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const toggleFilter = (group: string, value: string) => {
    const currentGroupFilters = activeFilters[group] || []
    const newGroupFilters = currentGroupFilters.includes(value)
      ? currentGroupFilters.filter((v) => v !== value)
      : [...currentGroupFilters, value]

    updateFilters({
      ...activeFilters,
      [group]: newGroupFilters,
    })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceValues([values[0], values[1]])
  }

  const handlePriceChangeEnd = () => {
    // Only update URL when user stops dragging
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", priceValues[0].toString())
    params.set("maxPrice", priceValues[1].toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })

    if (onFilterChange) {
      onFilterChange(activeFilters)
    }
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setPriceValues([priceRange?.min || 0, priceRange?.max || 100])

    // Remove all filter params from URL
    router.push(window.location.pathname, { scroll: false })

    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const hasActiveFilters =
    Object.values(activeFilters).some((group) => group.length > 0) ||
    (priceRange && (priceValues[0] > priceRange.min || priceValues[1] < priceRange.max))

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Active Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-sm">
            Clear All
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Price Range Filter */}
      {priceRange && (
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            value={priceValues}
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeEnd}
            className="py-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: priceRange.currency,
              }).format(priceValues[0])}
            </span>
            <span className="text-sm">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: priceRange.currency,
              }).format(priceValues[1])}
            </span>
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <Accordion type="multiple" className="w-full">
        {filters.map((group) => (
          <AccordionItem key={group.name} value={group.name}>
            <AccordionTrigger className="text-sm font-medium">{group.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {group.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.name}-${option.value}`}
                      checked={(activeFilters[group.name] || []).includes(option.value)}
                      onCheckedChange={() => toggleFilter(group.name, option.value)}
                    />
                    <Label htmlFor={`${group.name}-${option.value}`} className="text-sm flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                    {option.count !== undefined && (
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

