"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useCart } from "@/components/cart/cart-provider"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SearchDialog } from "@/components/search/search-dialog"
import { ThemeToggle } from "@/components/theme/theme-toggle"

const collections = [
  { name: "Your Words Matter", href: "/collections/your-words-matter" },
  { name: "Different Not Less", href: "/collections/different-not-less" },
  { name: "SLP Professional", href: "/collections/slp-professional" },
  { name: "BCBA/RBT", href: "/collections/bcba-rbt" },
]

const audiences = [
  { name: "Speech-Language Pathologists", href: "/audience/slp" },
  { name: "Special Education Teachers", href: "/audience/special-education" },
  { name: "Parents & Families", href: "/audience/families" },
  { name: "Behavior Analysts", href: "/audience/behavior-analysts" },
]

export function Header() {
  const pathname = usePathname()
  const { isCartOpen, setIsCartOpen, cartCount = 0 } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-100/50 dark:border-gray-800/50 bg-soft-cream/80 dark:bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-soft-cream/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <Logo href="/" />
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-6">
                  <div className="space-y-3">
                    <h4 className="text-base font-medium font-brand">Collections</h4>
                    {collections.map((collection) => (
                      <Link
                        key={collection.href}
                        href={collection.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base text-muted-foreground hover:text-foreground"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-base font-medium font-brand">Audience</h4>
                    {audiences.map((audience) => (
                      <Link
                        key={audience.href}
                        href={audience.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base text-muted-foreground hover:text-foreground"
                      >
                        {audience.name}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-base font-medium font-brand">Resources</h4>
                    <Link
                      href="/resources"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-muted-foreground hover:text-foreground"
                    >
                      Educational Resources
                    </Link>
                    <Link
                      href="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-muted-foreground hover:text-foreground"
                    >
                      Blog
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-base font-medium font-brand">About</h4>
                    <Link
                      href="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-muted-foreground hover:text-foreground"
                    >
                      Our Story
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base text-muted-foreground hover:text-foreground"
                    >
                      Contact Us
                    </Link>
                  </div>

                  {/* Theme toggle in mobile menu */}
                  <div className="pt-4 border-t">
                    <h4 className="text-base font-medium font-brand mb-3">Theme</h4>
                    <ThemeToggle showLabel={true} />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Use Logo with href directly instead of wrapping it in a Link */}
            <Logo href="/" />

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-brand text-base">Collections</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      {collections.map((collection) => (
                        <li key={collection.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={collection.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-base font-medium leading-none">{collection.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-brand text-base">Audience</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      {audiences.map((audience) => (
                        <li key={audience.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={audience.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-base font-medium leading-none">{audience.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/resources" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-brand text-base`}>
                      Resources
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-brand text-base`}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-brand text-base`}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle in header - desktop only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => {
                try {
                  setIsCartOpen(true)
                } catch (error) {
                  console.error("Error opening cart:", error)
                  // Show a toast or other notification
                }
              }}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-xs text-white font-brand">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

