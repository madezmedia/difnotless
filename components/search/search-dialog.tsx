"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { searchProducts } from "@/lib/shopify"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for quick links
const collections = [
  { id: "your-words-matter", name: "Your Words Matter", href: "/collections/your-words-matter" },
  { id: "different-not-less", name: "Different Not Less", href: "/collections/different-not-less" },
  { id: "slp-professional", name: "SLP Professional", href: "/collections/slp-professional" },
  { id: "bcba-rbt", name: "BCBA/RBT Collection", href: "/collections/bcba-rbt" },
]

const quickLinks = [
  { name: "Educational Resources", href: "/resources" },
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const results = await searchProducts(searchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error("Error searching products:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSelect = (href: string) => {
    router.push(href)
    onOpenChange(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Find products, collections, and resources</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search for anything..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            {isSearching && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            <CommandEmpty>No results found.</CommandEmpty>

            {searchResults.length > 0 && (
              <CommandGroup heading="Products">
                {searchResults.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => handleSelect(`/products/${product.handle}`)}
                    className="flex items-center gap-2 py-2"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                      {product.image ? (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.imageAlt || product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span>{product.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(product.price, product.currencyCode)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchQuery.length < 2 && (
              <>
                <CommandGroup heading="Collections">
                  {collections.map((collection) => (
                    <CommandItem key={collection.id} onSelect={() => handleSelect(collection.href)}>
                      {collection.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Quick Links">
                  {quickLinks.map((link) => (
                    <CommandItem key={link.href} onSelect={() => handleSelect(link.href)}>
                      {link.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

