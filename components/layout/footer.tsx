import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 transition-colors duration-300 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Logo variant="light" href="/" />
            <p className="mt-4 text-sm">Sensory-friendly apparel celebrating AAC and autism acceptance.</p>

            {/* Theme toggle in footer */}
            <div className="mt-4">
              <ThemeToggle variant="outline" showLabel={true} position="footer" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 font-brand">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collections/your-words-matter" className="hover:text-white transition-colors">
                  Your Words Matter
                </Link>
              </li>
              <li>
                <Link href="/collections/different-not-less" className="hover:text-white transition-colors">
                  Different Not Less
                </Link>
              </li>
              <li>
                <Link href="/collections/slp-professional" className="hover:text-white transition-colors">
                  SLP Professional
                </Link>
              </li>
              <li>
                <Link href="/collections/bcba-rbt" className="hover:text-white transition-colors">
                  BCBA/RBT Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 font-brand">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources/aac" className="hover:text-white transition-colors">
                  AAC Resources
                </Link>
              </li>
              <li>
                <Link href="/resources/autism" className="hover:text-white transition-colors">
                  Autism Acceptance
                </Link>
              </li>
              <li>
                <Link href="/resources/sensory" className="hover:text-white transition-colors">
                  Sensory Processing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 font-brand">Join Our Community</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for educational resources, new product releases, and exclusive discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-gray-700 border-gray-600 text-white" />
              <Button className="bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 <span className="font-brand">Different Not Less Apparel</span>. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

