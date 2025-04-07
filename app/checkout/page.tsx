import { Suspense } from "react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CartSummary } from "@/components/checkout/cart-summary"

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Suspense fallback={<div>Loading checkout form...</div>}>
            <CheckoutForm />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Loading cart summary...</div>}>
            <CartSummary />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

