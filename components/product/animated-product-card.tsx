"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ShoppingBag, Eye } from "lucide-react"

interface Product {
  id: string
  title: string
  handle: string
  price: string
  currencyCode: string
  image?: string
  imageAlt?: string
  availableForSale?: boolean
}

interface AnimatedProductCardProps {
  product: Product
}

export function AnimatedProductCard({ product }: AnimatedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleHoverStart = () => {
    if (!prefersReducedMotion) setIsHovered(true)
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 border border-gray-100/50 dark:border-gray-800/50 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95 shadow-sm hover:shadow-md">
        <Link
          href={`/products/${product.handle}`}
          className="relative focus:outline-none group overflow-hidden"
          aria-label={`View ${product.title} product details`}
        >
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {product.image ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.imageAlt || `Product image of ${product.title}`}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Quick view overlay */}
            <motion.div
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button size="sm" variant="secondary" className="gap-2">
                <Eye size={16} />
                <span>Quick View</span>
              </Button>
            </motion.div>
          </div>

          {product.availableForSale === false && (
            <Badge className="absolute top-3 right-3 bg-destructive">Sold Out</Badge>
          )}

          {/* Accessible focus indicator that doesn't interfere with design */}
          <div className="absolute inset-0 ring-2 ring-transparent ring-offset-2 transition-all group-focus-visible:ring-teal rounded-md pointer-events-none"></div>
        </Link>

        <CardContent className="flex-grow pt-6">
          <Link
            href={`/products/${product.handle}`}
            className="hover:underline focus:outline-none focus-visible:underline focus-visible:text-teal"
          >
            <h3 className="font-medium text-lg mb-2">{product.title}</h3>
          </Link>
          <p className="font-bold" aria-label={`Price: ${formatPrice(product.price, product.currencyCode)}`}>
            {formatPrice(product.price, product.currencyCode)}
          </p>
        </CardContent>

        <CardFooter className="border-t border-gray-100/50 dark:border-gray-700/50 pt-4">
          <Button
            asChild
            className="w-full gap-2 bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90 btn-animated"
            disabled={product.availableForSale === false}
          >
            <Link href={`/products/${product.handle}`}>
              {product.availableForSale === false ? (
                "Sold Out"
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>View Product</span>
                </>
              )}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

