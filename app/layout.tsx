import type React from "react"
import { Inter, Outfit, Permanent_Marker, Caveat } from "next/font/google"
import ClientLayout from "./client-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const permanentMarker = Permanent_Marker({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
})

export const metadata = {
  title: {
    default: "Different Not Less Apparel",
    template: "%s | Different Not Less Apparel",
  },
  description: "Sensory-friendly apparel celebrating AAC and autism acceptance",
  keywords: ["AAC", "autism acceptance", "sensory-friendly", "apparel", "SLP", "BCBA", "neurodiversity"],
  authors: [{ name: "Different Not Less Apparel" }],
  creator: "Different Not Less Apparel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://difnotless.com",
    title: "Different Not Less Apparel",
    description: "Sensory-friendly apparel celebrating AAC and autism acceptance",
    siteName: "Different Not Less Apparel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Different Not Less Apparel",
    description: "Sensory-friendly apparel celebrating AAC and autism acceptance",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${permanentMarker.variable} ${caveat.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}



import './globals.css'