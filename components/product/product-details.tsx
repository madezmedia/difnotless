"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ProductInventoryStatus } from "@/components/product/product-inventory"

interface ProductDetailsProps {
  product: any
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, isLoading } = useCart()
  const [mainImage, setMainImage] = useState(product.images[0])
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  // Group variants by option name
  const options: Record<string, Set<string>> = {}

  product.variants.forEach((variant: any) => {
    variant.selectedOptions.forEach((option: any) => {
      if (!options[option.name]) {
        options[option.name] = new Set()
      }
      options[option.name].add(option.value)
    })
  })

  // Convert options to array
  const optionsArray = Object.entries(options).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }))

  // Track selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  // Update selected options
  const handleOptionChange = (name: string, value: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [name]: value,
    }

    setSelectedOptions(newSelectedOptions)

    // Find matching variant
    const matchingVariant = product.variants.find((variant: any) => {
      return variant.selectedOptions.every((option: any) => {
        return newSelectedOptions[option.name] === option.value
      })
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedVariant) {
      // Show a message to select options if no variant is selected
      toast({
        title: "Please select options",
        description: "Please select all required options before adding to cart",
        variant: "destructive",
      })
      return
    }

    if (!selectedVariant.availableForSale) {
      toast({
        title: "Out of stock",
        description: "This product variant is currently out of stock",
        variant: "destructive",
      })
      return
    }

    // Check if the requested quantity is available
    if (selectedVariant.quantityAvailable && quantity > selectedVariant.quantityAvailable) {
      toast({
        title: "Insufficient stock",
        description: `Only ${selectedVariant.quantityAvailable} items available`,
        variant: "destructive",
      })
      return
    }

    addItem(selectedVariant.id, quantity)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg bg-gray-100 aspect-square">
          <Image
            src={mainImage?.url || "/placeholder.svg?height=600&width=600"}
            alt={mainImage?.altText || product.title}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image: any, i: number) => (
            <button
              key={i}
              className={`relative overflow-hidden rounded-md aspect-square ${
                mainImage?.url === image.url ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setMainImage(image)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Product view ${i + 1}`}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <div className="flex gap-2 mb-3">
            {product.collections.map((collection: any) => (
              <Badge key={collection.id} variant="secondary">
                {collection.title}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="mt-2">
            <p className="text-2xl font-semibold">
              {selectedVariant
                ? formatPrice(selectedVariant.price, selectedVariant.currencyCode)
                : formatPrice(product.price, product.currencyCode)}
            </p>
          </div>

          {selectedVariant && (
            <div className="mt-2">
              <ProductInventoryStatus product={{ variants: [selectedVariant] }} />
              {selectedVariant.quantityAvailable > 0 && selectedVariant.quantityAvailable <= 10 && (
                <p className="text-sm text-amber-600 mt-1">Only {selectedVariant.quantityAvailable} left in stock</p>
              )}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        </div>

        <div className="space-y-4 pt-2">
          {/* Product Options */}
          {optionsArray.map((option) => (
            <div key={option.name}>
              <Label htmlFor={option.name} className="mb-2 block">
                {option.name}
              </Label>

              <RadioGroup
                id={option.name}
                value={selectedOptions[option.name] || ""}
                onValueChange={(value) => handleOptionChange(option.name, value)}
                className="grid grid-cols-4 gap-2"
              >
                {option.values.map((value) => {
                  // Check if this option value is available
                  const isAvailable = product.variants.some((variant: any) => {
                    return (
                      variant.selectedOptions.some((opt: any) => opt.name === option.name && opt.value === value) &&
                      variant.availableForSale
                    )
                  })

                  return (
                    <div key={value}>
                      <RadioGroupItem
                        value={value}
                        id={`${option.name}-${value}`}
                        className="peer sr-only"
                        disabled={!isAvailable}
                      />
                      <Label
                        htmlFor={`${option.name}-${value}`}
                        className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium 
                          ${
                            !isAvailable
                              ? "border-muted bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                              : "border-input bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                          }`}
                      >
                        {value}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="quantity" className="w-24">
              Quantity
            </Label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <div className="flex h-8 w-12 items-center justify-center border-y border-input text-center text-sm font-medium">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 mt-6">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90"
              onClick={handleAddToCart}
              disabled={!selectedVariant || !selectedVariant.availableForSale || isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Sensory Features */}
        <div className="border rounded-lg p-4 mt-8">
          <h3 className="font-medium mb-2">Sensory-Friendly Features</h3>
          <div className="flex flex-wrap gap-2">
            {product.sensoryDetails.features.map((feature: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-light-mint">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="md:col-span-2 mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Product Details
            </TabsTrigger>
            <TabsTrigger
              value="sensory"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Sensory Specifications
            </TabsTrigger>
            <TabsTrigger
              value="care"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Care Instructions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-6">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Features</h4>
                <ul className="space-y-2">
                  {product.sensoryDetails.features.map((feature: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Specifications</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="font-medium">Material</div>
                  <div>{product.sensoryDetails.material}</div>
                  <div className="font-medium">Weight</div>
                  <div>{product.sensoryDetails.weight}</div>
                  <div className="font-medium">Tag Type</div>
                  <div>{product.sensoryDetails.tagType}</div>
                  <div className="font-medium">Print Method</div>
                  <div>{product.sensoryDetails.printMethod}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensory" className="pt-6">
            <div className="space-y-6">
              <p className="text-lg">{product.sensoryDetails.sensorySuitability}</p>

              <div>
                <h4 className="text-lg font-medium mb-4">Material Details</h4>
                <p>{product.sensoryDetails.materialDetails}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-light-mint p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Fabric</h5>
                  <p>{product.sensoryDetails.material}</p>
                  <p className="mt-2">Weight: {product.sensoryDetails.weight}</p>
                </div>

                <div className="bg-light-mint p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Construction</h5>
                  <p>Tag Type: {product.sensoryDetails.tagType}</p>
                  <p className="mt-2">Print Method: {product.sensoryDetails.printMethod}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="care" className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-light-mint p-4 rounded-md">
                  <h5 className="font-medium mb-2">Washing</h5>
                  <p>{product.sensoryDetails.careInstructions.washing}</p>
                </div>
                <div className="bg-light-mint p-4 rounded-md">
                  <h5 className="font-medium mb-2">Drying</h5>
                  <p>{product.sensoryDetails.careInstructions.drying}</p>
                </div>
                <div className="bg-light-mint p-4 rounded-md">
                  <h5 className="font-medium mb-2">Ironing</h5>
                  <p>{product.sensoryDetails.careInstructions.ironing}</p>
                </div>
                <div className="bg-light-mint p-4 rounded-md">
                  <h5 className="font-medium mb-2">Special Care</h5>
                  <p>{product.sensoryDetails.careInstructions.special}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Always refer to the care label on your specific garment for the most accurate care instructions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

